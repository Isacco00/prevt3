import React from 'react';
import { Calculator } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
  const handleInputChange = (field: keyof ExpositoreData, value: string) => {
    // Rimuovi caratteri non numerici eccetto stringa vuota
    const cleanValue = value.replace(/[^0-9]/g, '');
    const numValue = cleanValue === '' ? 0 : parseInt(cleanValue) || 0;
    setFormData({
      ...formData,
      [field]: numValue
    });
  };

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

      {/* Accessori Espositori */}
      <Card className="border-l-4 border-l-espositore">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-espositore">Accessori Espositori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ripiani */}
            <div className="space-y-2">
              <Label htmlFor="ripiano_30x30">Ripiano 30x30</Label>
              <Input
                id="ripiano_30x30"
                type="number"
                min="0"
                max="10"
                value={formData.ripiano_30x30 === 0 ? '' : formData.ripiano_30x30.toString()}
                onChange={(e) => handleInputChange('ripiano_30x30', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ripiano_50x50">Ripiano 50x50</Label>
              <Input
                id="ripiano_50x50"
                type="number"
                min="0"
                max="10"
                value={formData.ripiano_50x50 === 0 ? '' : formData.ripiano_50x50.toString()}
                onChange={(e) => handleInputChange('ripiano_50x50', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ripiano_100x50">Ripiano 100x50</Label>
              <Input
                id="ripiano_100x50"
                type="number"
                min="0"
                max="10"
                value={formData.ripiano_100x50 === 0 ? '' : formData.ripiano_100x50.toString()}
                onChange={(e) => handleInputChange('ripiano_100x50', e.target.value)}
                placeholder="0"
              />
            </div>

            {/* Teche in plexiglass */}
            <div className="space-y-2">
              <Label htmlFor="teca_plexiglass_30x30x30">Teca in plexiglass 30x30x30</Label>
              <Input
                id="teca_plexiglass_30x30x30"
                type="number"
                min="0"
                max="10"
                value={formData.teca_plexiglass_30x30x30 === 0 ? '' : formData.teca_plexiglass_30x30x30.toString()}
                onChange={(e) => handleInputChange('teca_plexiglass_30x30x30', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teca_plexiglass_50x50x50">Teca in plexiglass 50x50x50</Label>
              <Input
                id="teca_plexiglass_50x50x50"
                type="number"
                min="0"
                max="10"
                value={formData.teca_plexiglass_50x50x50 === 0 ? '' : formData.teca_plexiglass_50x50x50.toString()}
                onChange={(e) => handleInputChange('teca_plexiglass_50x50x50', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teca_plexiglass_100x50x30">Teca in plexiglass 100x50x30</Label>
              <Input
                id="teca_plexiglass_100x50x30"
                type="number"
                min="0"
                max="10"
                value={formData.teca_plexiglass_100x50x30 === 0 ? '' : formData.teca_plexiglass_100x50x30.toString()}
                onChange={(e) => handleInputChange('teca_plexiglass_100x50x30', e.target.value)}
                placeholder="0"
              />
            </div>

            {/* Retroilluminazioni */}
            <div className="space-y-2">
              <Label htmlFor="retroilluminazione_30x30x100h">Retroilluminazione 30x30x100 H</Label>
              <Input
                id="retroilluminazione_30x30x100h"
                type="number"
                min="0"
                max="10"
                value={formData.retroilluminazione_30x30x100h === 0 ? '' : formData.retroilluminazione_30x30x100h.toString()}
                onChange={(e) => handleInputChange('retroilluminazione_30x30x100h', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retroilluminazione_50x50x100h">Retroilluminazione 50x50x100 H</Label>
              <Input
                id="retroilluminazione_50x50x100h"
                type="number"
                min="0"
                max="10"
                value={formData.retroilluminazione_50x50x100h === 0 ? '' : formData.retroilluminazione_50x50x100h.toString()}
                onChange={(e) => handleInputChange('retroilluminazione_50x50x100h', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retroilluminazione_100x50x100h">Retroilluminazione 100x50x100 H</Label>
              <Input
                id="retroilluminazione_100x50x100h"
                type="number"
                min="0"
                max="10"
                value={formData.retroilluminazione_100x50x100h === 0 ? '' : formData.retroilluminazione_100x50x100h.toString()}
                onChange={(e) => handleInputChange('retroilluminazione_100x50x100h', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}