import React, {useMemo, useState} from 'react';
import {Calculator, ChevronDown, ChevronRight} from 'lucide-react';
import {Input} from '../ui/input.tsx';
import {Label} from '../ui/label.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table.tsx';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../ui/collapsible.tsx";
import {useQuery} from '@tanstack/react-query';
import {ParametriAPI} from "@/api/parametri.ts";
import {PreventivoBean} from "@/types/preventivo.ts";

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

function EspositorePhysicalElements({
                                      physicalElements
                                    }: EspositorePhysicalElementsProps) {
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

export function ExpositoreSection({
                                    formData,
                                    setFormData
                                  }: EspositoriSectionProps) {
  const updateIntField = (field: keyof PreventivoBean, value: string) => {
    const v = value === '' ? 0 : parseInt(value, 10);
    setFormData(prev => ({
      ...prev,
      [field]: Number.isFinite(v) ? v : 0
    }));
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
  // Query for accessories prices
  const {
    data: accessoriesData = []
  } = useQuery({
    queryKey: ['listino_accessori_espositori'],
    queryFn: () => ParametriAPI.getListinoAccessoriEspositori({
      attivo: true, sortFields: [{
        field: "LISTINO_ACCESSORI_ESPOSITORI_NOME",
        desc: false
      }]
    })
  });

  // Query for expositor layout costs
  const {
    data: layoutCostsData = []
  } = useQuery({
    queryKey: ['costi_struttura_espositori_layout'],
    queryFn: () => ParametriAPI.getCostiStrutturaEspositoriLayout({
      attivo: true, sortFields: [{
        field: "COSTI_STRUTTURA_ESPOSITORI_LAYOUT_ESPOSITORE",
        desc: false
      }]
    })
  });

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

  // Helper functions for accessories
  const getAccessoryPrice = (name: string): number => {
    const accessory = accessoriesData.find(item => item.nome === name);
    return accessory ? Number(accessory.costoUnitario) : 0;
  };
  const getAccessoryQuantity = (fieldName: keyof PreventivoBean): number =>
      Number(formData[fieldName]) || 0;
  const calculateAccessoryTotal = (fieldName: keyof PreventivoBean, unitPrice: number): number => {
    const quantity = getAccessoryQuantity(fieldName);
    return quantity * unitPrice;
  };

  // Helper function to get parameter value
  const getParameterValue = (parameterName: string): number => {
    const parameter = parametriCostiUnitari.find(p => p.parametro === parameterName);
    return parameter ? Number(parameter.valore) : 0;
  };

  // Helper function to get layout cost
  const getLayoutCost = (layout: string): number => {
    const layoutCost = layoutCostsData.find(l => l.layoutEspositore === layout);
    return layoutCost ? Number(layoutCost.costoUnitario) : 0;
  };

  // Calculate costs
  const calculateStructureCost = (): number => {
    return (formData.qtaTipo30 || 0) * getLayoutCost('30') + (formData.qtaTipo50 || 0) * getLayoutCost('50') + (formData.qtaTipo100 || 0) * getLayoutCost('100');
  };
  const calculateGraphicsCost = (): number => {
    const costoStampaGrafica = getParameterValue('Costo Stampa Grafica');
    return physicalElements.superficieStampaEspositori * costoStampaGrafica;
  };
  const calculatePreassemblyCost = (): number => {
    const costoPremontaggio = getParameterValue('Costo Premontaggio');
    return physicalElements.numeroPezziEspositori * costoPremontaggio;
  };
  const calculateAccessoriesTotal = (): number => {
    return accessoryMapping.reduce((total, accessory) => {
      const unitPrice = getAccessoryPrice(accessory.name);
      const quantity = getAccessoryQuantity(accessory.field);
      return total + quantity * unitPrice;
    }, 0);
  };
  const calculateTotalCost = (): number => {
    return calculateStructureCost() + calculateGraphicsCost() + calculatePreassemblyCost() + calculateAccessoriesTotal();
  };

  // Mapping between field names and display names
  const accessoryMapping = [{
    field: 'ripiano30x30' as keyof PreventivoBean,
    name: 'Ripiano 30x30'
  }, {
    field: 'ripiano50x50' as keyof PreventivoBean,
    name: 'Ripiano 50x50'
  }, {
    field: 'ripiano100x50' as keyof PreventivoBean,
    name: 'Ripiano 100x50'
  }, {
    field: 'tecaPlexiglass30x30x30' as keyof PreventivoBean,
    name: 'Teca in plexiglass 30x30x30'
  }, {
    field: 'tecaPlexiglass50x50x50' as keyof PreventivoBean,
    name: 'Teca in plexiglass 50x50x50'
  }, {
    field: 'tecaPlexiglass100x50x30' as keyof PreventivoBean,
    name: 'Teca in plexiglass 100x50x30'
  }, {
    field: 'retroilluminazione30x30x100h' as keyof PreventivoBean,
    name: 'Retroilluminazione 30x30x100 H'
  }, {
    field: 'retroilluminazione50x50x100h' as keyof PreventivoBean,
    name: 'Retroilluminazione 50x50x100 H'
  }, {
    field: 'retroilluminazione100x50x100h' as keyof PreventivoBean,
    name: 'Retroilluminazione 100x50x100 H'
  }, {
    field: 'borsaEspositori' as keyof PreventivoBean,
    name: 'Borsa'
  }];
  const costiEspositori = useMemo(() => ({
    strutturaEspositori: calculateStructureCost(),
    graficaEspositori: calculateGraphicsCost(),
    premontaggioEspositori: calculatePreassemblyCost(),
    accessoriEspositori: calculateAccessoriesTotal(),
    costoTotaleEspositori: calculateTotalCost()
  }), [formData, physicalElements, accessoriesData, layoutCostsData, parametriCostiUnitari]);

  return <div className="space-y-4">
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
          {/* Headers row */}
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
            <div className="text-center">Tipo espositore</div>
            <div className="text-center">Tipo 30</div>
            <div className="text-center">Tipo 50</div>
            <div className="text-center">Tipo 100</div>
          </div>

          {/* Quantity inputs row */}
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

    {/* Accessori Espositori - Table Format */}
    <Collapsible open={accessoriOpen} onOpenChange={setAccessoriOpen}>
      <Card className="border-l-4 border-l-espositore">
        <CardHeader className="pb-3 py-[16px]">
          <CollapsibleTrigger className="flex items-center gap-2 w-full">
            <CardTitle className="text-sm text-espositore">Accessori Espositori</CardTitle>
            {accessoriOpen ? <ChevronDown className="h-4 w-4"/> :
                <ChevronRight className="h-4 w-4"/>}
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Accessorio</TableHead>
                  <TableHead className="text-center">Prezzo unitario</TableHead>
                  <TableHead className="text-center">Quantità</TableHead>
                  <TableHead className="text-center">Costo totale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessoryMapping.map(accessory => {
                  const unitPrice = getAccessoryPrice(accessory.name);
                  const quantity = getAccessoryQuantity(accessory.field);
                  const total = calculateAccessoryTotal(accessory.field, unitPrice);
                  return <TableRow key={accessory.field}>
                    <TableCell className="font-medium">{accessory.name}</TableCell>
                    <TableCell className="text-center">
                      €{unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Input type="number" min="0" max="10" value={quantity || 0} onChange={e => {
                        const newQuantity = parseInt(e.target.value) || 0;
                        updateIntField(accessory.field, newQuantity.toString());
                      }} className="w-20 text-center"/>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      €{total.toFixed(2)}
                    </TableCell>
                  </TableRow>;
                })}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>

    {/* Calcolo Costi Espositori */}
    <Card>
      <CardContent className="pt-6">
        <h4 className="text-lg font-semibold mb-4 text-desk">Calcolo Preventivo Espositori</h4>

        {/* Cost cards in 2x2 layout (4 items) */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          {/* Struttura espositori */}
          <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-medium">Struttura espositori</div>
              <div
                  className="text-lg font-bold">€{(costiEspositori?.strutturaEspositori ?? 0).toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground">Ricarico</div>
                <div className="flex items-center gap-1">
                  <Input
                      type="number" min="0" max="200" step="1"
                      value={formData.marginalitaStrutturaEspositori ?? 0}
                      onChange={(e) => updateIntField("marginalitaStrutturaEspositori", e.target.value)}
                      className="w-16 h-6 text-xs text-center"/>
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary">
                €{((costiEspositori?.strutturaEspositori ?? 0) * (1 + (formData.marginalitaStrutturaEspositori ?? 0) / 100)).toFixed(2)}
              </div>
            </div>
          </Card>

          {/* Grafica espositori */}
          <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-medium">Grafica espositori</div>
              <div
                  className="text-lg font-bold">€{(costiEspositori?.graficaEspositori ?? 0).toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground">Ricarico</div>
                <div className="flex items-center gap-1">
                  <Input type="number" min="0" max="200" step="1"
                         value={formData.marginalitaGraficaEspositori ?? 0}
                         onChange={e => updateIntField('marginalitaGraficaEspositori', e.target.value)}
                         className="w-16 h-6 text-xs text-center"/>
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary">
                €{((costiEspositori?.graficaEspositori ?? 0) * (1 + (formData.marginalitaGraficaEspositori ?? 0) / 100)).toFixed(2)}
              </div>
            </div>
          </Card>

          {/* Premontaggio espositori */}
          <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-medium">Premontaggio espositori</div>
              <div
                  className="text-lg font-bold">€{(costiEspositori?.premontaggioEspositori ?? 0).toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground">Ricarico</div>
                <div className="flex items-center gap-1">
                  <Input type="number" min="0" max="200" step="1"
                         value={formData.marginalitaPremontaggioEspositori ?? 0}
                         onChange={e => updateIntField('marginalitaPremontaggioEspositori', e.target.value)}
                         className="w-16 h-6 text-xs text-center"/>
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary">
                €{((costiEspositori?.premontaggioEspositori ?? 0) * (1 + (formData.marginalitaPremontaggioEspositori ?? 0) / 100)).toFixed(2)}
              </div>
            </div>
          </Card>

          {/* Accessori espositori */}
          <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-medium">Accessori espositori</div>
              <div
                  className="text-lg font-bold">€{(costiEspositori?.accessoriEspositori ?? 0).toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground">Ricarico</div>
                <div className="flex items-center gap-1">
                  <Input type="number" min="0" max="200" step="1"
                         value={formData.marginalitaAccessoriEspositori ?? 0}
                         onChange={e => updateIntField('marginalitaAccessoriEspositori', e.target.value)}
                         className="w-16 h-6 text-xs text-center"/>
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary">
                €{((costiEspositori?.accessoriEspositori ?? 0) * (1 + (formData.marginalitaAccessoriEspositori ?? 0) / 100)).toFixed(2)}
              </div>
            </div>
          </Card>
        </div>

        {/* Summary cards with totals */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="text-sm text-muted-foreground">Totale preventivo espositori</div>
            <div className="text-2xl font-bold text-primary">
              €{((costiEspositori?.strutturaEspositori ?? 0) * (1 + (formData.marginalitaStrutturaEspositori ?? 0) / 100) + (costiEspositori?.graficaEspositori ?? 0) * (1 + (formData.marginalitaGraficaEspositori ?? 0) / 100) + (costiEspositori?.premontaggioEspositori ?? 0) * (1 + (formData.marginalitaPremontaggioEspositori ?? 0) / 100) + (costiEspositori?.accessoriEspositori ?? 0) * (1 + (formData.marginalitaAccessoriEspositori ?? 0) / 100)).toFixed(2)}
            </div>
          </Card>

          <Card className="p-4 bg-muted/30">
            <div className="text-sm text-muted-foreground">Totale costi espositori</div>
            <div className="text-2xl font-bold">
              €{((costiEspositori?.strutturaEspositori ?? 0) + (costiEspositori?.graficaEspositori ?? 0) + (costiEspositori?.premontaggioEspositori ?? 0) + (costiEspositori?.accessoriEspositori ?? 0)).toFixed(2)}
            </div>
          </Card>

          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-sm text-muted-foreground">Marginalità media</div>
            <div className="text-2xl font-bold text-green-600">
              {(() => {
                const totalCosts = (costiEspositori?.strutturaEspositori ?? 0) + (costiEspositori?.graficaEspositori ?? 0) + (costiEspositori?.premontaggioEspositori ?? 0) + (costiEspositori?.accessoriEspositori ?? 0);
                const totalQuoted = (costiEspositori?.strutturaEspositori ?? 0) * (1 + (formData.marginalitaStrutturaEspositori ?? 0) / 100) + (costiEspositori?.graficaEspositori ?? 0) * (1 + (formData.marginalitaGraficaEspositori ?? 0) / 100) + (costiEspositori?.premontaggioEspositori ?? 0) * (1 + (formData.marginalitaPremontaggioEspositori ?? 0) / 100) + (costiEspositori?.accessoriEspositori ?? 0) * (1 + (formData.marginalitaAccessoriEspositori ?? 0) / 100);
                const margin = totalCosts > 0 ? (totalQuoted - totalCosts) / totalCosts * 100 : 0;
                return margin.toFixed(1);
              })()}%
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>;
}
