import React, {useMemo, useState} from 'react';
import {Calculator, ChevronDown, ChevronRight} from 'lucide-react';
import {Input} from '../ui/input.tsx';
import {Label} from '../ui/label.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table.tsx';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../ui/collapsible.tsx";
import {useQuery} from '@tanstack/react-query';
import {ParametriAPI} from "@/api/parametri.ts";
import {ListinoAccessoriEspositoriBean, ListinoServiziPrezzoUnitarioBean, ListinoStrutturaEspositoriBean} from "@/types/parametri.ts";
import {PreventivoBean} from "@/types/preventivo.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

interface ExpositorePhysicalElements {
  numeroPezziEspositori: number;
  superficieStampaEspositori: number;
}

interface EspositorePhysicalElementsProps {
  physicalElements: ExpositorePhysicalElements;
}

interface EspositoriSectionProps {
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}

function EspositorePhysicalElements({physicalElements}: EspositorePhysicalElementsProps) {
  return <Card className="border-l-4 border-l-espositore">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm flex items-center gap-2 text-espositore">
        <Calculator className="h-4 w-4"/>
        Elementi Fisici Espositori (calcolati automaticamente)
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Numero pezzi espositori</Label>
          <div className="text-lg font-semibold text-espositore">
            {physicalElements.numeroPezziEspositori}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Superficie stampa espositori (mq)</Label>
          <div className="text-lg font-semibold text-espositore">
            {physicalElements.superficieStampaEspositori.toFixed(2)}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>;
}

export function ExpositoreSection({formData, setFormData}: EspositoriSectionProps) {

  type AccessorioItem = { qty: number; noleggio: boolean };
  type AccessoriEspositoriMap = Record<string, AccessorioItem>;

  const parseEspositoriConfig = (json?: string): AccessoriEspositoriMap => {
    if (!json) return {};
    try {
      const parsed = JSON.parse(json);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  };

  const stringifyEspositoriConfig = (map: AccessoriEspositoriMap): string => JSON.stringify(map);

  const espositoriMap = parseEspositoriConfig(formData.espositoriConfig);

  const handleAccessorioChange = (id: string, quantity: number) => {
    setFormData(prev => {
      const current = parseEspositoriConfig(prev.espositoriConfig);
      const updated: AccessoriEspositoriMap = {
        ...current,
        [id]: {qty: quantity, noleggio: current[id]?.noleggio ?? false},
      };
      if (quantity <= 0) delete updated[id];
      return {...prev, espositoriConfig: stringifyEspositoriConfig(updated)};
    });
  };

  const handleNoleggioChange = (id: string, value: boolean) => {
    setFormData(prev => {
      const current = parseEspositoriConfig(prev.espositoriConfig);
      if (!current[id] && !value) return prev;
      const updated: AccessoriEspositoriMap = {
        ...current,
        [id]: {qty: current[id]?.qty ?? 0, noleggio: value},
      };
      return {...prev, espositoriConfig: stringifyEspositoriConfig(updated)};
    });
  };

  const updateIntField = (field: keyof PreventivoBean, value: string) => {
    const v = value === '' ? 0 : parseInt(value, 10);
    setFormData(prev => ({...prev, [field]: Number.isFinite(v) ? v : 0}));
  };

  const physicalElements = useMemo(() => {
    const qta30 = Number(formData.qtaTipo30 ?? 0);
    const qta50 = Number(formData.qtaTipo50 ?? 0);
    const qta100 = Number(formData.qtaTipo100 ?? 0);
    return {
      numeroPezziEspositori: (qta30 + qta50 + qta100) * 12,
      superficieStampaEspositori: qta30 * 1.2 + qta50 * 2 + qta100 * 3
    };
  }, [formData.qtaTipo30, formData.qtaTipo50, formData.qtaTipo100]);

  const [accessoriOpen, setAccessoriOpen] = useState(true);

  const {data: accessoriesData = []} = useQuery({
    queryKey: ['listino_accessori_espositori'],
    queryFn: () => ParametriAPI.getListinoAccessoriEspositori({
      attivo: true, sortFields: [{field: "LISTINO_ACCESSORI_ESPOSITORI_NOME", desc: false}]
    })
  });

  const {data: layoutCostsData = []} = useQuery({
    queryKey: ['listino_struttura_espositori'],
    queryFn: () => ParametriAPI.getListinoStrutturaEspositori({
      attivo: true, sortFields: [{field: "LISTINO_STRUTTURA_ESPOSITORI_LAYOUT_ESPOSITORE", desc: false}]
    })
  });

  const {data: listinoServizi = []} = useQuery({
    queryKey: ['listino-servizi-prezzo-unitario'],
    queryFn: () => ParametriAPI.getListinoServiziPrezzoUnitario({
      attivo: true, sortFields: [{field: "LISTINO_SERVIZI_PREZZO_UNITARIO_PARAMETRO", desc: false}]
    })
  });

  // === STRUTTURA HELPERS ===
  const getLayoutEntry = (layout: string) =>
    (layoutCostsData as ListinoStrutturaEspositoriBean[]).find(l => l.layoutEspositore === Number(layout));

  const getLayoutCostUnitario = (layout: string) => Number(getLayoutEntry(layout)?.costoUnitario ?? 0);

  const getLayoutPrezzoUnitario = (layout: string) => {
    const e = getLayoutEntry(layout);
    if (!e) return 0;
    return Number(e.costoUnitario) * (1 + (e.ricaricoPercentuale ?? 0) / 100);
  };

  const strutturaCosto =
    (formData.qtaTipo30 || 0) * getLayoutCostUnitario('30') +
    (formData.qtaTipo50 || 0) * getLayoutCostUnitario('50') +
    (formData.qtaTipo100 || 0) * getLayoutCostUnitario('100');

  const strutturaPrezzo =
    (formData.qtaTipo30 || 0) * getLayoutPrezzoUnitario('30') +
    (formData.qtaTipo50 || 0) * getLayoutPrezzoUnitario('50') +
    (formData.qtaTipo100 || 0) * getLayoutPrezzoUnitario('100');

  // === GRAFICA HELPERS ===
  const graficaParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Stampa Grafica');
  const graficaEspositoriAttiva = formData.graficaEspositoriAttiva ?? true;
  const graficaCosto = graficaEspositoriAttiva && graficaParam
    ? physicalElements.superficieStampaEspositori * (graficaParam.costo || 0)
    : 0;
  const graficaPrezzo = graficaEspositoriAttiva && graficaParam
    ? physicalElements.superficieStampaEspositori * (graficaParam.costo || 0) * (1 + (graficaParam.ricaricoPercentuale || 0) / 100)
    : 0;

  // === PREMONTAGGIO HELPERS ===
  const premontaggioParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Premontaggio');
  const premontaggioCosto = premontaggioParam && formData.premontaggioEspositori
    ? physicalElements.numeroPezziEspositori * (premontaggioParam.costo || 0) : 0;
  const premontaggioPrezzo = premontaggioParam && formData.premontaggioEspositori
    ? physicalElements.numeroPezziEspositori * (premontaggioParam.costo || 0) * (1 + (premontaggioParam.ricaricoPercentuale || 0) / 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5"/>
        <h4 className="text-md font-semibold">Dati di Ingresso per Espositori</h4>
      </div>

      {/* Configurazione Espositori */}
      <Card className="border-l-4 border-l-espositore">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-espositore">Configurazione Espositori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
              <div className="text-center">Tipo espositore</div>
              <div className="text-center">Tipo 30</div>
              <div className="text-center">Tipo 50</div>
              <div className="text-center">Tipo 100</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center justify-center">
                <Label className="text-sm font-medium">Quantità</Label>
              </div>
              <div className="space-y-1">
                <Input type="number" min="0"
                       value={formData.qtaTipo30}
                       onChange={e => updateIntField('qtaTipo30', e.target.value)}
                       placeholder="0"/>
              </div>
              <div className="space-y-1">
                <Input type="number" min="0"
                       value={formData.qtaTipo50}
                       onChange={e => updateIntField('qtaTipo50', e.target.value)}
                       placeholder="0"/>
              </div>
              <div className="space-y-1">
                <Input type="number" min="0"
                       value={formData.qtaTipo100}
                       onChange={e => updateIntField('qtaTipo100', e.target.value)}
                       placeholder="0"/>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elementi Fisici */}
      <EspositorePhysicalElements physicalElements={physicalElements}/>

      {/* Accessori Espositori */}
      <Collapsible open={accessoriOpen} onOpenChange={setAccessoriOpen}>
        <Card className="border-l-4 border-l-espositore">
          <CardHeader className="pb-3 py-[16px]">
            <CollapsibleTrigger className="flex items-center gap-2 w-full">
              <CardTitle className="text-sm text-espositore">Accessori Espositori</CardTitle>
              {accessoriOpen ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Accessorio</TableHead>
                    <TableHead className="text-center">Costo unitario</TableHead>
                    <TableHead className="text-center">Prezzo unitario</TableHead>
                    <TableHead className="text-center w-24">Quantità</TableHead>
                    <TableHead className="text-center w-24">Noleggio</TableHead>
                    <TableHead className="text-right">Prezzo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(accessoriesData as ListinoAccessoriEspositoriBean[]).map(accessorio => {
                    const item = espositoriMap[accessorio.id];
                    const quantity = item?.qty ?? 0;
                    const noleggio = item?.noleggio ?? false;
                    const prezzoUnitario = Number(accessorio.costoUnitario) * (1 + (accessorio.ricaricoPercentuale ?? 0) / 100);
                    const coeff = formData.coefficienteNoleggio?.valore ?? 0;
                    const prezzo = noleggio
                      ? prezzoUnitario * quantity * coeff
                      : prezzoUnitario * quantity;
                    return (
                      <TableRow key={accessorio.id}>
                        <TableCell className="font-medium py-1">{accessorio.nome}</TableCell>
                        <TableCell className="text-center py-1">
                          € {Number(accessorio.costoUnitario).toFixed(2).replace('.', ',')}
                        </TableCell>
                        <TableCell className="text-center py-1">
                          € {prezzoUnitario.toFixed(2).replace('.', ',')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number" min="0" max="99"
                            value={quantity}
                            onChange={(e) => handleAccessorioChange(accessorio.id, parseInt(e.target.value) || 0)}
                            className="w-14 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={noleggio}
                            onCheckedChange={(checked) => handleNoleggioChange(accessorio.id, !!checked)}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium py-1">
                          € {prezzo.toFixed(2).replace('.', ',')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Calcolo Preventivo Espositori */}
      <div className="space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5"/>
            <h4 className="text-md font-semibold">Calcolo Preventivo Espositori</h4>
          </div>
          {formData.coefficienteNoleggio && (
            <span className="text-sm text-muted-foreground">
              Coeff. Noleggio: <span className="font-semibold text-foreground">{formData.coefficienteNoleggio.nome}</span>
            </span>
          )}
        </div>

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
                {/* Struttura espositori */}
                {(() => {
                  const scontoPerc = formData.scontoStrutturaEspositori || 0;
                  const scontoEuro = strutturaPrezzo * scontoPerc / 100;
                  const prezzoNetto = strutturaPrezzo - scontoEuro;
                  const prezzoNoleggio = prezzoNetto * (formData.coefficienteNoleggio?.valore ?? 0);
                  return (
                    <TableRow>
                      <TableCell className="font-medium">Struttura espositori</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        €{strutturaCosto.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        €{strutturaPrezzo.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number" min="0" max="100" step="1"
                            value={scontoPerc}
                            onChange={(e) => setFormData({...formData, scontoStrutturaEspositori: parseFloat(e.target.value) || 0})}
                            className="w-16 h-6 text-xs text-center"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">-€{scontoEuro.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">€{prezzoNetto.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold">€{prezzoNoleggio.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })()}

                {/* Grafica espositori */}
                {(() => {
                  const attiva = formData.graficaEspositoriAttiva ?? true;
                  const costoEff = attiva ? graficaCosto : 0;
                  const prezzoEff = attiva ? graficaPrezzo : 0;
                  const scontoPerc = formData.scontoGraficaEspositori || 0;
                  const scontoEuro = prezzoEff * scontoPerc / 100;
                  const prezzoNetto = prezzoEff - scontoEuro;
                  return (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          Grafica espositori
                          <Checkbox
                            checked={attiva}
                            onCheckedChange={(checked) => setFormData({...formData, graficaEspositoriAttiva: Boolean(checked)})}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        €{costoEff.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        €{prezzoEff.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number" min="0" max="100" step="1"
                            value={scontoPerc}
                            onChange={(e) => setFormData({...formData, scontoGraficaEspositori: parseFloat(e.target.value) || 0})}
                            className="w-16 h-6 text-xs text-center"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">-€{scontoEuro.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">€{prezzoNetto.toFixed(2)}</TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                    </TableRow>
                  );
                })()}

                {/* Premontaggio espositori */}
                {(() => {
                  const scontoPerc = formData.scontoPremontaggioEspositori || 0;
                  const scontoEuro = premontaggioPrezzo * scontoPerc / 100;
                  const prezzoNetto = premontaggioPrezzo - scontoEuro;
                  return (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          Premontaggio espositori
                          <Checkbox
                            checked={formData.premontaggioEspositori ?? false}
                            onCheckedChange={(checked) => setFormData({...formData, premontaggioEspositori: Boolean(checked)})}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        €{premontaggioCosto.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        €{premontaggioPrezzo.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number" min="0" max="100" step="1"
                            value={scontoPerc}
                            onChange={(e) => setFormData({...formData, scontoPremontaggioEspositori: parseFloat(e.target.value) || 0})}
                            className="w-16 h-6 text-xs text-center"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">-€{scontoEuro.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">€{prezzoNetto.toFixed(2)}</TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                    </TableRow>
                  );
                })()}

                {/* Accessori espositori vendita */}
                {(() => {
                  let costoV = 0;
                  let prezzoV = 0;
                  for (const accessorio of accessoriesData as ListinoAccessoriEspositoriBean[]) {
                    const item = espositoriMap[accessorio.id];
                    if (!item || item.noleggio) continue;
                    costoV += item.qty * Number(accessorio.costoUnitario);
                    prezzoV += item.qty * Number(accessorio.costoUnitario) * (1 + (accessorio.ricaricoPercentuale ?? 0) / 100);
                  }
                  const scontoPerc = formData.scontoAccessoriEspositori || 0;
                  const scontoEuro = prezzoV * scontoPerc / 100;
                  const prezzoNetto = prezzoV - scontoEuro;
                  return (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Accessori espositori</span>
                          <span>Vendita</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        €{costoV.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        €{prezzoV.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number" min="0" max="100" step="1"
                            value={scontoPerc}
                            onChange={(e) => setFormData({...formData, scontoAccessoriEspositori: parseFloat(e.target.value) || 0})}
                            className="w-16 h-6 text-xs text-center"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">-€{scontoEuro.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">€{prezzoNetto.toFixed(2)}</TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                    </TableRow>
                  );
                })()}

                {/* Accessori espositori noleggio */}
                {(() => {
                  let costoN = 0;
                  let prezzoN = 0;
                  for (const accessorio of accessoriesData as ListinoAccessoriEspositoriBean[]) {
                    const item = espositoriMap[accessorio.id];
                    if (!item || !item.noleggio) continue;
                    costoN += item.qty * Number(accessorio.costoUnitario);
                    prezzoN += item.qty * Number(accessorio.costoUnitario) * (1 + (accessorio.ricaricoPercentuale ?? 0) / 100);
                  }
                  const scontoPerc = formData.scontoAccessoriEspositoriNoleggio || 0;
                  const scontoEuro = prezzoN * scontoPerc / 100;
                  const prezzoNetto = prezzoN - scontoEuro;
                  const prezzoNoleggioAcc = prezzoNetto * (formData.coefficienteNoleggio?.valore ?? 0);
                  return (
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Accessori espositori</span>
                          <span>Noleggio</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        €{costoN.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        €{prezzoN.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number" min="0" max="100" step="1"
                            value={scontoPerc}
                            onChange={(e) => setFormData({...formData, scontoAccessoriEspositoriNoleggio: parseFloat(e.target.value) || 0})}
                            className="w-16 h-6 text-xs text-center"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">-€{scontoEuro.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">€{prezzoNetto.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold">
                        {prezzoNoleggioAcc > 0
                          ? `€${prezzoNoleggioAcc.toFixed(2)}`
                          : <span className="text-muted-foreground">-</span>}
                      </TableCell>
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
              const scontoPercStruttura = formData.scontoStrutturaEspositori || 0;
              const scontoPercGrafica = formData.scontoGraficaEspositori || 0;
              const scontoPercPremontaggio = formData.scontoPremontaggioEspositori || 0;
              const scontoPercAccessoriVendita = formData.scontoAccessoriEspositori || 0;
              const scontoPercAccessoriNoleggio = formData.scontoAccessoriEspositoriNoleggio || 0;

              const nettoStruttura = strutturaPrezzo * (1 - scontoPercStruttura / 100);
              const nettoGrafica = graficaPrezzo * (1 - scontoPercGrafica / 100);
              const nettoPremontaggio = premontaggioPrezzo * (1 - scontoPercPremontaggio / 100);

              let costoAccessoriVendita = 0;
              let costoAccessoriNoleggio = 0;
              let listAccessoriVendita = 0;
              let listAccessoriNoleggio = 0;
              for (const accessorio of accessoriesData as ListinoAccessoriEspositoriBean[]) {
                const item = espositoriMap[accessorio.id];
                if (!item) continue;
                const c = item.qty * Number(accessorio.costoUnitario);
                const p = c * (1 + (accessorio.ricaricoPercentuale ?? 0) / 100);
                if (item.noleggio) {
                  costoAccessoriNoleggio += c;
                  listAccessoriNoleggio += p;
                } else {
                  costoAccessoriVendita += c;
                  listAccessoriVendita += p;
                }
              }
              const costoAccessori = costoAccessoriVendita + costoAccessoriNoleggio;
              const listAccessori = listAccessoriVendita + listAccessoriNoleggio;
              const nettoAccessoriVendita = listAccessoriVendita * (1 - scontoPercAccessoriVendita / 100);
              const nettoAccessoriNoleggio = listAccessoriNoleggio * (1 - scontoPercAccessoriNoleggio / 100);
              const nettoAccessori = nettoAccessoriVendita + nettoAccessoriNoleggio;

              const costoTotale = strutturaCosto + graficaCosto + premontaggioCosto + costoAccessori;
              const totalListinoVendita = strutturaPrezzo + graficaPrezzo + premontaggioPrezzo + listAccessori;
              const totalNettoVendita = nettoStruttura + nettoGrafica + nettoPremontaggio + nettoAccessori;

              const scontoMedioVendita = totalListinoVendita > 0
                ? (totalListinoVendita - totalNettoVendita) / totalListinoVendita * 100 : 0;
              const marginalitaVendita = costoTotale > 0
                ? (totalNettoVendita - costoTotale) / costoTotale * 100 : 0;

              const coeffNoleggio = formData.coefficienteNoleggio?.valore ?? 0;
              const prezzoNoleggioStruttura = nettoStruttura * coeffNoleggio;
              const prezzoNoleggioAccessori = nettoAccessoriNoleggio * coeffNoleggio;
              const totalNettoNoleggio = nettoGrafica + nettoPremontaggio + nettoAccessoriVendita;
              const totalePreventivoFinale = prezzoNoleggioStruttura + totalNettoNoleggio + prezzoNoleggioAccessori;

              const scontoMedioNoleggio = strutturaPrezzo > 0
                ? (strutturaPrezzo - nettoStruttura) / strutturaPrezzo * 100 : 0;
              const marginalitaNoleggio = costoTotale > 0
                ? (totalePreventivoFinale - costoTotale) / costoTotale * 100 : 0;

              return (
                <>
                  {/* VENDITA */}
                  <div>
                    <div className="text-lg font-semibold text-primary mb-2">Vendita</div>
                    <div className="grid grid-cols-5 gap-4 text-center">
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
                        <div className="text-xs text-muted-foreground">Sconto Medio</div>
                        <div className="text-[10px] invisible">-</div>
                        <div className="text-lg font-bold">{scontoMedioVendita.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Marginalità di vendita</div>
                        <div className="text-[10px] invisible">-</div>
                        <div className="text-lg font-bold text-green-600">{marginalitaVendita.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4"/>

                  {/* NOLEGGIO */}
                  <div>
                    <div className="grid grid-cols-5 gap-4 text-center mb-4">
                      <div className="text-left">
                        <div className="text-lg font-semibold text-primary">Noleggio</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Totale Prezzo Noleggio</div>
                        <div className="text-xl font-bold">€{(prezzoNoleggioStruttura + prezzoNoleggioAccessori).toFixed(2)}</div>
                      </div>
                      <div/><div/><div/>
                    </div>

                    <div className="grid grid-cols-5 gap-4 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">Totale Prezzo Listino</div>
                        <div className="text-[10px] invisible">-</div>
                        <div className="text-lg font-bold">€{(graficaPrezzo + premontaggioPrezzo + listAccessoriVendita).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Totale Prezzo Netto</div>
                        <div className="text-[10px] text-muted-foreground">(Prezzo scontato)</div>
                        <div className="text-lg font-bold text-primary">€{totalNettoNoleggio.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground mt-2">di cui:</div>
                        <div className="text-xs text-muted-foreground">
                          Premontaggio:{" "}
                          <span className="font-medium text-foreground">€{nettoPremontaggio.toFixed(2)}</span>
                        </div>
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground">Totale Preventivo Finale</div>
                          <div className="text-xl font-bold text-primary">€{totalePreventivoFinale.toFixed(2)}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Totale Costi Vendita</div>
                        <div className="text-[10px] invisible">-</div>
                        <div className="text-lg font-bold">€{(graficaCosto + premontaggioCosto + costoAccessoriVendita).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Sconto Medio</div>
                        <div className="text-[10px] invisible">-</div>
                        <div className="text-lg font-bold">{scontoMedioNoleggio.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Marginalità su Venduto</div>
                        <div className="text-[10px] invisible">-</div>
                        <div className="text-lg font-bold text-green-600">{marginalitaNoleggio.toFixed(1)}%</div>
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
