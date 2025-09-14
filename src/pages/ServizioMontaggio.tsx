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
  // Montaggio fields
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
  // Smontaggio fields
  personale_smon: number;
  costo_orario_smon: number;
  giorni_smontaggio_viaggio: number;
  ore_lavoro_cantxper_smon: number;
  km_AR_smon: number;
  volo_smon: string;
  treno_smon: boolean;
  ore_viaggio_trasferta_smon: number;
  viaggio_auto_com_smon: boolean;
  extra_costi_trasferta_smon: string;
  extra_km_trasp_furg_smon: number;
  extra_km_trasp_tir_smon: number;
}

export default function ServizioMontaggio() {
  const { preventivo_id } = useParams<{ preventivo_id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ServizioData>({
    preventivo_id: preventivo_id || '',
    // Montaggio defaults
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
    // Smontaggio defaults
    personale_smon: 0,
    costo_orario_smon: 20,
    giorni_smontaggio_viaggio: 0,
    ore_lavoro_cantxper_smon: 0,
    km_AR_smon: 0,
    volo_smon: 'NO',
    treno_smon: false,
    ore_viaggio_trasferta_smon: 0,
    viaggio_auto_com_smon: false,
    extra_costi_trasferta_smon: 'NO',
    extra_km_trasp_furg_smon: 0,
    extra_km_trasp_tir_smon: 0,
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

  // Fetch preventivo info for header
  const { data: preventivoInfo } = useQuery({
    queryKey: ['preventivo_info', preventivo_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preventivi')
        .select(`numero_preventivo, titolo, prospects(ragione_sociale)`)
        .eq('id', preventivo_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!preventivo_id,
  });

  // Fetch parameters
  const { data: parametri } = useQuery({
    queryKey: ['parametri_a_costi_unitari'],
    queryFn: async () => {
      const { data, error } = await supabase.from('parametri_a_costi_unitari').select('*').eq('attivo', true);
      if (error) throw error;
      return data;
    },
  });

  // Fetch flight costs
  const { data: costiVolo } = useQuery({
    queryKey: ['costi_volo_ar'],
    queryFn: async () => {
      const { data, error } = await supabase.from('costi_volo_ar').select('*').eq('attivo', true);
      if (error) throw error;
      return data;
    },
  });

  // Fetch extra costs
  const { data: costiExtra } = useQuery({
    queryKey: ['costi_extra_trasf_mont'],
    queryFn: async () => {
      const { data, error } = await supabase.from('costi_extra_trasf_mont').select('*').eq('attivo', true);
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
        // Montaggio data
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
        // Smontaggio data with defaults
        personale_smon: (servizioData as any).personale_smon || 0,
        costo_orario_smon: (servizioData as any).costo_orario_smon || 20,
        giorni_smontaggio_viaggio: (servizioData as any).giorni_smontaggio_viaggio || 0,
        ore_lavoro_cantxper_smon: (servizioData as any).ore_lavoro_cantxper_smon || 0,
        km_AR_smon: (servizioData as any).km_ar_smon || 0,
        volo_smon: (servizioData as any).volo_smon || 'NO',
        treno_smon: (servizioData as any).treno_smon || false,
        ore_viaggio_trasferta_smon: (servizioData as any).ore_viaggio_trasferta_smon || 0,
        viaggio_auto_com_smon: (servizioData as any).viaggio_auto_com_smon || false,
        extra_costi_trasferta_smon: (servizioData as any).extra_costi_trasferta_smon || 'NO',
        extra_km_trasp_furg_smon: (servizioData as any).extra_km_trasp_furg_smon || 0,
        extra_km_trasp_tir_smon: (servizioData as any).extra_km_trasp_tir_smon || 0,
      });
    }
  }, [servizioData]);

  // Calculate costs
  const calculateCosts = () => {
    if (!parametri || !costiVolo || !costiExtra) return {};

    const getParameterValue = (name: string) => {
      const param = parametri.find((p) => p.parametro === name);
      return param ? parseFloat(param.valore.toString()) : 0;
    };

    const getFlightCost = (type: string) => {
      const flight = costiVolo.find((v) => v.tipologia === type);
      return flight ? parseFloat(flight.costo_volo_ar.toString()) : 0;
    };

    const getExtraCost = (level: string) => {
      const extra = costiExtra.find((e) => e.livello === level);
      return extra ? parseFloat(extra.costo_extra_mont.toString()) : 0;
    };

    const costMontXkm = getParameterValue('Costo montatori xkm');
    const costoPasto = getParameterValue('Costo pasto');
    const costoAlloggio = getParameterValue('Costo alloggio');
    const costoKmTreno = getParameterValue('Costo treno al km');
    const costoKmAuto = getParameterValue('Costo auto al km');
    const costoFissoConsegna = getParameterValue('Costo fisso consegna');
    const costoFurgXKm = getParameterValue('Costo furgone al km');
    const costoTirXKm = getParameterValue('Costo TIR al km');

    // Calcoli MONTAGGIO
    const totCostOreMont =
      formData.personale_mont *
      formData.costo_orario_mont *
      formData.giorni_montaggio *
      formData.ore_lavoro_cantxper_mont;
    const totCostKmMont = formData.km_AR_mont * costMontXkm;
    const numVitti = 2 * formData.personale_mont * formData.giorni_montaggio;
    const numAlloggi =
      formData.giorni_montaggio === 1 ? 0 : (formData.giorni_montaggio - 1) * formData.personale_mont;
    const totCostVittAll = numVitti * costoPasto + numAlloggi * costoAlloggio;
    const totCostoVoloAR =
      formData.volo_mont !== 'NO' ? getFlightCost(formData.volo_mont) * formData.personale_mont : 0;
    const totCostoTreno = formData.treno_mont
      ? formData.km_AR_mont * costoKmTreno * formData.personale_mont
      : 0;
    const totCostoTrasfPers =
      formData.personale_mont * formData.ore_viaggio_trasferta_mont * formData.costo_orario_mont;
    const totCostiAuto = formData.viaggio_auto_com_mont ? formData.km_AR_mont * costoKmAuto : 0;
    const totCostiExtraTrasfMont =
      formData.extra_costi_trasferta_mont !== 'NO'
        ? getExtraCost(formData.extra_costi_trasferta_mont) * formData.giorni_montaggio * formData.personale_mont
        : 0;
    const totCostiExtraKmTraspFurgMont = formData.extra_km_trasp_furg_mont * costoFurgXKm;
    const totCostiExtraKmTraspTirMont = formData.extra_km_trasp_tir_mont * costoTirXKm;
    const totCostiConsegnaCantiere = formData.conseg_cant ? costoFissoConsegna : 0;
    const totaleCostoMontaggio =
      totCostOreMont +
      totCostKmMont +
      totCostVittAll +
      totCostoVoloAR +
      totCostoTreno +
      totCostoTrasfPers +
      totCostiAuto +
      totCostiExtraTrasfMont +
      totCostiExtraKmTraspFurgMont +
      totCostiExtraKmTraspTirMont +
      totCostiConsegnaCantiere;
    const preventivoMontaggio = totaleCostoMontaggio * (1 + formData.ricarico_montaggio / 100);

    // Calcoli SMONTAGGIO
    const totCostOreSmon =
      formData.personale_smon *
      formData.costo_orario_smon *
      formData.giorni_smontaggio_viaggio *
      formData.ore_lavoro_cantxper_smon;
    const totCostKmSmon = formData.km_AR_smon * costMontXkm;
    const numVittiSmon = 2 * formData.personale_smon * formData.giorni_smontaggio_viaggio;
    const numAlloggiSmon =
      formData.giorni_smontaggio_viaggio === 1
        ? 0
        : (formData.giorni_smontaggio_viaggio - 1) * formData.personale_smon;
    const totCostVittAllSmon = numVittiSmon * costoPasto + numAlloggiSmon * costoAlloggio;
    const totCostoVoloARSmon =
      formData.volo_smon !== 'NO' ? getFlightCost(formData.volo_smon) * formData.personale_smon : 0;
    const totCostoTrenoSmon = formData.treno_smon
      ? formData.km_AR_smon * costoKmTreno * formData.personale_smon
      : 0;
    const totCostoTrasfPersSmon =
      formData.personale_smon * formData.ore_viaggio_trasferta_smon * formData.costo_orario_smon;
    const totCostiAutoSmon = formData.viaggio_auto_com_smon ? formData.km_AR_smon * costoKmAuto : 0;
    const totCostiExtraTrasfSmon =
      formData.extra_costi_trasferta_smon !== 'NO'
        ? getExtraCost(formData.extra_costi_trasferta_smon) *
          formData.giorni_smontaggio_viaggio *
          formData.personale_smon
        : 0;
    const totCostiExtraKmTraspFurgSmon = formData.extra_km_trasp_furg_smon * costoFurgXKm;
    const totCostiExtraKmTraspTirSmon = formData.extra_km_trasp_tir_smon * costoTirXKm;
    const totaleCostoSmontaggio =
      totCostOreSmon +
      totCostKmSmon +
      totCostVittAllSmon +
      totCostoVoloARSmon +
      totCostoTrenoSmon +
      totCostoTrasfPersSmon +
      totCostiAutoSmon +
      totCostiExtraTrasfSmon +
      totCostiExtraKmTraspFurgSmon +
      totCostiExtraKmTraspTirSmon;
    const preventivoSmontaggio = totaleCostoSmontaggio * (1 + formData.ricarico_montaggio / 100);

    // Totale combinato
    const totaleCombinato = preventivoMontaggio + preventivoSmontaggio;

    return {
      // Montaggio
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
      // Smontaggio
      totCostOreSmon,
      totCostKmSmon,
      numVittiSmon,
      numAlloggiSmon,
      totCostVittAllSmon,
      totCostoVoloARSmon,
      totCostoTrenoSmon,
      totCostoTrasfPersSmon,
      totCostiAutoSmon,
      totCostiExtraTrasfSmon,
      totCostiExtraKmTraspFurgSmon,
      totCostiExtraKmTraspTirSmon,
      totaleCostoSmontaggio,
      preventivoSmontaggio,
      // Totale
      totaleCombinato,
    };
  };

  const costs = calculateCosts();

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ServizioData & { costs: any }) => {
      const payload = {
        preventivo_id: data.preventivo_id,
        montaggio_smontaggio: true,
        // Montaggio fields
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
        // Smontaggio fields
        personale_smon: data.personale_smon,
        costo_orario_smon: data.costo_orario_smon,
        giorni_smontaggio_viaggio: data.giorni_smontaggio_viaggio,
        ore_lavoro_cantxper_smon: data.ore_lavoro_cantxper_smon,
        km_ar_smon: data.km_AR_smon,
        volo_smon: data.volo_smon,
        treno_smon: data.treno_smon,
        ore_viaggio_trasferta_smon: data.ore_viaggio_trasferta_smon,
        viaggio_auto_com_smon: data.viaggio_auto_com_smon,
        extra_costi_trasferta_smon: data.extra_costi_trasferta_smon,
        extra_km_trasp_furg_smon: data.extra_km_trasp_furg_smon,
        extra_km_trasp_tir_smon: data.extra_km_trasp_tir_smon,
        // Montaggio calculated fields
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
        // Smontaggio calculated fields
        tot_cost_ore_smon: data.costs.totCostOreSmon,
        tot_cost_km_smon: data.costs.totCostKmSmon,
        num_vitti_smon: data.costs.numVittiSmon,
        num_alloggi_smon: data.costs.numAlloggiSmon,
        tot_cost_vittall_smon: data.costs.totCostVittAllSmon,
        tot_costo_volo_ar_smon: data.costs.totCostoVoloARSmon,
        tot_costo_treno_smon: data.costs.totCostoTrenoSmon,
        tot_costo_trasf_pers_smon: data.costs.totCostoTrasfPersSmon,
        tot_costi_auto_smon: data.costs.totCostiAutoSmon,
        tot_costi_extra_trasf_smon: data.costs.totCostiExtraTrasfSmon,
        tot_costi_extra_km_trasp_furg_smon: data.costs.totCostiExtraKmTraspFurgSmon,
        tot_costi_extra_km_trasp_tir_smon: data.costs.totCostiExtraKmTraspTirSmon,
        totale_costo_smontaggio: data.costs.totaleCostoSmontaggio,
        preventivo_smontaggio: data.costs.preventivoSmontaggio,
      };

      // Save to preventivi_servizi table
      if (data.id) {
        const { error } = await supabase.from('preventivi_servizi').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('preventivi_servizi').insert(payload);
        if (error) throw error;
      }

      // Update the main preventivi table to mark service as selected
      const { error: preventivoError } = await supabase
        .from('preventivi')
        .update({ servizio_montaggio_smontaggio: true })
        .eq('id', data.preventivo_id);

      if (preventivoError) throw preventivoError;
    },
    onSuccess: () => {
      toast.success('Servizio montaggio e smontaggio salvato con successo');
      queryClient.invalidateQueries({
        queryKey: ['preventivi_servizi'],
      });
      navigate(`/preventivi/${preventivo_id}/edit`);
    },
    onError: (error) => {
      toast.error('Errore nel salvataggio: ' + error.message);
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      ...formData,
      costs,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(`/preventivi/${preventivo_id}/edit`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            ← Torna al preventivo {preventivoInfo?.numero_preventivo}
          </Button>
          <div className="text-right">
            <h2 className="text-sm text-muted-foreground">Preventivo N. {preventivoInfo?.numero_preventivo}</h2>
            <p className="font-medium">{(preventivoInfo?.prospects as any)?.ragione_sociale || preventivoInfo?.titolo}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8">Servizi di Montaggio e Smontaggio</h1>

        {/* MONTAGGIO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Servizio di Montaggio - Dati ingresso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personale_mont">Personale</Label>
                  <Input
                    id="personale_mont"
                    type="number"
                    value={formData.personale_mont}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personale_mont: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="costo_orario_mont">Costo orario personale</Label>
                  <Input
                    id="costo_orario_mont"
                    type="number"
                    value={formData.costo_orario_mont}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costo_orario_mont: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="giorni_montaggio">Giorni per il montaggio + viaggio</Label>
                  <Input
                    id="giorni_montaggio"
                    type="number"
                    value={formData.giorni_montaggio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        giorni_montaggio: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ore_lavoro_cantxper_mont">Ore montaggio in cantiere per persona</Label>
                  <Input
                    id="ore_lavoro_cantxper_mont"
                    type="number"
                    value={formData.ore_lavoro_cantxper_mont}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ore_lavoro_cantxper_mont: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="km_AR_mont" className="text-left">
                  Km Viaggio montaggio A+R
                </Label>
                <Input
                  id="km_AR_mont"
                  type="number"
                  value={formData.km_AR_mont}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      km_AR_mont: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-32 text-right"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="conseg_cant"
                  checked={formData.conseg_cant}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      conseg_cant: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="conseg_cant">Consegna cantiere (SI/NO)</Label>
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="volo_mont" className="text-left">
                  Volo
                </Label>
                <Select
                  value={formData.volo_mont}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      volo_mont: value,
                    })
                  }
                >
                  <SelectTrigger className="w-32">
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
                  id="treno_mont"
                  checked={formData.treno_mont}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      treno_mont: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="treno_mont">Treno</Label>
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="ore_viaggio_trasferta_mont" className="text-left">
                  Ore viaggio trasferta montatori (treno/aereo, no camion)
                </Label>
                <Input
                  id="ore_viaggio_trasferta_mont"
                  type="number"
                  value={formData.ore_viaggio_trasferta_mont}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ore_viaggio_trasferta_mont: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-32 text-right"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viaggio_auto_com_mont"
                  checked={formData.viaggio_auto_com_mont}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      viaggio_auto_com_mont: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="viaggio_auto_com_mont">Viaggio Auto commerciale</Label>
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="extra_costi_trasferta_mont" className="text-left">
                  Extra (park,metro, taxi, materiali di consumo)
                </Label>
                <Select
                  value={formData.extra_costi_trasferta_mont}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      extra_costi_trasferta_mont: value,
                    })
                  }
                >
                  <SelectTrigger className="w-32">
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
                  <Label htmlFor="extra_km_trasp_furg_mont">Km. extra Trasporto Furgone &lt; 35 q.li</Label>
                  <Input
                    id="extra_km_trasp_furg_mont"
                    type="number"
                    value={formData.extra_km_trasp_furg_mont}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        extra_km_trasp_furg_mont: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="extra_km_trasp_tir_mont">Km. extra trasporto camion &gt; 35 q.li</Label>
                  <Input
                    id="extra_km_trasp_tir_mont"
                    type="number"
                    value={formData.extra_km_trasp_tir_mont}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        extra_km_trasp_tir_mont: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calcolo costi Montaggio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Costo ore montatori</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostOreMont?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo km montaggio</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostKmMont?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Numero dei pasti previsti</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{costs.numVitti || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Numero dei pernottamenti previsti</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{costs.numAlloggi || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo vitto e alloggio montatori</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostVittAll?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo volo aereo A/R</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoVoloAR?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo treno A/R</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoTreno?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo di trasferta del personale</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoTrasfPers?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo viaggio in auto</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiAuto?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi extra (park,metro, taxi, materiali di consumo)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraTrasfMont?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi trasporto legati ad utilizzo di mezzo leggero (&lt;35q.li)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraKmTraspFurgMont?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi trasporto legati ad utilizzo di mezzo pesante (&gt;35q.li)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraKmTraspTirMont?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi per consegna merce in cantiere</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiConsegnaCantiere?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Totale costo montaggio</span>
                  <span className="font-bold text-lg">€ {costs.totaleCostoMontaggio?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="ricarico_montaggio">Ricarico</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="ricarico_montaggio"
                      type="number"
                      value={formData.ricarico_montaggio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ricarico_montaggio: parseFloat(e.target.value) || 0,
                        })
                      }
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

        {/* SMONTAGGIO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Servizio di Smontaggio - Dati ingresso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personale_smon">Personale</Label>
                  <Input
                    id="personale_smon"
                    type="number"
                    value={formData.personale_smon}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personale_smon: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="costo_orario_smon">Costo orario personale</Label>
                  <Input
                    id="costo_orario_smon"
                    type="number"
                    value={formData.costo_orario_smon}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costo_orario_smon: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="giorni_smontaggio_viaggio">Giorni per lo smontaggio + viaggio</Label>
                  <Input
                    id="giorni_smontaggio_viaggio"
                    type="number"
                    value={formData.giorni_smontaggio_viaggio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        giorni_smontaggio_viaggio: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ore_lavoro_cantxper_smon">Ore smontaggio in cantiere per persona</Label>
                  <Input
                    id="ore_lavoro_cantxper_smon"
                    type="number"
                    value={formData.ore_lavoro_cantxper_smon}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ore_lavoro_cantxper_smon: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="km_AR_smon" className="text-left">
                  Km Viaggio smontaggio A+R
                </Label>
                <Input
                  id="km_AR_smon"
                  type="number"
                  value={formData.km_AR_smon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      km_AR_smon: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-32 text-right"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="volo_smon" className="text-left">
                  Volo
                </Label>
                <Select
                  value={formData.volo_smon}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      volo_smon: value,
                    })
                  }
                >
                  <SelectTrigger className="w-32">
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
                  id="treno_smon"
                  checked={formData.treno_smon}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      treno_smon: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="treno_smon">Treno</Label>
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="ore_viaggio_trasferta_smon" className="text-left">
                  Ore viaggio trasferta smontatori (treno/aereo, no camion)
                </Label>
                <Input
                  id="ore_viaggio_trasferta_smon"
                  type="number"
                  value={formData.ore_viaggio_trasferta_smon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ore_viaggio_trasferta_smon: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-32 text-right"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viaggio_auto_com_smon"
                  checked={formData.viaggio_auto_com_smon}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      viaggio_auto_com_smon: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="viaggio_auto_com_smon">Viaggio Auto commerciale</Label>
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="extra_costi_trasferta_smon" className="text-left">
                  Extra (park,metro, taxi, materiali di consumo)
                </Label>
                <Select
                  value={formData.extra_costi_trasferta_smon}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      extra_costi_trasferta_smon: value,
                    })
                  }
                >
                  <SelectTrigger className="w-32">
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
                  <Label htmlFor="extra_km_trasp_furg_smon">Km. extra Trasporto Furgone &lt; 35 q.li</Label>
                  <Input
                    id="extra_km_trasp_furg_smon"
                    type="number"
                    value={formData.extra_km_trasp_furg_smon}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        extra_km_trasp_furg_smon: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="extra_km_trasp_tir_smon">Km. extra trasporto camion &gt; 35 q.li</Label>
                  <Input
                    id="extra_km_trasp_tir_smon"
                    type="number"
                    value={formData.extra_km_trasp_tir_smon}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        extra_km_trasp_tir_smon: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calcolo costi Smontaggio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Costo ore smontatori</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostOreSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo km smontaggio</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostKmSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Numero dei pasti previsti</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{costs.numVittiSmon || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Numero dei pernottamenti previsti</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{costs.numAlloggiSmon || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo vitto e alloggio smontatori</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostVittAllSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo volo aereo A/R</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoVoloARSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo treno A/R</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoTrenoSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo di trasferta del personale</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostoTrasfPersSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costo viaggio in auto</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiAutoSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi extra (park,metro, taxi, materiali di consumo)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraTrasfSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi trasporto legati ad utilizzo di mezzo leggero (&lt;35q.li)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraKmTraspFurgSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costi trasporto legati ad utilizzo di mezzo pesante (&gt;35q.li)</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">€ {costs.totCostiExtraKmTraspTirSmon?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Totale costo smontaggio</span>
                  <span className="font-bold text-lg">€ {costs.totaleCostoSmontaggio?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Preventivo Smontaggio</span>
                  <span>€ {costs.preventivoSmontaggio?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TOTAL COMBINED */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Totale preventivo montaggio/smontaggio</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-primary">{costs.totaleCombinato?.toFixed(2) || '0.00'}€</div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={handleSave} disabled={saveMutation.isPending} size="lg">
            {saveMutation.isPending ? 'Salvataggio...' : 'Salva Configurazione'}
          </Button>
        </div>
      </div>
    </div>
  );
}
