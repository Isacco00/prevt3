import React from 'react';
import { Calculator } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
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
  formData: ExpositoreData;
  setFormData: (data: any) => void;
  physicalElements: ExpositorePhysicalElements;
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

export function ExpositoreSection({ formData, setFormData, physicalElements }: EspositoriSectionProps) {
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
      <Card className="border-l-4 border-l-espositore">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-espositore">Accessori Espositori</CardTitle>
        </CardHeader>
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
      </Card>
    </div>
  );
}