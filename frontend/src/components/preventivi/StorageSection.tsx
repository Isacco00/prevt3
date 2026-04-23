import React, {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {Input} from '@/components/ui/input.tsx';
import {Label} from '@/components/ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import {Calculator, Info} from 'lucide-react';
import {Checkbox} from '@/components/ui/checkbox.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table.tsx';
import {PreventivoBean} from "@/types/preventivo.ts";
import {ParametriAPI} from "@/api/parametri.ts";
import {ParametriBean, ListinoServiziPrezzoUnitarioBean} from "@/types/parametri.ts";

interface StorageSectionProps {
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}

export function StorageSection({formData, setFormData}: StorageSectionProps) {
  // Se non lo usi davvero, rimuovilo per evitare warning
  const {data: parametri = []} = useQuery({
    queryKey: ["parametri-for-preventivi"],
    queryFn: () =>
        ParametriAPI.getParametriList({
          sortFields: [
            {field: "PARAMETRI_TIPO", desc: false},
            {field: "PARAMETRI_ORDINE", desc: false},
          ],
        }),
  });

  const profiliDistribuzioneMap = useMemo(() => {
    const map: Record<number, number> = {};
    for (const p of parametri as ParametriBean[]) {
      if (p?.tipo === "profili_distribuzione") {
        const key = Number(p?.nome);
        if (Number.isFinite(key)) map[key] = Number(p?.valore);
      }
    }
    return map;
  }, [parametri]);

  // Fetch listino servizi
  const {
    data: listinoServizi = []
  } = useQuery({
    queryKey: ['listino-servizi-prezzo-unitario'],
    queryFn: () => ParametriAPI.getListinoServiziPrezzoUnitario({
      attivo: true, sortFields: [{
        field: "LISTINO_SERVIZI_PREZZO_UNITARIO_PARAMETRO",
        desc: false
      }]
    })
  });

  // Fetch accessori stand from database
  const {
    data: accessoriStand = [],
  } = useQuery({
    queryKey: ["listino-accessori-stand", true],
    queryFn: () => ParametriAPI.getListinoAccessoriStand({
      attivo: true, sortFields: [{
        field: "LISTINO_ACCESSORI_STAND_NAME",
        desc: false
      }]
    }),
  });

  // Calcolo degli elementi fisici per Storage
  const storageElements = useMemo(() => {
    if (!formData.larghezzaStorage || !formData.profonditaStorage || !formData.altezzaStorage || !formData.layoutStorage) {
      return {
        superficieStampa: 0,
        sviluppoLineare: 0,
        numeroPezzi: 0
      };
    }

    const larg = formData.larghezzaStorage;
    const prof = formData.profonditaStorage;
    const alt = formData.altezzaStorage;
    const layout = formData.layoutStorage;
    const distribuzione = formData.distribuzione;
    const numeroPorte = parseInt(formData.numeroPorte) || 0;
    const superficiePorte = numeroPorte * 2;

    // Superficie di stampa Storage
    let superficieStampa = 0;
    switch (layout) {
      case '4_lati':
        superficieStampa = (2 * larg + 2 * prof) * alt + superficiePorte;
        break;
      case '3_lati':
        superficieStampa = (larg + 2 * prof) * alt + superficiePorte;
        break;
      case '2_lati':
        superficieStampa = (larg + prof) * alt + superficiePorte;
        break;
      case '0_lati':
      default:
        superficieStampa = 0;
        break;
    }

    // Sviluppo in metri lineari Storage
    let sviluppoLineare = 0;
    switch (layout) {
      case '4_lati':
        sviluppoLineare = 2 * larg + 2 * prof + numeroPorte;
        break;
      case '3_lati':
        sviluppoLineare = larg + 2 * prof + numeroPorte;
        break;
      case '2_lati':
        sviluppoLineare = larg + prof + numeroPorte;
        break;
      case '0_lati':
      default:
        sviluppoLineare = 0;
        break;
    }

    // Numero di pezzi Storage
    const fattoreDistribuzione = profiliDistribuzioneMap[distribuzione] || 0;
    const numeroPezzi = sviluppoLineare * fattoreDistribuzione;

    return {
      superficieStampa,
      sviluppoLineare,
      numeroPezzi
    };
  }, [formData.larghezzaStorage, formData.profonditaStorage, formData.altezzaStorage, formData.layoutStorage, formData.distribuzione, formData.numeroPorte, profiliDistribuzioneMap]);

  // Calcolo dei costi Storage
  const storageCosts = useMemo(() => {
    if (!formData.larghezzaStorage || !formData.profonditaStorage || !formData.altezzaStorage || !parametri.length) {
      return {
        costoStrutturaStorage: 0,
        costoGraficaStorage: 0,
        costoPremontaggioStorage: 0,
        costoTotaleStorage: 0,
        costoTotaleStorageNoleggio: 0,
        prezzoStrutturaStorage: 0,
        prezzoGraficaStorage: 0,
        prezzoPremontaggioStorage: 0,
      };
    }

    // Trova i parametri necessari
    const costoStampaParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Stampa Grafica');
    const costoPremontaggioParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Premontaggio');
    const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valoreChiave === String(formData.altezzaStorage));

    // Trova il costo della porta dagli accessori stand
    const portaAccessorio = accessoriStand.find(acc => acc.nome?.toLowerCase().includes('porta'));
    const costoPorta = portaAccessorio ? portaAccessorio.costoUnitario : 0;
    const numeroPorte = parseInt(formData.numeroPorte) || 0;

    // Costo struttura a terra storage: sviluppo lineare * costo struttura al m/l in funzione altezza + numero porte * costo porta
    const costoStrutturaBase = costoAltezzaParam ?
        storageElements.sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;
    const costoPorte = numeroPorte * costoPorta;
    const costoStrutturaStorage = costoStrutturaBase + costoPorte;

    // Costo grafica storage: superficie stampa * costo stampa grafica al mq
    const costoGraficaStorage = costoStampaParam ?
        storageElements.superficieStampa * (costoStampaParam.costo || 0) : 0;

    // Costo premontaggio storage: numero pezzi * costo premontaggio al pezzo
    const costoPremontaggioStorage = costoPremontaggioParam && formData.premontaggioStorage ?
        storageElements.numeroPezzi * (costoPremontaggioParam.costo || 0) : 0;

    const costoTotaleStorage = costoStrutturaStorage + (formData.graficaStorageAttiva ? costoGraficaStorage : 0) + costoPremontaggioStorage;
    const costoTotaleStorageNoleggio = (formData.graficaStorageAttiva ? costoGraficaStorage : 0) + costoPremontaggioStorage;

    // Prezzi con ricarico dal parametro
    const prezzoStrutturaStorage = costoStrutturaStorage * (1 + (costoAltezzaParam?.ricaricoPercentuale || 0) / 100);
    const prezzoGraficaStorage = costoStampaParam
        ? storageElements.superficieStampa * (costoStampaParam.costo || 0) * (1 + (costoStampaParam.ricaricoPercentuale || 0) / 100)
        : 0;
    const prezzoPremontaggioStorage = costoPremontaggioParam && formData.premontaggioStorage
        ? storageElements.numeroPezzi * (costoPremontaggioParam.costo || 0) * (1 + (costoPremontaggioParam.ricaricoPercentuale || 0) / 100)
        : 0;

    return {
      costoStrutturaStorage,
      costoGraficaStorage,
      costoPremontaggioStorage,
      costoTotaleStorage,
      costoTotaleStorageNoleggio,
      prezzoStrutturaStorage,
      prezzoGraficaStorage,
      prezzoPremontaggioStorage,
    };
  }, [formData.larghezzaStorage, formData.profonditaStorage, formData.altezzaStorage, formData.numeroPorte, formData.premontaggioStorage, formData.graficaStorageAttiva, storageElements, parametri, listinoServizi, accessoriStand]);

  return (
      <div className="space-y-6">
        {/* Dati di Ingresso per Storage */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5"/>
            <h4 className="text-md font-semibold">Dati di Ingresso per Storage</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="larg_storage">Larghezza dello storage (m)</Label>
              <Input
                  id="larg_storage"
                  type="number"
                  step="0.5"
                  min="0"
                  max="15"
                  value={formData.larghezzaStorage}
                  onChange={(e) => setFormData({...formData, larghezzaStorage: Number(e.target.value)})}
                  placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profonditaStorage">Profondità dello storage (m)</Label>
              <Input
                  id="profonditaStorage"
                  type="number"
                  step="0.5"
                  min="0"
                  max="15"
                  value={formData.profonditaStorage}
                  onChange={(e) => setFormData({...formData, profonditaStorage: Number(e.target.value)})}
                  placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altezzaStorage">Altezza pareti dello storage (m)</Label>
              <Select value={String(formData.altezzaStorage)  }
                      onValueChange={(value) => setFormData({...formData, altezzaStorage: Number(value)})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona altezza"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2.5">2.5 m</SelectItem>
                  <SelectItem value="3">3 m</SelectItem>
                  <SelectItem value="3.5">3.5 m</SelectItem>
                  <SelectItem value="4">4 m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="layoutStorage">Tipo layout dello storage</Label>
              <Select value={formData.layoutStorage}
                      onValueChange={(value) => setFormData({...formData, layoutStorage: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona layout"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0_lati">0 Lati</SelectItem>
                  <SelectItem value="2_lati">2 Lati</SelectItem>
                  <SelectItem value="3_lati">3 Lati</SelectItem>
                  <SelectItem value="4_lati">4 Lati</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroPorte">Numero porte</Label>
              <Select value={formData.numeroPorte}
                      onValueChange={(value) => setFormData({...formData, numeroPorte: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona numero porte"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        {/* Elementi Fisici Storage */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5"/>
            <h4 className="text-md font-semibold">Elementi Fisici Storage</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Superficie di stampa</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                    className="text-2xl font-bold">{storageElements.superficieStampa.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">m²</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sviluppo in metri lineari</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                    className="text-2xl font-bold">{storageElements.sviluppoLineare.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">m</p>
              </CardContent>
            </Card>

            <div className="space-y-1">
                <div className="flex items-start gap-1 text-[10px] text-amber-700 leading-tight">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>Imposta la distribuzione nella sezione Stand per valorizzare il numero di pezzi.</span>
                </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Numero di pezzi storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{storageElements.numeroPezzi.toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">N</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Calcolo Costi Storage */}
        <div className="space-y-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5"/>
              <h4 className="text-md font-semibold">Calcolo Preventivo Storage</h4>
            </div>
            {formData.coefficienteNoleggio && (
              <span className="text-sm text-muted-foreground">
                Coeff. Noleggio: <span className="font-semibold text-foreground">{formData.coefficienteNoleggio.nome}</span>
              </span>
            )}
          </div>

          {/* Tabella Calcolo Costi */}
          <Card>
            <CardContent className="pt-4 px-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voce</TableHead>
                    <TableHead className="text-right">Costo</TableHead>
                    <TableHead className="text-right">Prezzo</TableHead>
                    <TableHead className="text-center w-32">Sconto %</TableHead>
                    <TableHead className="text-right">Sconto €</TableHead>
                    <TableHead className="text-right">Prezzo Netto</TableHead>
                    <TableHead className="text-right">Prezzo Noleggio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Struttura storage */}
                  {(() => {
                    const prezzo = storageCosts.prezzoStrutturaStorage;
                    const scontoPerc = formData.scontoStrutturaStorage || 0;
                    const scontoEuro = prezzo * scontoPerc / 100;
                    const prezzoNetto = prezzo - scontoEuro;
                    const prezzoNoleggio = prezzoNetto * (formData.coefficienteNoleggio?.valore ?? 0);
                    return (
                      <TableRow>
                        <TableCell className="font-medium">Struttura storage</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          €{storageCosts.costoStrutturaStorage.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          €{prezzo.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Input
                                type="number" min="0" max="100" step="1"
                                value={scontoPerc}
                                onChange={(e) => setFormData({...formData, scontoStrutturaStorage: parseFloat(e.target.value) || 0})}
                                className="w-16 h-6 text-xs text-center"
                            />
                            <span className="text-xs">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          -€{scontoEuro.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          €{prezzoNetto.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          €{prezzoNoleggio.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })()}

                  {/* Grafica storage */}
                  {(() => {
                    const prezzo = storageCosts.prezzoGraficaStorage;
                    const attiva = formData.graficaStorageAttiva ?? true;
                    const scontoPerc = formData.scontoGraficaStorage || 0;
                    const scontoEuro = (attiva ? prezzo : 0) * scontoPerc / 100;
                    const prezzoNetto = (attiva ? prezzo : 0) - scontoEuro;
                    return (
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            Grafica storage
                            <Checkbox
                                checked={attiva}
                                onCheckedChange={checked => setFormData({...formData, graficaStorageAttiva: Boolean(checked)})}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          €{(attiva ? storageCosts.costoGraficaStorage : 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          €{(attiva ? prezzo : 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Input
                                type="number" min="0" max="100" step="1"
                                value={scontoPerc}
                                onChange={(e) => setFormData({...formData, scontoGraficaStorage: parseFloat(e.target.value) || 0})}
                                className="w-16 h-6 text-xs text-center"
                            />
                            <span className="text-xs">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          -€{scontoEuro.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          €{prezzoNetto.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">-</TableCell>
                      </TableRow>
                    );
                  })()}

                  {/* Premontaggio storage */}
                  {(() => {
                    const prezzo = storageCosts.prezzoPremontaggioStorage;
                    const scontoPerc = formData.scontoPremontaggioStorage || 0;
                    const scontoEuro = prezzo * scontoPerc / 100;
                    const prezzoNetto = prezzo - scontoEuro;
                    return (
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            Premontaggio Storage
                            <Checkbox
                                checked={formData.premontaggioStorage ?? true}
                                onCheckedChange={(checked) => setFormData({...formData, premontaggioStorage: Boolean(checked)})}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          €{storageCosts.costoPremontaggioStorage.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          €{prezzo.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Input
                                type="number" min="0" max="100" step="1"
                                value={scontoPerc}
                                onChange={(e) => setFormData({...formData, scontoPremontaggioStorage: parseFloat(e.target.value) || 0})}
                                className="w-16 h-6 text-xs text-center"
                            />
                            <span className="text-xs">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          -€{scontoEuro.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          €{prezzoNetto.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">-</TableCell>
                      </TableRow>
                    );
                  })()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-4 space-y-6">
              {(() => {
                const graficaAttiva = formData.graficaStorageAttiva ?? true;
                const listStruttura = storageCosts.prezzoStrutturaStorage;
                const listGrafica = graficaAttiva ? storageCosts.prezzoGraficaStorage : 0;
                const listPremontaggio = storageCosts.prezzoPremontaggioStorage;
                const totalListinoVendita = listStruttura + listGrafica + listPremontaggio;

                const nettoStruttura = listStruttura * (1 - (formData.scontoStrutturaStorage || 0) / 100);
                const nettoGrafica = listGrafica * (1 - (formData.scontoGraficaStorage || 0) / 100);
                const nettoPremontaggio = listPremontaggio * (1 - (formData.scontoPremontaggioStorage || 0) / 100);
                const totalNettoVendita = nettoStruttura + nettoGrafica + nettoPremontaggio;
                const totalNettoNoleggio = nettoGrafica + nettoPremontaggio;

                const costoTotale = storageCosts.costoTotaleStorage;
                const costoTotaleNoleggio = storageCosts.costoTotaleStorageNoleggio;
                const scontoMedioVendita = totalListinoVendita > 0 ? (totalListinoVendita - totalNettoVendita) / totalListinoVendita * 100 : 0;
                const marginalitaVendita = totalNettoVendita > 0 ? (totalNettoVendita - costoTotale) / totalNettoVendita * 100 : 0;
                const margineVendita = totalNettoVendita - costoTotale;

                const coeffNoleggio = formData.coefficienteNoleggio?.valore ?? 0;
                const prezzoNoleggioStruttura = nettoStruttura * coeffNoleggio;
                const totalePreventivoFinale = prezzoNoleggioStruttura + nettoGrafica + nettoPremontaggio;
                const totalListinoNoleggio = listGrafica + listPremontaggio;
                const scontoMedioNoleggio = totalListinoNoleggio > 0 ? (totalListinoNoleggio - totalNettoNoleggio) / totalListinoNoleggio * 100 : 0;
                const marginalitaNoleggio = totalNettoNoleggio > 0 ? (totalNettoNoleggio - costoTotaleNoleggio) / totalNettoNoleggio * 100 : 0;
                const margineNoleggio = totalNettoNoleggio - costoTotaleNoleggio;

                return (
                  <>
                    {/* VENDITA */}
                    <div>
                      <div className="text-lg font-semibold text-primary mb-2">Vendita</div>
                      <div className="grid grid-cols-6 gap-4 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Listino</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">€{totalListinoVendita.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Netto</div>
                          <div className="text-[10px] text-muted-foreground">(Prezzo scontato)</div>
                          <div className="text-lg font-bold text-primary">€{totalNettoVendita.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Costi</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">€{costoTotale.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Margine</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className={`text-lg font-bold ${margineVendita < 0 ? 'text-red-600' : 'text-green-600'}`}>€{margineVendita.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sconto Medio</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">{scontoMedioVendita.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Marginalità di Vendita</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className={`text-lg font-bold ${marginalitaVendita < 0 ? 'text-red-600' : 'text-green-600'}`}>{marginalitaVendita.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4" />

                    {/* NOLEGGIO */}
                    <div>
                      <div className="grid grid-cols-6 gap-4 text-center mb-4">
                        <div className="text-left">
                          <div className="text-lg font-semibold text-primary">Noleggio</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Noleggio</div>
                          <div className="text-xl font-bold">€{prezzoNoleggioStruttura.toFixed(2)}</div>
                        </div>
                        <div /><div /><div /><div />
                      </div>

                      <div className="grid grid-cols-6 gap-4 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Listino</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">€{(listGrafica + listPremontaggio).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Netto</div>
                          <div className="text-[10px] text-muted-foreground">(Prezzo scontato)</div>
                          <div className="text-lg font-bold text-primary">€{totalNettoNoleggio.toFixed(2)}</div>
                          <div className="text-left mt-2">
                            <div className="text-xs text-muted-foreground">di cui:</div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              - Premontaggio:{" "}
                              <span className="font-medium text-foreground">€{nettoPremontaggio.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="text-xs text-muted-foreground">Totale Preventivo Finale</div>
                            <div className="text-xl font-bold text-primary">€{totalePreventivoFinale.toFixed(2)}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Costi Vendita</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">€{costoTotaleNoleggio.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Margine</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className={`text-lg font-bold ${margineNoleggio < 0 ? 'text-red-600' : 'text-green-600'}`}>€{margineNoleggio.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sconto Medio</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">{scontoMedioNoleggio.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Marginalità di Vendita</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className={`text-lg font-bold ${marginalitaNoleggio < 0 ? 'text-red-600' : 'text-green-600'}`}>{marginalitaNoleggio.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
