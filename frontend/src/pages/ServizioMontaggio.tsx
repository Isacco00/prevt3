import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {toast} from 'sonner';
import {ArrowLeft} from 'lucide-react';
import {CostoExtraTrasfMontBean, CostoVoloArBean, PreventivoServiziBean} from "@/types/parametri.ts";
import {ParametriAPI} from "@/api/parametri.ts";
import {PreventiviAPI} from "@/api/preventivi.ts";

const DEFAULT_FORM: PreventivoServiziBean = {
  personaleMont: 0,
  costoOrarioMont: 20,
  giorniMontaggio: 0,
  oreLavoroCantxperMont: 0,
  kmArMont: 0,
  consegCant: false,
  voloMont: 'NO',
  trenoMont: false,
  oreViaggioTrasfertaMont: 0,
  viaggioAutoComMont: false,
  extraCostiTrasfertaMont: 'NO',
  extraKmTraspFurgMont: 0,
  extraKmTraspTirMont: 0,
  ricaricoMontaggio: 30,
  personaleSmon: 0,
  costoOrarioSmon: 20,
  giorniSmontaggioViaggio: 0,
  oreLavoroCantxperSmon: 0,
  kmArSmon: 0,
  voloSmon: 'NO',
  trenoSmon: false,
  oreViaggioTrasfertaSmon: 0,
  viaggioAutoComSmon: false,
  extraCostiTrasfertaSmon: 'NO',
  extraKmTraspFurgSmon: 0,
  extraKmTraspTirSmon: 0,
};

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function ServizioMontaggio() {
  const {preventivoId} = useParams<{ preventivoId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PreventivoServiziBean>({
    ...DEFAULT_FORM,
    preventivoId,
  });

  const {data: servizioData} = useQuery<PreventivoServiziBean | null>({
    queryKey: ['preventivo-servizi', preventivoId],
    queryFn: () => ParametriAPI.getPreventivoServiziByPreventivoId({preventivoId}),
    enabled: !!preventivoId,
  });

  const {data: preventivoInfo} = useQuery({
    queryKey: ['preventivo-info', preventivoId],
    queryFn: () => PreventiviAPI.getPreventivoDetail(preventivoId!),
    enabled: !!preventivoId,
  });

  const {data: parametri = []} = useQuery({
    queryKey: ['parametri-costi-unitari'],
    queryFn: () => ParametriAPI.getParametriACostiUnitari({
      attivo: true,
      sortFields: [{field: "PARAMETRI_COSTI_UNITARI_PARAMETRO", desc: false}]
    })
  });

  const {data: costiVolo = []} = useQuery<CostoVoloArBean[]>({
    queryKey: ['costi-volo-ar'],
    queryFn: () => ParametriAPI.getCostiVoloAr({attivo: true}),
  });

  const {data: costiExtra = []} = useQuery<CostoExtraTrasfMontBean[]>({
    queryKey: ['costi-extra-trasf-mont'],
    queryFn: () => ParametriAPI.getCostiExtraTrasfMont({attivo: true}),
  });

  useEffect(() => {
    if (servizioData) {
      setFormData({
        ...DEFAULT_FORM,
        ...servizioData,
        preventivoId: servizioData.preventivoId ?? preventivoId,
      });
    }
  }, [servizioData, preventivoId]);

  const costs = useMemo(() => {
    const getParam = (name: string) => {
      const p = parametri.find(x => x.parametro === name);
      return p ? num(p.valore) : 0;
    };
    const getFlight = (tipo: string) => {
      const v = costiVolo.find(x => x.tipologia === tipo);
      return v ? num(v.costoVoloAr) : 0;
    };
    const getExtra = (livello: string) => {
      const e = costiExtra.find(x => x.livello === livello);
      return e ? num(e.costoExtraMont) : 0;
    };

    const costMontXkm = getParam('Costo montatori xkm');
    const costoPasto = getParam('Costo pasto');
    const costoAlloggio = getParam('Costo alloggio');
    const costoKmTreno = getParam('Costo treno al km');
    const costoKmAuto = getParam('Costo auto al km');
    const costoFissoConsegna = getParam('Costo fisso consegna');
    const costoFurgXKm = getParam('Costo furgone al km');
    const costoTirXKm = getParam('Costo TIR al km');

    const personaleMont = num(formData.personaleMont);
    const costoOrarioMont = num(formData.costoOrarioMont);
    const giorniMontaggio = num(formData.giorniMontaggio);
    const oreLavoroMont = num(formData.oreLavoroCantxperMont);
    const kmArMont = num(formData.kmArMont);
    const oreViaggioMont = num(formData.oreViaggioTrasfertaMont);
    const extraKmFurgMont = num(formData.extraKmTraspFurgMont);
    const extraKmTirMont = num(formData.extraKmTraspTirMont);
    const ricarico = num(formData.ricaricoMontaggio);

    const totCostOreMont = personaleMont * costoOrarioMont * giorniMontaggio * oreLavoroMont;
    const totCostKmMont = kmArMont * costMontXkm;
    const numVitti = 2 * personaleMont * giorniMontaggio;
    const numAlloggi = giorniMontaggio <= 1 ? 0 : (giorniMontaggio - 1) * personaleMont;
    const totCostVittAll = numVitti * costoPasto + numAlloggi * costoAlloggio;
    const totCostoVoloAR = formData.voloMont && formData.voloMont !== 'NO'
      ? getFlight(formData.voloMont) * personaleMont : 0;
    const totCostoTreno = formData.trenoMont ? kmArMont * costoKmTreno * personaleMont : 0;
    const totCostoTrasfPers = personaleMont * oreViaggioMont * costoOrarioMont;
    const totCostiAuto = formData.viaggioAutoComMont ? kmArMont * costoKmAuto : 0;
    const totCostiExtraTrasfMont = formData.extraCostiTrasfertaMont && formData.extraCostiTrasfertaMont !== 'NO'
      ? getExtra(formData.extraCostiTrasfertaMont) * giorniMontaggio * personaleMont : 0;
    const totCostiExtraKmTraspFurgMont = extraKmFurgMont * costoFurgXKm;
    const totCostiExtraKmTraspTirMont = extraKmTirMont * costoTirXKm;
    const totCostiConsegnaCantiere = formData.consegCant ? costoFissoConsegna : 0;
    const totaleCostoMontaggio = totCostOreMont + totCostKmMont + totCostVittAll + totCostoVoloAR
      + totCostoTreno + totCostoTrasfPers + totCostiAuto + totCostiExtraTrasfMont
      + totCostiExtraKmTraspFurgMont + totCostiExtraKmTraspTirMont + totCostiConsegnaCantiere;
    const preventivoMontaggio = totaleCostoMontaggio * (1 + ricarico / 100);

    const personaleSmon = num(formData.personaleSmon);
    const costoOrarioSmon = num(formData.costoOrarioSmon);
    const giorniSmon = num(formData.giorniSmontaggioViaggio);
    const oreLavoroSmon = num(formData.oreLavoroCantxperSmon);
    const kmArSmon = num(formData.kmArSmon);
    const oreViaggioSmon = num(formData.oreViaggioTrasfertaSmon);
    const extraKmFurgSmon = num(formData.extraKmTraspFurgSmon);
    const extraKmTirSmon = num(formData.extraKmTraspTirSmon);

    const totCostOreSmon = personaleSmon * costoOrarioSmon * giorniSmon * oreLavoroSmon;
    const totCostKmSmon = kmArSmon * costMontXkm;
    const numVittiSmon = 2 * personaleSmon * giorniSmon;
    const numAlloggiSmon = giorniSmon <= 1 ? 0 : (giorniSmon - 1) * personaleSmon;
    const totCostVittAllSmon = numVittiSmon * costoPasto + numAlloggiSmon * costoAlloggio;
    const totCostoVoloARSmon = formData.voloSmon && formData.voloSmon !== 'NO'
      ? getFlight(formData.voloSmon) * personaleSmon : 0;
    const totCostoTrenoSmon = formData.trenoSmon ? kmArSmon * costoKmTreno * personaleSmon : 0;
    const totCostoTrasfPersSmon = personaleSmon * oreViaggioSmon * costoOrarioSmon;
    const totCostiAutoSmon = formData.viaggioAutoComSmon ? kmArSmon * costoKmAuto : 0;
    const totCostiExtraTrasfSmon = formData.extraCostiTrasfertaSmon && formData.extraCostiTrasfertaSmon !== 'NO'
      ? getExtra(formData.extraCostiTrasfertaSmon) * giorniSmon * personaleSmon : 0;
    const totCostiExtraKmTraspFurgSmon = extraKmFurgSmon * costoFurgXKm;
    const totCostiExtraKmTraspTirSmon = extraKmTirSmon * costoTirXKm;
    const totaleCostoSmontaggio = totCostOreSmon + totCostKmSmon + totCostVittAllSmon
      + totCostoVoloARSmon + totCostoTrenoSmon + totCostoTrasfPersSmon + totCostiAutoSmon
      + totCostiExtraTrasfSmon + totCostiExtraKmTraspFurgSmon + totCostiExtraKmTraspTirSmon;
    const preventivoSmontaggio = totaleCostoSmontaggio * (1 + ricarico / 100);

    return {
      totCostOreMont, totCostKmMont, numVitti, numAlloggi, totCostVittAll,
      totCostoVoloAR, totCostoTreno, totCostoTrasfPers, totCostiAuto,
      totCostiExtraTrasfMont, totCostiExtraKmTraspFurgMont, totCostiExtraKmTraspTirMont,
      totCostiConsegnaCantiere, totaleCostoMontaggio, preventivoMontaggio,
      totCostOreSmon, totCostKmSmon, numVittiSmon, numAlloggiSmon, totCostVittAllSmon,
      totCostoVoloARSmon, totCostoTrenoSmon, totCostoTrasfPersSmon, totCostiAutoSmon,
      totCostiExtraTrasfSmon, totCostiExtraKmTraspFurgSmon, totCostiExtraKmTraspTirSmon,
      totaleCostoSmontaggio, preventivoSmontaggio,
      totaleCombinato: preventivoMontaggio + preventivoSmontaggio,
    };
  }, [formData, parametri, costiVolo, costiExtra]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: PreventivoServiziBean = {
        ...formData,
        preventivoId,
        montaggioSmontaggio: true,
        totCostOreMont: costs.totCostOreMont,
        totCostKmMont: costs.totCostKmMont,
        numVitti: costs.numVitti,
        numAlloggi: costs.numAlloggi,
        totCostVittall: costs.totCostVittAll,
        totCostoVoloAr: costs.totCostoVoloAR,
        totCostoTreno: costs.totCostoTreno,
        totCostoTrasfPers: costs.totCostoTrasfPers,
        totCostiAuto: costs.totCostiAuto,
        totCostiExtraTrasfMont: costs.totCostiExtraTrasfMont,
        totCostiExtraKmTraspFurgMont: costs.totCostiExtraKmTraspFurgMont,
        totCostiExtraKmTraspTirMont: costs.totCostiExtraKmTraspTirMont,
        totCostiConsegnaCantiere: costs.totCostiConsegnaCantiere,
        totaleCostoMontaggio: costs.totaleCostoMontaggio,
        preventivoMontaggio: costs.preventivoMontaggio,
        totCostOreSmon: costs.totCostOreSmon,
        totCostKmSmon: costs.totCostKmSmon,
        numVittiSmon: costs.numVittiSmon,
        numAlloggiSmon: costs.numAlloggiSmon,
        totCostVittallSmon: costs.totCostVittAllSmon,
        totCostoVoloArSmon: costs.totCostoVoloARSmon,
        totCostoTrenoSmon: costs.totCostoTrenoSmon,
        totCostoTrasfPersSmon: costs.totCostoTrasfPersSmon,
        totCostiAutoSmon: costs.totCostiAutoSmon,
        totCostiExtraTrasfSmon: costs.totCostiExtraTrasfSmon,
        totCostiExtraKmTraspFurgSmon: costs.totCostiExtraKmTraspFurgSmon,
        totCostiExtraKmTraspTirSmon: costs.totCostiExtraKmTraspTirSmon,
        totaleCostoSmontaggio: costs.totaleCostoSmontaggio,
        preventivoSmontaggio: costs.preventivoSmontaggio,
      };
      return ParametriAPI.savePreventivoServizi(payload);
    },
    onSuccess: () => {
      toast.success('Servizio montaggio e smontaggio salvato con successo');
      queryClient.invalidateQueries({queryKey: ['preventivo-servizi', preventivoId]});
    },
    onError: (error: Error) => {
      toast.error('Errore nel salvataggio: ' + error.message);
    },
  });

  const update = <K extends keyof PreventivoServiziBean>(key: K, value: PreventivoServiziBean[K]) =>
    setFormData(prev => ({...prev, [key]: value}));

  const fmt = (n?: number) => (n ?? 0).toFixed(2);

  const prospect = (preventivoInfo as unknown as { prospect?: { ragioneSociale?: string } } | undefined)?.prospect;

  return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/preventivi', {state: {openPreventivoId: preventivoId, focusSection: 'servizi'}})}>
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Torna al preventivo {preventivoInfo?.numeroPreventivo}
            </Button>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{preventivoInfo?.titolo}</div>
              <div className="text-xs text-muted-foreground">{prospect?.ragioneSociale}</div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-8">Servizi di Montaggio e Smontaggio</h1>

          {/* MONTAGGIO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader><CardTitle>Servizio di Montaggio - Dati ingresso</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Personale</Label>
                    <Input type="number" value={formData.personaleMont ?? 0}
                           onChange={e => update('personaleMont', parseInt(e.target.value) || 0)}/>
                  </div>
                  <div>
                    <Label>Costo orario personale</Label>
                    <Input type="number" value={formData.costoOrarioMont ?? 0}
                           onChange={e => update('costoOrarioMont', parseFloat(e.target.value) || 0)}/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Giorni per il montaggio + viaggio</Label>
                    <Input type="number" value={formData.giorniMontaggio ?? 0}
                           onChange={e => update('giorniMontaggio', parseInt(e.target.value) || 0)}/>
                  </div>
                  <div>
                    <Label>Ore montaggio in cantiere per persona</Label>
                    <Input type="number" value={formData.oreLavoroCantxperMont ?? 0}
                           onChange={e => update('oreLavoroCantxperMont', parseFloat(e.target.value) || 0)}/>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Km Viaggio montaggio A+R</Label>
                  <Input type="number" value={formData.kmArMont ?? 0}
                         onChange={e => update('kmArMont', parseFloat(e.target.value) || 0)}
                         className="w-32 text-right"/>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.consegCant ?? false}
                            onCheckedChange={v => update('consegCant', Boolean(v))}/>
                  <Label>Consegna cantiere (SI/NO)</Label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Volo</Label>
                  <Select value={formData.voloMont ?? 'NO'} onValueChange={v => update('voloMont', v)}>
                    <SelectTrigger className="w-32"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NO">NO</SelectItem>
                      <SelectItem value="Low cost">Low cost</SelectItem>
                      <SelectItem value="Last minute">Last minute</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.trenoMont ?? false}
                            onCheckedChange={v => update('trenoMont', Boolean(v))}/>
                  <Label>Treno</Label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Ore viaggio trasferta montatori (treno/aereo, no camion)</Label>
                  <Input type="number" value={formData.oreViaggioTrasfertaMont ?? 0}
                         onChange={e => update('oreViaggioTrasfertaMont', parseFloat(e.target.value) || 0)}
                         className="w-32 text-right"/>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.viaggioAutoComMont ?? false}
                            onCheckedChange={v => update('viaggioAutoComMont', Boolean(v))}/>
                  <Label>Viaggio Auto commerciale</Label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Extra (park,metro, taxi, materiali di consumo)</Label>
                  <Select value={formData.extraCostiTrasfertaMont ?? 'NO'}
                          onValueChange={v => update('extraCostiTrasfertaMont', v)}>
                    <SelectTrigger className="w-32"><SelectValue/></SelectTrigger>
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
                    <Label>Km. extra Trasporto Furgone &lt; 35 q.li</Label>
                    <Input type="number" value={formData.extraKmTraspFurgMont ?? 0}
                           onChange={e => update('extraKmTraspFurgMont', parseFloat(e.target.value) || 0)}/>
                  </div>
                  <div>
                    <Label>Km. extra trasporto camion &gt; 35 q.li</Label>
                    <Input type="number" value={formData.extraKmTraspTirMont ?? 0}
                           onChange={e => update('extraKmTraspTirMont', parseFloat(e.target.value) || 0)}/>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Calcolo costi Montaggio</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Row label="Costo ore montatori" value={`€ ${fmt(costs.totCostOreMont)}`}/>
                  <Row label="Costo km montaggio" value={`€ ${fmt(costs.totCostKmMont)}`}/>
                  <Row label="Numero dei pasti previsti" value={costs.numVitti}/>
                  <Row label="Numero dei pernottamenti previsti" value={costs.numAlloggi}/>
                  <Row label="Costo vitto e alloggio montatori" value={`€ ${fmt(costs.totCostVittAll)}`}/>
                  <Row label="Costo volo aereo A/R" value={`€ ${fmt(costs.totCostoVoloAR)}`}/>
                  <Row label="Costo treno A/R" value={`€ ${fmt(costs.totCostoTreno)}`}/>
                  <Row label="Costo di trasferta del personale" value={`€ ${fmt(costs.totCostoTrasfPers)}`}/>
                  <Row label="Costo viaggio in auto" value={`€ ${fmt(costs.totCostiAuto)}`}/>
                  <Row label="Costi extra (park,metro, taxi, materiali di consumo)" value={`€ ${fmt(costs.totCostiExtraTrasfMont)}`}/>
                  <Row label="Costi trasporto legati ad utilizzo di mezzo leggero (<35q.li)" value={`€ ${fmt(costs.totCostiExtraKmTraspFurgMont)}`}/>
                  <Row label="Costi trasporto legati ad utilizzo di mezzo pesante (>35q.li)" value={`€ ${fmt(costs.totCostiExtraKmTraspTirMont)}`}/>
                  <Row label="Costi per consegna merce in cantiere" value={`€ ${fmt(costs.totCostiConsegnaCantiere)}`}/>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Totale costo montaggio</span>
                    <span className="font-bold text-lg">€ {fmt(costs.totaleCostoMontaggio)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Label>Ricarico</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={formData.ricaricoMontaggio ?? 0}
                             onChange={e => update('ricaricoMontaggio', parseFloat(e.target.value) || 0)}
                             className="w-20 text-right"/>
                      <span>%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Preventivo Montaggio</span>
                    <span>€ {fmt(costs.preventivoMontaggio)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SMONTAGGIO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader><CardTitle>Servizio di Smontaggio - Dati ingresso</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Personale</Label>
                    <Input type="number" value={formData.personaleSmon ?? 0}
                           onChange={e => update('personaleSmon', parseInt(e.target.value) || 0)}/>
                  </div>
                  <div>
                    <Label>Costo orario personale</Label>
                    <Input type="number" value={formData.costoOrarioSmon ?? 0}
                           onChange={e => update('costoOrarioSmon', parseFloat(e.target.value) || 0)}/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Giorni per lo smontaggio + viaggio</Label>
                    <Input type="number" value={formData.giorniSmontaggioViaggio ?? 0}
                           onChange={e => update('giorniSmontaggioViaggio', parseInt(e.target.value) || 0)}/>
                  </div>
                  <div>
                    <Label>Ore smontaggio in cantiere per persona</Label>
                    <Input type="number" value={formData.oreLavoroCantxperSmon ?? 0}
                           onChange={e => update('oreLavoroCantxperSmon', parseFloat(e.target.value) || 0)}/>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Km Viaggio smontaggio A+R</Label>
                  <Input type="number" value={formData.kmArSmon ?? 0}
                         onChange={e => update('kmArSmon', parseFloat(e.target.value) || 0)}
                         className="w-32 text-right"/>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Volo</Label>
                  <Select value={formData.voloSmon ?? 'NO'} onValueChange={v => update('voloSmon', v)}>
                    <SelectTrigger className="w-32"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NO">NO</SelectItem>
                      <SelectItem value="Low cost">Low cost</SelectItem>
                      <SelectItem value="Last minute">Last minute</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.trenoSmon ?? false}
                            onCheckedChange={v => update('trenoSmon', Boolean(v))}/>
                  <Label>Treno</Label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Ore viaggio trasferta smontatori (treno/aereo, no camion)</Label>
                  <Input type="number" value={formData.oreViaggioTrasfertaSmon ?? 0}
                         onChange={e => update('oreViaggioTrasfertaSmon', parseFloat(e.target.value) || 0)}
                         className="w-32 text-right"/>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={formData.viaggioAutoComSmon ?? false}
                            onCheckedChange={v => update('viaggioAutoComSmon', Boolean(v))}/>
                  <Label>Viaggio Auto commerciale</Label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Extra (park,metro, taxi, materiali di consumo)</Label>
                  <Select value={formData.extraCostiTrasfertaSmon ?? 'NO'}
                          onValueChange={v => update('extraCostiTrasfertaSmon', v)}>
                    <SelectTrigger className="w-32"><SelectValue/></SelectTrigger>
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
                    <Label>Km. extra Trasporto Furgone &lt; 35 q.li</Label>
                    <Input type="number" value={formData.extraKmTraspFurgSmon ?? 0}
                           onChange={e => update('extraKmTraspFurgSmon', parseFloat(e.target.value) || 0)}/>
                  </div>
                  <div>
                    <Label>Km. extra trasporto camion &gt; 35 q.li</Label>
                    <Input type="number" value={formData.extraKmTraspTirSmon ?? 0}
                           onChange={e => update('extraKmTraspTirSmon', parseFloat(e.target.value) || 0)}/>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Calcolo costi Smontaggio</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Row label="Costo ore smontatori" value={`€ ${fmt(costs.totCostOreSmon)}`}/>
                  <Row label="Costo km smontaggio" value={`€ ${fmt(costs.totCostKmSmon)}`}/>
                  <Row label="Numero dei pasti previsti" value={costs.numVittiSmon}/>
                  <Row label="Numero dei pernottamenti previsti" value={costs.numAlloggiSmon}/>
                  <Row label="Costo vitto e alloggio smontatori" value={`€ ${fmt(costs.totCostVittAllSmon)}`}/>
                  <Row label="Costo volo aereo A/R" value={`€ ${fmt(costs.totCostoVoloARSmon)}`}/>
                  <Row label="Costo treno A/R" value={`€ ${fmt(costs.totCostoTrenoSmon)}`}/>
                  <Row label="Costo di trasferta del personale" value={`€ ${fmt(costs.totCostoTrasfPersSmon)}`}/>
                  <Row label="Costo viaggio in auto" value={`€ ${fmt(costs.totCostiAutoSmon)}`}/>
                  <Row label="Costi extra (park,metro, taxi, materiali di consumo)" value={`€ ${fmt(costs.totCostiExtraTrasfSmon)}`}/>
                  <Row label="Costi trasporto legati ad utilizzo di mezzo leggero (<35q.li)" value={`€ ${fmt(costs.totCostiExtraKmTraspFurgSmon)}`}/>
                  <Row label="Costi trasporto legati ad utilizzo di mezzo pesante (>35q.li)" value={`€ ${fmt(costs.totCostiExtraKmTraspTirSmon)}`}/>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Totale costo smontaggio</span>
                    <span className="font-bold text-lg">€ {fmt(costs.totaleCostoSmontaggio)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Preventivo Smontaggio</span>
                    <span>€ {fmt(costs.preventivoSmontaggio)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between bg-muted/30 p-6 rounded-lg">
            <div className="flex-1">
              <div className="text-lg font-medium">Totale preventivo montaggio/smontaggio</div>
              <div className="text-3xl font-bold text-primary">{fmt(costs.totaleCombinato)}€</div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="lg"
                      onClick={() => navigate('/preventivi', {state: {openPreventivoId: preventivoId, focusSection: 'servizi'}})}>
                Annulla
              </Button>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="lg">
                {saveMutation.isPending ? 'Salvataggio...' : 'Salva Configurazione'}
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}

function Row({label, value}: { label: string; value: React.ReactNode }) {
  return (
      <div className="flex justify-between">
        <span className="text-sm">{label}</span>
        <div className="text-right">
          <span className="text-sm font-medium">{value}</span>
        </div>
      </div>
  );
}
