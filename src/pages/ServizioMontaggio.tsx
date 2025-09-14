import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Settings, Calculator } from 'lucide-react';

interface ServizioData {
  id?: string;
  preventivo_id: string;
  personale_mont: number;
  costo_orario_mont: number;
  giorni_montaggio: number;
  ore_lavoro_cantxper_mont: number;
  km_AR_mont: number;
  conseg_cant: boolean;
  volo_mont: string;
  treno_mont: boolean;
  ore_viaggio_trasferta_mont: number;
  viaggio_auto_com_mont: boolean;
  extra_costi_trasferta_mont: string;
  extra_km_trasp_furg_mont: number;
  extra_km_trasp_tir_mont: number;
  ricarico_montaggio: number;
}

export default function ServizioMontaggio() {
  const { preventivo_id } = useParams<{ preventivo_id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ServizioData>({
    preventivo_id: preventivo_id || '',
    personale_mont: 0,
    costo_orario_mont: 20,
    giorni_montaggio: 0,
    ore_lavoro_cantxper_mont: 0,
    km_AR_mont: 0,
    conseg_cant: false,
    volo_mont: 'NO',
    treno_mont: false,
    ore_viaggio_trasferta_mont: 0,
    viaggio_auto_com_mont: false,
    extra_costi_trasferta_mont: 'NO',
    extra_km_trasp_furg_mont: 0,
    extra_km_trasp_tir_mont: 0,
    ricarico_montaggio: 30,
  });

  // Fetch existing service data
  const { data: servizioData } = useQuery({
    queryKey: ['preventivi_servizi', preventivo_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preventivi_servizi')
        .select('*')
        .eq('preventivo_id', preventivo_id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!preventivo_id,
  });

  // Fetch parameters
  const { data: parametri } = useQuery({
    queryKey: ['parametri_a_costi_unitari'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parametri_a_costi_unitari')
        .select('*')
        .eq('attivo', true);
      if (error) throw error;
      return data;
    },
  });

  // Fetch flight costs
  const { data: costiVolo } = useQuery({
    queryKey: ['costi_volo_ar'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('costi_volo_ar')
        .select('*')
        .eq('attivo', true);
      if (error) throw error;
      return data;
    },
  });

  // Fetch extra costs
  const { data: costiExtra } = useQuery({
    queryKey: ['costi_extra_trasf_mont'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('costi_extra_trasf_mont')
        .select('*')
        .eq('attivo', true);
      if (error) throw error;
      return data;
    },
  });

  // Load existing data
  useEffect(() => {
    if (servizioData) {
      setFormData({
        id: servizioData.id,
        preventivo_id: servizioData.preventivo_id,
        personale_mont: servizioData.personale_mont || 0,
        costo_orario_mont: servizioData.costo_orario_mont || 20,
        giorni_montaggio: servizioData.giorni_montaggio || 0,
        ore_lavoro_cantxper_mont: servizioData.ore_lavoro_cantxper_mont || 0,
        km_AR_mont: servizioData.km_ar_mont || 0,
        conseg_cant: servizioData.conseg_cant || false,
        volo_mont: servizioData.volo_mont || 'NO',
        treno_mont: servizioData.treno_mont || false,
        ore_viaggio_trasferta_mont: servizioData.ore_viaggio_trasferta_mont || 0,
        viaggio_auto_com_mont: servizioData.viaggio_auto_com_mont || false,
        extra_costi_trasferta_mont: servizioData.extra_costi_trasferta_mont || 'NO',
        extra_km_trasp_furg_mont: servizioData.extra_km_trasp_furg_mont || 0,
        extra_km_trasp_tir_mont: servizioData.extra_km_trasp_tir_mont || 0,
        ricarico_montaggio: servizioData.ricarico_montaggio || 30,
      });
    }
  }, [servizioData]);

  // Calculate costs
  const calculateCosts = () => {
    if (!parametri || !costiVolo || !costiExtra) return {};

    const getParameterValue = (name: string) => {
      const param = parametri.find(p => p.parametro === name);
      return param ? parseFloat(param.valore.toString()) : 0;
    };

    const getFlightCost = (type: string) => {
      const flight = costiVolo.find(v => v.tipologia === type);
      return flight ? parseFloat(flight.costo_volo_ar.toString()) : 0;
    };

    const getExtraCost = (level: string) => {
      const extra = costiExtra.find(e => e.livello === level);
      return extra ? parseFloat(extra.costo_extra_mont.toString()) : 0;
    };

    const costXkm = getParameterValue('costo montatori xkm');
    const costoPasto = getParameterValue('Costo pasto');
    const costoAlloggio = getParameterValue('Costo alloggio');
    const costoKmTreno = getParameterValue('Costo treno al km');
    const costoKmAuto = getParameterValue('Costo auto al km');
    const costoFissoConsegna = getParameterValue('Costo fisso consegna');

    // Calcoli
    const totCostOreMont = formData.personale_mont * formData.costo_orario_mont * formData.giorni_montaggio * formData.ore_lavoro_cantxper_mont;
    const totCostKmMont = formData.km_AR_mont * costXkm;
    const numVitti = 2 * formData.personale_mont * formData.giorni_montaggio;
    const numAlloggi = formData.giorni_montaggio === 1 ? 0 : (formData.giorni_montaggio - 1) * formData.personale_mont;
    const totCostVittAll = numVitti * costoPasto + numAlloggi * costoAlloggio;
    const totCostoVoloAR = formData.volo_mont !== 'NO' ? getFlightCost(formData.volo_mont) * formData.personale_mont : 0;
    const totCostoTreno = formData.treno_mont ? formData.km_AR_mont * costoKmTreno * formData.personale_mont : 0;
    const totCostoTrasfPers = formData.personale_mont * formData.ore_viaggio_trasferta_mont * formData.costo_orario_mont;
    const totCostiAuto = formData.viaggio_auto_com_mont ? formData.km_AR_mont * costoKmAuto : 0;
    const totCostiExtraTrasfMont = formData.extra_costi_trasferta_mont !== 'NO' ? getExtraCost(formData.extra_costi_trasferta_mont) * formData.giorni_montaggio * formData.personale_mont : 0;
    const totCostiExtraKmTraspFurgMont = formData.extra_km_trasp_furg_mont;
    const totCostiExtraKmTraspTirMont = formData.extra_km_trasp_tir_mont;
    const totCostiConsegnaCantiere = formData.conseg_cant ? costoFissoConsegna : 0;

    const totaleCostoMontaggio = totCostOreMont + totCostKmMont + totCostVittAll + totCostoVoloAR + totCostoTreno + totCostoTrasfPers + totCostiAuto + totCostiExtraTrasfMont + totCostiExtraKmTraspFurgMont + totCostiExtraKmTraspTirMont + totCostiConsegnaCantiere;
    const preventivoMontaggio = totaleCostoMontaggio * (1 + formData.ricarico_montaggio / 100);

    return {
      totCostOreMont,
      totCostKmMont,
      numVitti,
      numAlloggi,
      totCostVittAll,
      totCostoVoloAR,
      totCostoTreno,
      totCostoTrasfPers,
      totCostiAuto,
      totCostiExtraTrasfMont,
      totCostiExtraKmTraspFurgMont,
      totCostiExtraKmTraspTirMont,
      totCostiConsegnaCantiere,
      totaleCostoMontaggio,
      preventivoMontaggio,
    };
  };

  const costs = calculateCosts();

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ServizioData & { costs: any }) => {
      const payload = {
        preventivo_id: data.preventivo_id,
        montaggio_smontaggio: true,
        personale_mont: data.personale_mont,
        costo_orario_mont: data.costo_orario_mont,
        giorni_montaggio: data.giorni_montaggio,
        ore_lavoro_cantxper_mont: data.ore_lavoro_cantxper_mont,
        km_ar_mont: data.km_AR_mont,
        conseg_cant: data.conseg_cant,
        volo_mont: data.volo_mont,
        treno_mont: data.treno_mont,
        ore_viaggio_trasferta_mont: data.ore_viaggio_trasferta_mont,
        viaggio_auto_com_mont: data.viaggio_auto_com_mont,
        extra_costi_trasferta_mont: data.extra_costi_trasferta_mont,
        extra_km_trasp_furg_mont: data.extra_km_trasp_furg_mont,
        extra_km_trasp_tir_mont: data.extra_km_trasp_tir_mont,
        ricarico_montaggio: data.ricarico_montaggio,
        tot_cost_ore_mont: data.costs.totCostOreMont,
        tot_cost_km_mont: data.costs.totCostKmMont,
        num_vitti: data.costs.numVitti,
        num_alloggi: data.costs.numAlloggi,
        tot_cost_vittall: data.costs.totCostVittAll,
        tot_costo_volo_ar: data.costs.totCostoVoloAR,
        tot_costo_treno: data.costs.totCostoTreno,
        tot_costo_trasf_pers: data.costs.totCostoTrasfPers,
        tot_costi_auto: data.costs.totCostiAuto,
        tot_costi_extra_trasf_mont: data.costs.totCostiExtraTrasfMont,
        tot_costi_extra_km_trasp_furg_mont: data.costs.totCostiExtraKmTraspFurgMont,
        tot_costi_extra_km_trasp_tir_mont: data.costs.totCostiExtraKmTraspTirMont,
        tot_costi_consegna_cantiere: data.costs.totCostiConsegnaCantiere,
        totale_costo_montaggio: data.costs.totaleCostoMontaggio,
        preventivo_montaggio: data.costs.preventivoMontaggio,
      };

      if (data.id) {
        const { error } = await supabase
          .from('preventivi_servizi')
          .update(payload)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('preventivi_servizi')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Servizio montaggio salvato con successo');
      queryClient.invalidateQueries({ queryKey: ['preventivi_servizi'] });
      navigate('/preventivi');
    },
    onError: (error) => {
      toast.error('Errore nel salvataggio: ' + error.message);
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ ...formData, costs });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/preventivi')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai Preventivi
          </Button>
          <h1 className="text-2xl font-bold">Servizio di Montaggio</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dati di ingresso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Dati ingresso
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Inserisci i dati per stimare i costi del servizio di montaggio
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personale">Personale</Label>
                  <Input
                    id="personale"
                    type="number"
                    value={formData.personale_mont}
                    onChange={(e) => setFormData({ ...formData, personale_mont: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-right text-muted-foreground">Nr.</p>
                </div>
                <div>
                  <Label htmlFor="costo_orario">Costo orario personale</Label>
                  <Input
                    id="costo_orario"
                    type="number"
                    value={formData.costo_orario_mont}
                    onChange={(e) => setFormData({ ...formData, costo_orario_mont: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-right text-muted-foreground">€</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="giorni">Giorni per il montaggio + viaggio</Label>
                  <Input
                    id="giorni"
                    type="number"
                    value={formData.giorni_montaggio}
                    onChange={(e) => setFormData({ ...formData, giorni_montaggio: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-right text-muted-foreground">Nr.</p>
                </div>
                <div>
                  <Label htmlFor="ore_lavoro">Ore montaggio in cantiere per persona</Label>
                  <Input
                    id="ore_lavoro"
                    type="number"
                    value={formData.ore_lavoro_cantxper_mont}
                    onChange={(e) => setFormData({ ...formData, ore_lavoro_cantxper_mont: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-right text-muted-foreground">h</p>
                </div>
              </div>

              <div>
                <Label htmlFor="km_ar">Km Viaggio montaggio A+R</Label>
                <Input
                  id="km_ar"
                  type="number"
                  value={formData.km_AR_mont}
                  onChange={(e) => setFormData({ ...formData, km_AR_mont: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consegna"
                  checked={formData.conseg_cant}
                  onCheckedChange={(checked) => setFormData({ ...formData, conseg_cant: checked as boolean })}
                />
                <Label htmlFor="consegna">Consegna cantiere (SI/NO)</Label>
              </div>

              <div>
                <Label htmlFor="volo">Volo</Label>
                <Select value={formData.volo_mont} onValueChange={(value) => setFormData({ ...formData, volo_mont: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">NO</SelectItem>
                    <SelectItem value="Low cost">Low cost</SelectItem>
                    <SelectItem value="Last minute">Last minute</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="treno"
                  checked={formData.treno_mont}
                  onCheckedChange={(checked) => setFormData({ ...formData, treno_mont: checked as boolean })}
                />
                <Label htmlFor="treno">Treno</Label>
              </div>

              <div>
                <Label htmlFor="ore_viaggio">Ore viaggio trasferta montatori (treno/aereo, no camion)</Label>
                <Input
                  id="ore_viaggio"
                  type="number"
                  value={formData.ore_viaggio_trasferta_mont}
                  onChange={(e) => setFormData({ ...formData, ore_viaggio_trasferta_mont: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto_com"
                  checked={formData.viaggio_auto_com_mont}
                  onCheckedChange={(checked) => setFormData({ ...formData, viaggio_auto_com_mont: checked as boolean })}
                />
                <Label htmlFor="auto_com">Viaggio Auto commerciale</Label>
              </div>

              <div>
                <Label htmlFor="extra_costi">Extra (park,metro, taxi, materiali di consumo)</Label>
                <Select value={formData.extra_costi_trasferta_mont} onValueChange={(value) => setFormData({ ...formData, extra_costi_trasferta_mont: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">NO</SelectItem>
                    <SelectItem value="Basso">Basso</SelectItem>
                    <SelectItem value="Medio">Medio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="extra_furg">Km. extra Trasporto Furgone &lt; 35 q.li</Label>
                  <Input
                    id="extra_furg"
                    type="number"
                    value={formData.extra_km_trasp_furg_mont}
                    onChange={(e) => setFormData({ ...formData, extra_km_trasp_furg_mont: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-right text-muted-foreground">€</p>
                </div>
                <div>
                  <Label htmlFor="extra_tir">Km. extra trasporto camion &gt; 35 q.li</Label>
                  <Input
                    id="extra_tir"
                    type="number"
                    value={formData.extra_km_trasp_tir_mont}
                    onChange={(e) => setFormData({ ...formData, extra_km_trasp_tir_mont: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-right text-muted-foreground">€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calcolo costi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calcolo costi
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Visualizza i costi relativi al servizio di montaggio
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Costo ore montatori</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostOreMont?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo km montatori</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostKmMont?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Numero dei pasti previsti</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{costs.numVitti || 0}</span>
                    <p className="text-xs text-muted-foreground">Nr.</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Numero dei pernottamenti previsti</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{costs.numAlloggi || 0}</span>
                    <p className="text-xs text-muted-foreground">Nr.</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo vitto e alloggio montatori</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostVittAll?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo volo aereo A/R</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoVoloAR?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo treno A/R</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoTreno?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo di trasferta del personale</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoTrasfPers?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo viaggio in auto</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiAuto?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi extra (park,metro, taxi, materiali di consumo)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraTrasfMont?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi trasporto legati ad utilizzo di mezzo leggero (&lt;35q.li)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraKmTraspFurgMont?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi trasporto legati ad utilizzo di mezzo pesante (&gt;35q.li)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraKmTraspTirMont?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi per consegna merce in cantiere</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiConsegnaCantiere?.toFixed(2) || '0.00'}</span>
                    <p className="text-xs text-muted-foreground">€</p>
                  </div>
                </div>
              </div>

              {/* Specchietto riassuntivo */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Totale costo montaggio</span>
                  <span className="font-bold text-lg">€ {costs.totaleCostoMontaggio?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="ricarico">Ricarico</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="ricarico"
                      type="number"
                      value={formData.ricarico_montaggio}
                      onChange={(e) => setFormData({ ...formData, ricarico_montaggio: parseFloat(e.target.value) || 0 })}
                      className="w-20 text-right"
                    />
                    <span>%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Preventivo Montaggio</span>
                  <span>€ {costs.preventivoMontaggio?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/preventivi')}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Salvando...' : 'Salva Configurazione'}
          </Button>
        </div>
      </div>
    </div>
  );
}