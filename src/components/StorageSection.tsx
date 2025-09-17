import React, { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
    marginalita_struttura_storage?: number;
    marginalita_grafica_storage?: number;
    marginalita_premontaggio_storage?: number;
  };
  setFormData: (data: any) => void;
  profiliDistribuzioneMap: Record<number, number>;
  parametri: any[];
  accessoriStand: any[];
  prospect?: { tipo_prospect?: string };
  onCostsChange?: (costs: {
    costo_struttura_storage: number;
    costo_grafica_storage: number;
    costo_premontaggio_storage: number;
    costo_totale_storage: number;
  }) => void;
}

export function StorageSection({ formData, setFormData, profiliDistribuzioneMap, parametri, accessoriStand, prospect, onCostsChange }: StorageSectionProps) {
  const { user } = useAuth();

  // Fetch marginality data
  const { data: marginalitaData = [] } = useQuery({
    queryKey: ['marginalita-per-prospect'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marginalita_per_prospect')
        .select('*')
        .eq('attivo', true);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Set default margins based on prospect type
  useEffect(() => {
    if (prospect?.tipo_prospect && marginalitaData.length > 0) {
      const marginalitaConfig = marginalitaData.find(m => m.tipo_prospect === prospect.tipo_prospect);
      if (marginalitaConfig) {
        const defaultMargin = marginalitaConfig.marginalita;
        setFormData({
          ...formData,
          marginalita_struttura_storage: formData.marginalita_struttura_storage ?? defaultMargin,
          marginalita_grafica_storage: formData.marginalita_grafica_storage ?? defaultMargin,
          marginalita_premontaggio_storage: formData.marginalita_premontaggio_storage ?? defaultMargin,
        });
      }
    }
  }, [prospect?.tipo_prospect, marginalitaData]);

  // Fetch parametri a costi unitari
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
    enabled: !!user,
  });
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
    const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
    const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
    const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === formData.alt_storage);

    // Trova il costo della porta dagli accessori stand
    const portaAccessorio = accessoriStand.find(acc => acc.nome?.toLowerCase().includes('porta'));
    const costoPorta = portaAccessorio ? portaAccessorio.costo_unitario : 0;
    const numeroPorte = parseInt(formData.numero_porte) || 0;

    // Costo struttura a terra storage: sviluppo lineare * costo struttura al m/l in funzione altezza + numero porte * costo porta
    const costoStrutturaBase = costoAltezzaParam ? 
      storageElements.sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;
    const costoPorte = numeroPorte * costoPorta;
    const costo_struttura_storage = costoStrutturaBase + costoPorte;

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
  }, [formData.larg_storage, formData.prof_storage, formData.alt_storage, formData.numero_porte, storageElements, parametri, parametriCostiUnitari, accessoriStand]);

  useEffect(() => {
    onCostsChange?.(storageCosts);
  }, [storageCosts, onCostsChange]);

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
        
        {/* Cost cards layout matching StandSection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Struttura storage */}
          <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-medium">Struttura storage</div>
              <div className="text-lg font-bold">€{storageCosts.costo_struttura_storage.toFixed(2)}</div>
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
                    value={formData.marginalita_struttura_storage ?? 50}
                    onChange={(e) => setFormData({
                      ...formData,
                      marginalita_struttura_storage: parseFloat(e.target.value) || 0
                    })}
                    className="w-16 h-6 text-xs text-center"
                  />
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary">€{(storageCosts.costo_struttura_storage * (1 + (formData.marginalita_struttura_storage ?? 50) / 100)).toFixed(2)}</div>
            </div>
          </Card>

          {/* Grafica storage */}
          <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-medium">Grafica storage</div>
              <div className="text-lg font-bold">€{storageCosts.costo_grafica_storage.toFixed(2)}</div>
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
                    value={formData.marginalita_grafica_storage ?? 50}
                    onChange={(e) => setFormData({
                      ...formData,
                      marginalita_grafica_storage: parseFloat(e.target.value) || 0
                    })}
                    className="w-16 h-6 text-xs text-center"
                  />
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary">€{(storageCosts.costo_grafica_storage * (1 + (formData.marginalita_grafica_storage ?? 50) / 100)).toFixed(2)}</div>
            </div>
          </Card>

          {/* Premontaggio storage */}
          <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-medium">Premontaggio Storage</div>
              <div className="text-lg font-bold">€{storageCosts.costo_premontaggio_storage.toFixed(2)}</div>
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
                    value={formData.marginalita_premontaggio_storage ?? 50}
                    onChange={(e) => setFormData({
                      ...formData,
                      marginalita_premontaggio_storage: parseFloat(e.target.value) || 0
                    })}
                    className="w-16 h-6 text-xs text-center"
                  />
                  <span className="text-xs">%</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary">€{(storageCosts.costo_premontaggio_storage * (1 + (formData.marginalita_premontaggio_storage ?? 50) / 100)).toFixed(2)}</div>
            </div>
          </Card>
        </div>

        {/* Summary */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Totale preventivo storage</div>
                <div className="text-2xl font-bold text-primary">
                  €{(() => {
                    const totalePreventivo = 
                      storageCosts.costo_struttura_storage * (1 + (formData.marginalita_struttura_storage) / 100) +
                      storageCosts.costo_grafica_storage * (1 + (formData.marginalita_grafica_storage) / 100) +
                      storageCosts.costo_premontaggio_storage * (1 + (formData.marginalita_premontaggio_storage) / 100);
                    return totalePreventivo.toFixed(2);
                  })()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Totale costi storage</div>
                <div className="text-2xl font-bold">
                  €{storageCosts.costo_totale_storage.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Marginalità Media (%)</div>
                <div className="text-2xl font-bold text-green-600">
                  {(() => {
                    if (storageCosts.costo_totale_storage === 0) return '0.0%';
                    const totalePreventivo = 
                      storageCosts.costo_struttura_storage * (1 + (formData.marginalita_struttura_storage) / 100) +
                      storageCosts.costo_grafica_storage * (1 + (formData.marginalita_grafica_storage) / 100) +
                      storageCosts.costo_premontaggio_storage * (1 + (formData.marginalita_premontaggio_storage) / 100);
                    const marginalitaMedia = ((totalePreventivo - storageCosts.costo_totale_storage) / storageCosts.costo_totale_storage * 100);
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