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
import {Calculator} from 'lucide-react';
import {PreventivoBean} from "@/types/preventivo.ts";
import {ParametriAPI} from "@/api/parametri.ts";

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
    for (const p of parametri as any[]) {
      if (p?.tipo === "profili_distribuzione") {
        const key = Number(p?.nome);
        if (Number.isFinite(key)) map[key] = Number(p?.valore);
      }
    }
    return map;
  }, [parametri]);

  // Query per recuperare i parametri a costi unitari
  const {
    data: parametriCostiUnitari = []
  } = useQuery({
    queryKey: ['parametri-costi-unitari'],
    queryFn: () => ParametriAPI.getParametriACostiUnitari({
      attivo: true, sortFields: [{
        field: "PARAMETRI_COSTI_UNITARI_PARAMETRO",
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
    if (!formData.larghezzaStorage || !formData.profonditaStorage || !formData.altezzaStorage || !formData.layoutStorage || !formData.distribuzione) {
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

    // Superficie di stampa Storage
    let superficieStampa = 0;
    switch (layout) {
      case '0':
        superficieStampa = (2 * larg + 2 * prof) * alt;
        break;
      case '1':
        superficieStampa = (2 * larg + 2 * prof) * alt + 2;
        break;
      case '2':
        superficieStampa = (larg + prof) * alt + 2;
        break;
    }

    // Sviluppo in metri lineari Storage
    let sviluppoLineare = 0;
    switch (layout) {
      case '0':
        sviluppoLineare = larg + prof;
        break;
      case '1':
        sviluppoLineare = 2 * larg + 2 * prof;
        break;
      case '2':
        sviluppoLineare = larg + prof + 1;
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
  }, [formData.larghezzaStorage, formData.profonditaStorage, formData.altezzaStorage, formData.layoutStorage, formData.distribuzione, profiliDistribuzioneMap]);

  // Calcolo dei costi Storage
  const storageCosts = useMemo(() => {
    if (!formData.larghezzaStorage || !formData.profonditaStorage || !formData.altezzaStorage || !parametri.length) {
      return {
        costoStrutturaStorage: 0,
        costoGraficaStorage: 0,
        costoPremontaggioStorage: 0,
        costoTotaleStorage: 0
      };
    }

    // Trova i parametri necessari
    const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
    const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
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

    // Costo grafica storage con cordino cucito: superficie stampa * costo stampa grafica al mq
    const costoGraficaStorage = costoStampaParam ?
        storageElements.superficieStampa * (costoStampaParam.valore || 0) : 0;

    // Costo premontaggio storage: numero pezzi * costo premontaggio al pezzo
    const costoPremontaggioStorage = costoPremontaggio ?
        storageElements.numeroPezzi * (costoPremontaggio.valore || 0) : 0;

    const costoTotaleStorage = costoStrutturaStorage + costoGraficaStorage + costoPremontaggioStorage;

    return {
      costoStrutturaStorage,
      costoGraficaStorage,
      costoPremontaggioStorage,
      costoTotaleStorage
    };
  }, [formData.larghezzaStorage, formData.profonditaStorage, formData.altezzaStorage, formData.numeroPorte, storageElements, parametri, parametriCostiUnitari, accessoriStand]);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="layoutStorage">Tipo layout dello storage</Label>
              <Select value={formData.layoutStorage}
                      onValueChange={(value) => setFormData({...formData, layoutStorage: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona layout"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Calcolo Costi Storage */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5"/>
            <h4 className="text-md font-semibold">Calcolo Preventivo Storage</h4>
          </div>

          {/* Cost cards layout matching StandSection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Struttura storage */}
            <Card className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm font-medium">Struttura storage</div>
                <div
                    className="text-lg font-bold">€{storageCosts.costoStrutturaStorage.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-muted-foreground">Ricarico</div>
                  <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        min="0"
                        max="200"
                        step="1"
                        value={formData.marginalitaStrutturaStorage || 0}
                        onChange={(e) => setFormData({
                          ...formData,
                          marginalitaStrutturaStorage: parseFloat(e.target.value) || 0
                        })}
                        className="w-16 h-6 text-xs text-center"
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <div
                    className="text-lg font-bold text-primary">€{(storageCosts.costoStrutturaStorage * (1 + (formData.marginalitaStrutturaStorage || 0) / 100)).toFixed(2)}</div>
              </div>
            </Card>

            {/* Grafica storage */}
            <Card className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm font-medium">Grafica storage</div>
                <div
                    className="text-lg font-bold">€{storageCosts.costoGraficaStorage.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-muted-foreground">Ricarico</div>
                  <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        min="0"
                        max="200"
                        step="1"
                        value={formData.marginalitaGraficaStorage || 0}
                        onChange={(e) => setFormData({
                          ...formData,
                          marginalitaGraficaStorage: parseFloat(e.target.value) || 0
                        })}
                        className="w-16 h-6 text-xs text-center"
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <div
                    className="text-lg font-bold text-primary">€{(storageCosts.costoGraficaStorage * (1 + (formData.marginalitaGraficaStorage || 0) / 100)).toFixed(2)}</div>
              </div>
            </Card>

            {/* Premontaggio storage */}
            <Card className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm font-medium">Premontaggio Storage</div>
                <div
                    className="text-lg font-bold">€{storageCosts.costoPremontaggioStorage.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-muted-foreground">Ricarico</div>
                  <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        min="0"
                        max="200"
                        step="1"
                        value={formData.marginalitaPremontaggioStorage || 0}
                        onChange={(e) => setFormData({
                          ...formData,
                          marginalitaPremontaggioStorage: parseFloat(e.target.value) || 0
                        })}
                        className="w-16 h-6 text-xs text-center"
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <div
                    className="text-lg font-bold text-primary">€{(storageCosts.costoPremontaggioStorage * (1 + (formData.marginalitaPremontaggioStorage || 0) / 100)).toFixed(2)}</div>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Totale preventivo storage
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    €{(() => {
                    const totalePreventivo =
                        storageCosts.costoStrutturaStorage * (1 + (formData.marginalitaStrutturaStorage || 0) / 100) +
                        storageCosts.costoGraficaStorage * (1 + (formData.marginalitaGraficaStorage || 0) / 100) +
                        storageCosts.costoPremontaggioStorage * (1 + (formData.marginalitaPremontaggioStorage || 0) / 100);
                    return totalePreventivo.toFixed(2);
                  })()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Totale costi storage</div>
                  <div className="text-2xl font-bold">
                    €{storageCosts.costoTotaleStorage.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Marginalità Media (%)</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(() => {
                      if (storageCosts.costoTotaleStorage === 0) return '0.0%';
                      const totalePreventivo =
                          storageCosts.costoStrutturaStorage * (1 + (formData.marginalitaStrutturaStorage || 0) / 100) +
                          storageCosts.costoGraficaStorage * (1 + (formData.marginalitaGraficaStorage || 0) / 100) +
                          storageCosts.costoPremontaggioStorage * (1 + (formData.marginalitaPremontaggioStorage) / 100);
                      const marginalitaMedia = ((totalePreventivo - storageCosts.costoTotaleStorage) / storageCosts.costoTotaleStorage * 100);
                      return marginalitaMedia.toFixed(1) + '%';
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
