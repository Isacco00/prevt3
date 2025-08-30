import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

interface StorageSectionProps {
  formData: {
    larg_storage: string;
    prof_storage: string;
    alt_storage: string;
    layout_storage: string;
    numero_porte: string;
    distribuzione: string;
  };
  setFormData: (data: any) => void;
  profiliDistribuzioneMap: Record<number, number>;
  parametri: any[];
}

export function StorageSection({ formData, setFormData, profiliDistribuzioneMap, parametri }: StorageSectionProps) {
  // Calcolo degli elementi fisici per Storage
  const storageElements = useMemo(() => {
    if (!formData.larg_storage || !formData.prof_storage || !formData.alt_storage || !formData.layout_storage || !formData.distribuzione) {
      return {
        superficie_stampa: 0,
        sviluppo_lineare: 0,
        numero_pezzi: 0
      };
    }

    const larg = parseFloat(formData.larg_storage);
    const prof = parseFloat(formData.prof_storage);
    const alt = parseFloat(formData.alt_storage);
    const layout = formData.layout_storage;
    const distribuzione = parseInt(formData.distribuzione);

    // Superficie di stampa Storage
    let superficie_stampa = 0;
    switch (layout) {
      case '0':
        superficie_stampa = (2 * larg + 2 * prof) * alt;
        break;
      case '1':
        superficie_stampa = (2 * larg + 2 * prof) * alt + 2;
        break;
      case '2':
        superficie_stampa = (larg + prof) * alt + 2;
        break;
    }

    // Sviluppo in metri lineari Storage
    let sviluppo_lineare = 0;
    switch (layout) {
      case '0':
        sviluppo_lineare = larg + prof;
        break;
      case '1':
        sviluppo_lineare = 2 * larg + 2 * prof;
        break;
      case '2':
        sviluppo_lineare = larg + prof + 1;
        break;
    }

    // Numero di pezzi Storage
    const fattoreDistribuzione = profiliDistribuzioneMap[distribuzione] || 0;
    const numero_pezzi = sviluppo_lineare * fattoreDistribuzione;

    return {
      superficie_stampa,
      sviluppo_lineare,
      numero_pezzi
    };
  }, [formData.larg_storage, formData.prof_storage, formData.alt_storage, formData.layout_storage, formData.distribuzione, profiliDistribuzioneMap]);

  // Calcolo dei costi Storage
  const storageCosts = useMemo(() => {
    if (!formData.larg_storage || !formData.prof_storage || !formData.alt_storage || !parametri.length) {
      return {
        costo_struttura_storage: 0,
        costo_grafica_storage: 0,
        costo_premontaggio_storage: 0,
        costo_totale_storage: 0
      };
    }

    const altezza = parseFloat(formData.alt_storage);
    
    // Trova i parametri necessari
    const costoStampaParam = parametri.find(p => p.tipo === 'costo_stampa');
    const costoPremontaggio = parametri.find(p => p.tipo === 'costo_premontaggio');
    const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === formData.alt_storage);

    // Costo struttura a terra storage: sviluppo lineare * costo struttura al m/l in funzione altezza
    const costo_struttura_storage = costoAltezzaParam ? 
      storageElements.sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;

    // Costo grafica storage con cordino cucito: superficie stampa * costo stampa grafica al mq
    const costo_grafica_storage = costoStampaParam ? 
      storageElements.superficie_stampa * (costoStampaParam.valore || 0) : 0;

    // Costo premontaggio storage: numero pezzi * costo premontaggio al pezzo
    const costo_premontaggio_storage = costoPremontaggio ? 
      storageElements.numero_pezzi * (costoPremontaggio.valore || 0) : 0;

    const costo_totale_storage = costo_struttura_storage + costo_grafica_storage + costo_premontaggio_storage;

    return {
      costo_struttura_storage,
      costo_grafica_storage,
      costo_premontaggio_storage,
      costo_totale_storage
    };
  }, [formData.larg_storage, formData.prof_storage, formData.alt_storage, storageElements, parametri]);

  return (
    <div className="space-y-6">
      {/* Dati di Ingresso per Storage */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
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
              value={formData.larg_storage}
              onChange={(e) => setFormData({ ...formData, larg_storage: e.target.value })}
              placeholder="0.0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prof_storage">Profondità dello storage (m)</Label>
            <Input
              id="prof_storage"
              type="number"
              step="0.5"
              min="0"
              max="15"
              value={formData.prof_storage}
              onChange={(e) => setFormData({ ...formData, prof_storage: e.target.value })}
              placeholder="0.0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alt_storage">Altezza pareti dello storage (m)</Label>
            <Select value={formData.alt_storage} onValueChange={(value) => setFormData({ ...formData, alt_storage: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona altezza" />
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
            <Label htmlFor="layout_storage">Tipo layout dello storage</Label>
            <Select value={formData.layout_storage} onValueChange={(value) => setFormData({ ...formData, layout_storage: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero_porte">Numero porte</Label>
            <Select value={formData.numero_porte} onValueChange={(value) => setFormData({ ...formData, numero_porte: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona numero porte" />
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
          <Calculator className="h-5 w-5" />
          <h4 className="text-md font-semibold">Elementi Fisici Storage</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Superficie di stampa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageElements.superficie_stampa.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">m²</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sviluppo in metri lineari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageElements.sviluppo_lineare.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">m</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Numero di pezzi storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageElements.numero_pezzi.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">N</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calcolo Costi Storage */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h4 className="text-md font-semibold">Calcolo Costi Storage</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm leading-tight min-h-[2.5rem] flex items-start">
                Costo struttura a terra storage
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col justify-end h-[3rem]">
                <div className="text-2xl font-bold text-left">€{storageCosts.costo_struttura_storage.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm leading-tight min-h-[2.5rem] flex items-start">
                Costo grafica con cordino cucito storage
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col justify-end h-[3rem]">
                <div className="text-2xl font-bold text-right">€{storageCosts.costo_grafica_storage.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm leading-tight min-h-[2.5rem] flex items-start">
                Costo premontaggio storage
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col justify-end h-[3rem]">
                <div className="text-2xl font-bold text-right">€{storageCosts.costo_premontaggio_storage.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative border-2 border-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm leading-tight min-h-[2.5rem] flex items-start text-primary">
                Costo totale storage
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col justify-end h-[3rem]">
                <div className="text-2xl font-bold text-right text-primary">€{storageCosts.costo_totale_storage.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}