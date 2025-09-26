import React, { useEffect, useMemo, useState } from 'react';
import { Calculator, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ExpositoreData {
  qta_tipo30: number;
  qta_tipo50: number;
  qta_tipo100: number;
  ripiano_30x30: number;
  ripiano_50x50: number;
  ripiano_100x50: number;
  teca_plexiglass_30x30x30: number;
  teca_plexiglass_50x50x50: number;
  teca_plexiglass_100x50x30: number;
  retroilluminazione_30x30x100h: number;
  retroilluminazione_50x50x100h: number;
  retroilluminazione_100x50x100h: number;
  borsa_espositori: number;
}

interface ExpositorePhysicalElements {
  numero_pezzi_espositori: number;
  superficie_stampa_espositori: number;
}

interface EspositorePhysicalElementsProps {
  physicalElements: ExpositorePhysicalElements;
}

interface EspositoriSectionProps {
  formData: ExpositoreData & {
    marginalita_struttura_espositori?: number;
    marginalita_grafica_espositori?: number;
    marginalita_premontaggio_espositori?: number;
    marginalita_accessori_espositori?: number;
  };
  setFormData: (data: any) => void;
  physicalElements: ExpositorePhysicalElements;
  onChange: (field: string, value: any) => void;
  costiEspositori?: {
    struttura_espositori: number;
    grafica_espositori: number;
    premontaggio_espositori: number;
    accessori_espositori: number;
    totale: number;
  };
  onCostsChange?: (costs: {
    struttura_espositori: number;
    grafica_espositori: number;
    premontaggio_espositori: number;
    accessori_espositori: number;
    costo_totale_espositori: number;
  }) => void;
}

function EspositorePhysicalElements({ physicalElements }: EspositorePhysicalElementsProps) {
  return (
    <Card className="border-l-4 border-l-espositore">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-espositore">
          <Calculator className="h-4 w-4" />
          Elementi Fisici Espositori (calcolati automaticamente)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Numero pezzi espositori</Label>
            <div className="text-lg font-semibold text-espositore">
              {physicalElements.numero_pezzi_espositori}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Superficie stampa espositori (mq)</Label>
            <div className="text-lg font-semibold text-espositore">
              {physicalElements.superficie_stampa_espositori.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ExpositoreSection({ formData, setFormData, physicalElements, onChange, costiEspositori, onCostsChange }: EspositoriSectionProps) {
  const [accessoriOpen, setAccessoriOpen] = useState(true);
  // Query for accessories prices
  const { data: accessoriesData = [] } = useQuery({
    queryKey: ['listino_accessori_espositori'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listino_accessori_espositori')
        .select('*')
        .eq('attivo', true)
        .order('nome');
      
      if (error) throw error;
      return data;
    },
  });

  // Query for expositor layout costs
  const { data: layoutCostsData = [] } = useQuery({
    queryKey: ['costi_struttura_espositori_layout'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('costi_struttura_espositori_layout')
        .select('*')
        .eq('attivo', true)
        .order('layout_espositore');
      
      if (error) throw error;
      return data;
    },
  });

  // Query for unit cost parameters
  const { data: parametriCostiUnitari = [] } = useQuery({
    queryKey: ['parametri-costi-unitari'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parametri_a_costi_unitari')
        .select('*')
        .eq('attivo', true)
        .order('parametro');
      
      if (error) throw error;
      return data;
    },
  });

  const handleInputChange = (field: keyof ExpositoreData, value: string) => {
    // Rimuovi caratteri non numerici eccetto stringa vuota
    const cleanValue = value.replace(/[^0-9]/g, '');
    const numValue = cleanValue === '' ? 0 : parseInt(cleanValue) || 0;
    setFormData({
      ...formData,
      [field]: numValue
    });
  };

  // Helper functions for accessories
  const getAccessoryPrice = (name: string): number => {
    const accessory = accessoriesData.find(item => item.nome === name);
    return accessory ? Number(accessory.costo_unitario) : 0;
  };

  const getAccessoryQuantity = (fieldName: keyof ExpositoreData): number => {
    return formData[fieldName] || 0;
  };

  const calculateAccessoryTotal = (fieldName: keyof ExpositoreData, unitPrice: number): number => {
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
    const layoutCost = layoutCostsData.find(l => l.layout_espositore === layout);
    return layoutCost ? Number(layoutCost.costo_unitario) : 0;
  };

  // Calculate costs
  const calculateStructureCost = (): number => {
    return (
      (formData.qta_tipo30 || 0) * getLayoutCost('30') +
      (formData.qta_tipo50 || 0) * getLayoutCost('50') +
      (formData.qta_tipo100 || 0) * getLayoutCost('100')
    );
  };

  const calculateGraphicsCost = (): number => {
    const costoStampaGrafica = getParameterValue('Costo Stampa Grafica');
    return physicalElements.superficie_stampa_espositori * costoStampaGrafica;
  };

  const calculatePreassemblyCost = (): number => {
    const costoPremontaggio = getParameterValue('Costo Premontaggio');
    return physicalElements.numero_pezzi_espositori * costoPremontaggio;
  };

  const calculateAccessoriesTotal = (): number => {
    return accessoryMapping.reduce((total, accessory) => {
      const unitPrice = getAccessoryPrice(accessory.name);
      const quantity = getAccessoryQuantity(accessory.field);
      return total + (quantity * unitPrice);
    }, 0);
  };

  const calculateTotalCost = (): number => {
    return calculateStructureCost() + calculateGraphicsCost() + calculatePreassemblyCost() + calculateAccessoriesTotal();
  };

  // Mapping between field names and display names
  const accessoryMapping = [
    { field: 'ripiano_30x30' as keyof ExpositoreData, name: 'Ripiano 30x30' },
    { field: 'ripiano_50x50' as keyof ExpositoreData, name: 'Ripiano 50x50' },
    { field: 'ripiano_100x50' as keyof ExpositoreData, name: 'Ripiano 100x50' },
    { field: 'teca_plexiglass_30x30x30' as keyof ExpositoreData, name: 'Teca in plexiglass 30x30x30' },
    { field: 'teca_plexiglass_50x50x50' as keyof ExpositoreData, name: 'Teca in plexiglass 50x50x50' },
    { field: 'teca_plexiglass_100x50x30' as keyof ExpositoreData, name: 'Teca in plexiglass 100x50x30' },
    { field: 'retroilluminazione_30x30x100h' as keyof ExpositoreData, name: 'Retroilluminazione 30x30x100 H' },
    { field: 'retroilluminazione_50x50x100h' as keyof ExpositoreData, name: 'Retroilluminazione 50x50x100 H' },
    { field: 'retroilluminazione_100x50x100h' as keyof ExpositoreData, name: 'Retroilluminazione 100x50x100 H' },
    { field: 'borsa_espositori' as keyof ExpositoreData, name: 'Borsa' },
  ];

  const expositoriCosts = useMemo(() => ({
    struttura_espositori: calculateStructureCost(),
    grafica_espositori: calculateGraphicsCost(),
    premontaggio_espositori: calculatePreassemblyCost(),
    accessori_espositori: calculateAccessoriesTotal(),
    costo_totale_espositori: calculateTotalCost(),
  }), [formData, physicalElements, accessoriesData, layoutCostsData, parametriCostiUnitari]);

  useEffect(() => {
    onCostsChange?.(expositoriCosts);
  }, [expositoriCosts, onCostsChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5" />
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
                <Input
                  type="number"
                  min="0"
                  value={formData.qta_tipo30 === 0 ? '' : formData.qta_tipo30.toString()}
                  onChange={(e) => handleInputChange('qta_tipo30', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-1">
                <Input
                  type="number"
                  min="0"
                  value={formData.qta_tipo50 === 0 ? '' : formData.qta_tipo50.toString()}
                  onChange={(e) => handleInputChange('qta_tipo50', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-1">
                <Input
                  type="number"
                  min="0"
                  value={formData.qta_tipo100 === 0 ? '' : formData.qta_tipo100.toString()}
                  onChange={(e) => handleInputChange('qta_tipo100', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elementi Fisici */}
      <EspositorePhysicalElements physicalElements={physicalElements} />

      {/* Accessori Espositori - Table Format */}
      <Collapsible open={accessoriOpen} onOpenChange={setAccessoriOpen}>
        <Card className="border-l-4 border-l-espositore">
          <CardHeader className="pb-3">
            <CollapsibleTrigger className="flex items-center gap-2 w-full">
              <CardTitle className="text-sm text-espositore">Accessori Espositori</CardTitle>
              {accessoriOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
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
                  {accessoryMapping.map((accessory) => {
                    const unitPrice = getAccessoryPrice(accessory.name);
                    const quantity = getAccessoryQuantity(accessory.field);
                    const total = calculateAccessoryTotal(accessory.field, unitPrice);
                    
                    return (
                      <TableRow key={accessory.field}>
                        <TableCell className="font-medium">{accessory.name}</TableCell>
                        <TableCell className="text-center">
                          €{unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            value={quantity || 0}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 0;
                              handleInputChange(accessory.field, newQuantity.toString());
                            }}
                            className="w-20 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          €{total.toFixed(2)}
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
                <div className="text-lg font-bold">€{(costiEspositori?.struttura_espositori ?? 0).toFixed(2)}</div>
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
                      value={formData.marginalita_struttura_espositori ?? 0}
                      onChange={(e) =>
                        onChange('marginalita_struttura_espositori', e.target.value === '' ? 0 : Number(e.target.value))
                      }
                      className="w-16 h-6 text-xs text-center"
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary">
                  €{((costiEspositori?.struttura_espositori ?? 0) * (1 + ((formData.marginalita_struttura_espositori ?? 0) / 100))).toFixed(2)}
                </div>
              </div>
            </Card>

            {/* Grafica espositori */}
            <Card className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm font-medium">Grafica espositori</div>
                <div className="text-lg font-bold">€{(costiEspositori?.grafica_espositori ?? 0).toFixed(2)}</div>
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
                      value={formData.marginalita_grafica_espositori ?? 0}
                      onChange={(e) =>
                        onChange('marginalita_grafica_espositori', e.target.value === '' ? 0 : Number(e.target.value))
                      }
                      className="w-16 h-6 text-xs text-center"
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary">
                  €{((costiEspositori?.grafica_espositori ?? 0) * (1 + ((formData.marginalita_grafica_espositori ?? 0) / 100))).toFixed(2)}
                </div>
              </div>
            </Card>

            {/* Premontaggio espositori */}
            <Card className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm font-medium">Premontaggio espositori</div>
                <div className="text-lg font-bold">€{(costiEspositori?.premontaggio_espositori ?? 0).toFixed(2)}</div>
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
                      value={formData.marginalita_premontaggio_espositori ?? 0}
                      onChange={(e) =>
                        onChange('marginalita_premontaggio_espositori', e.target.value === '' ? 0 : Number(e.target.value))
                      }
                      className="w-16 h-6 text-xs text-center"
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary">
                  €{((costiEspositori?.premontaggio_espositori ?? 0) * (1 + ((formData.marginalita_premontaggio_espositori ?? 0) / 100))).toFixed(2)}
                </div>
              </div>
            </Card>

            {/* Accessori espositori */}
            <Card className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm font-medium">Accessori espositori</div>
                <div className="text-lg font-bold">€{(costiEspositori?.accessori_espositori ?? 0).toFixed(2)}</div>
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
                      value={formData.marginalita_accessori_espositori ?? 0}
                      onChange={(e) =>
                        onChange('marginalita_accessori_espositori', e.target.value === '' ? 0 : Number(e.target.value))
                      }
                      className="w-16 h-6 text-xs text-center"
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary">
                  €{((costiEspositori?.accessori_espositori ?? 0) * (1 + ((formData.marginalita_accessori_espositori ?? 0) / 100))).toFixed(2)}
                </div>
              </div>
            </Card>
          </div>

          {/* Summary cards with totals */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="text-sm text-muted-foreground">Totale preventivo espositori</div>
              <div className="text-2xl font-bold text-primary">
                €{(
                  ((costiEspositori?.struttura_espositori ?? 0) * (1 + ((formData.marginalita_struttura_espositori ?? 0) / 100))) +
                  ((costiEspositori?.grafica_espositori ?? 0) * (1 + ((formData.marginalita_grafica_espositori ?? 0) / 100))) +
                  ((costiEspositori?.premontaggio_espositori ?? 0) * (1 + ((formData.marginalita_premontaggio_espositori ?? 0) / 100))) +
                  ((costiEspositori?.accessori_espositori ?? 0) * (1 + ((formData.marginalita_accessori_espositori ?? 0) / 100)))
                ).toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 bg-muted/30">
              <div className="text-sm text-muted-foreground">Totale costi espositori</div>
              <div className="text-2xl font-bold">
                €{((costiEspositori?.struttura_espositori ?? 0) + (costiEspositori?.grafica_espositori ?? 0) + (costiEspositori?.premontaggio_espositori ?? 0) + (costiEspositori?.accessori_espositori ?? 0)).toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm text-muted-foreground">Marginalità media</div>
              <div className="text-2xl font-bold text-green-600">
                {(() => {
                  const totalCosts = (costiEspositori?.struttura_espositori ?? 0) + (costiEspositori?.grafica_espositori ?? 0) + (costiEspositori?.premontaggio_espositori ?? 0) + (costiEspositori?.accessori_espositori ?? 0);
                  const totalQuoted = 
                    ((costiEspositori?.struttura_espositori ?? 0) * (1 + ((formData.marginalita_struttura_espositori ?? 0) / 100))) +
                    ((costiEspositori?.grafica_espositori ?? 0) * (1 + ((formData.marginalita_grafica_espositori ?? 0) / 100))) +
                    ((costiEspositori?.premontaggio_espositori ?? 0) * (1 + ((formData.marginalita_premontaggio_espositori ?? 0) / 100))) +
                    ((costiEspositori?.accessori_espositori ?? 0) * (1 + ((formData.marginalita_accessori_espositori ?? 0) / 100)));
                  
                  const margin = totalCosts > 0 ? ((totalQuoted - totalCosts) / totalCosts) * 100 : 0;
                  return margin.toFixed(1);
                })()}%
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}