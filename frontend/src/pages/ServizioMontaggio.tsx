import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {toast} from 'sonner';
import {ArrowLeft, RotateCcw} from 'lucide-react';
import {CostoExtraTrasfMontBean, CostoVoloArBean, PreventivoServiziBean} from "@/types/parametri.ts";
import {ParametriAPI} from "@/api/parametri.ts";
import {PreventiviAPI} from "@/api/preventivi.ts";

const DEFAULT_MONT: Partial<PreventivoServiziBean> = {
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
};

const DEFAULT_SMON: Partial<PreventivoServiziBean> = {
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

const DEFAULT_FORM: PreventivoServiziBean = {
  ...DEFAULT_MONT,
  ...DEFAULT_SMON,
  ricaricoMontaggio: 30,
  scontoMontaggio: 0,
};

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const fmt = (n?: number) => (n ?? 0).toFixed(2);

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

  const update = <K extends keyof PreventivoServiziBean>(key: K, value: PreventivoServiziBean[K]) =>
    setFormData(prev => ({...prev, [key]: value}));

  const resetMontaggio = () => setFormData(prev => ({...prev, ...DEFAULT_MONT}));
  const resetSmontaggio = () => setFormData(prev => ({...prev, ...DEFAULT_SMON}));

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

    const ricaricoPerc = num(formData.ricaricoMontaggio);
    const scontoPerc = num(formData.scontoMontaggio);
    const ricaricoFactor = 1 + ricaricoPerc / 100;
    const scontoFactor = 1 - scontoPerc / 100;

    // ---- MONTAGGIO ----
    const personaleMont = num(formData.personaleMont);
    const costoOrarioMont = num(formData.costoOrarioMont);
    const giorniMontaggio = num(formData.giorniMontaggio);
    const oreLavoroMont = num(formData.oreLavoroCantxperMont);
    const kmArMont = num(formData.kmArMont);
    const oreViaggioMont = num(formData.oreViaggioTrasfertaMont);
    const extraKmFurgMont = num(formData.extraKmTraspFurgMont);
    const extraKmTirMont = num(formData.extraKmTraspTirMont);

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

    const voiciMont = [
      {label: 'Costo ore montatori', costo: totCostOreMont},
      {label: 'Costo km montaggio', costo: totCostKmMont},
      {label: 'Costo vitto e alloggio montatori', costo: totCostVittAll},
      {label: 'Costo volo aereo A/R', costo: totCostoVoloAR},
      {label: 'Costo treno A/R', costo: totCostoTreno},
      {label: 'Costo di trasferta del personale', costo: totCostoTrasfPers},
      {label: 'Costo viaggio in auto', costo: totCostiAuto},
      {label: 'Costi extra (park, metro, taxi, materiali di consumo)', costo: totCostiExtraTrasfMont},
      {label: 'Costi trasporto legati ad utilizzo di mezzo leggero (<35 q.li)', costo: totCostiExtraKmTraspFurgMont},
      {label: 'Costi trasporto legati ad utilizzo di mezzo pesante (>35 q.li)', costo: totCostiExtraKmTraspTirMont},
      {label: 'Costi per consegna merce in cantiere', costo: totCostiConsegnaCantiere},
    ];
    const totaleCostoMontaggio = voiciMont.reduce((s, v) => s + v.costo, 0);
    const totalePrezzoListinoMont = totaleCostoMontaggio * ricaricoFactor;
    const totalePrezzoNettoMont = totalePrezzoListinoMont * scontoFactor;
    const margineMont = totalePrezzoNettoMont - totaleCostoMontaggio;
    const marginalitaMont = totalePrezzoNettoMont > 0 ? margineMont / totalePrezzoNettoMont * 100 : 0;

    // ---- SMONTAGGIO ----
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

    const voiciSmon = [
      {label: 'Costo ore smontatori', costo: totCostOreSmon},
      {label: 'Costo km smontaggio', costo: totCostKmSmon},
      {label: 'Costo vitto e alloggio smontatori', costo: totCostVittAllSmon},
      {label: 'Costo volo aereo A/R', costo: totCostoVoloARSmon},
      {label: 'Costo treno A/R', costo: totCostoTrenoSmon},
      {label: 'Costo di trasferta del personale', costo: totCostoTrasfPersSmon},
      {label: 'Costo viaggio in auto', costo: totCostiAutoSmon},
      {label: 'Costi extra (park, metro, taxi, materiali di consumo)', costo: totCostiExtraTrasfSmon},
      {label: 'Costi trasporto legati ad utilizzo di mezzo leggero (<35 q.li)', costo: totCostiExtraKmTraspFurgSmon},
      {label: 'Costi trasporto legati ad utilizzo di mezzo pesante (>35 q.li)', costo: totCostiExtraKmTraspTirSmon},
    ];
    const totaleCostoSmontaggio = voiciSmon.reduce((s, v) => s + v.costo, 0);
    const totalePrezzoListinoSmon = totaleCostoSmontaggio * ricaricoFactor;
    const totalePrezzoNettoSmon = totalePrezzoListinoSmon * scontoFactor;
    const margineSmon = totalePrezzoNettoSmon - totaleCostoSmontaggio;
    const marginalitaSmon = totalePrezzoNettoSmon > 0 ? margineSmon / totalePrezzoNettoSmon * 100 : 0;

    const totaleNettoCombinato = totalePrezzoNettoMont + totalePrezzoNettoSmon;

    return {
      voiciMont, voiciSmon,
      totCostOreMont, totCostKmMont, numVitti, numAlloggi, totCostVittAll,
      totCostoVoloAR, totCostoTreno, totCostoTrasfPers, totCostiAuto,
      totCostiExtraTrasfMont, totCostiExtraKmTraspFurgMont, totCostiExtraKmTraspTirMont,
      totCostiConsegnaCantiere,
      totaleCostoMontaggio, totalePrezzoListinoMont, totalePrezzoNettoMont, margineMont, marginalitaMont,
      totCostOreSmon, totCostKmSmon, numVittiSmon, numAlloggiSmon, totCostVittAllSmon,
      totCostoVoloARSmon, totCostoTrenoSmon, totCostoTrasfPersSmon, totCostiAutoSmon,
      totCostiExtraTrasfSmon, totCostiExtraKmTraspFurgSmon, totCostiExtraKmTraspTirSmon,
      totaleCostoSmontaggio, totalePrezzoListinoSmon, totalePrezzoNettoSmon, margineSmon, marginalitaSmon,
      ricaricoFactor,
      totaleNettoCombinato,
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
        preventivoMontaggio: costs.totalePrezzoNettoMont,
        totalePrezzoListinoMont: costs.totalePrezzoListinoMont,
        totalePrezzoNettoMont: costs.totalePrezzoNettoMont,
        margineMont: costs.margineMont,
        marginalitaMont: costs.marginalitaMont,
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
        preventivoSmontaggio: costs.totalePrezzoNettoSmon,
        totalePrezzoListinoSmon: costs.totalePrezzoListinoSmon,
        totalePrezzoNettoSmon: costs.totalePrezzoNettoSmon,
        margineSmon: costs.margineSmon,
        marginalitaSmon: costs.marginalitaSmon,
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

  const prospect = (preventivoInfo as unknown as { prospect?: { ragioneSociale?: string } } | undefined)?.prospect;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost"
                  onClick={() => navigate('/preventivi', {state: {openPreventivoId: preventivoId, focusSection: 'servizi'}})}>
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
        <SezioneServizio
          title="Montaggio"
          datiIngresso={
            <DatiIngressoMontaggio formData={formData} update={update} onReset={resetMontaggio}/>
          }
          calcoloCosti={
            <CalcoloCostiTabella
              titolo="Calcolo costi Montaggio"
              voci={costs.voiciMont}
              ricaricoFactor={costs.ricaricoFactor}
            />
          }
          specchietto={
            <Specchietto
              totaleCosti={costs.totaleCostoMontaggio}
              totalePrezzoListino={costs.totalePrezzoListinoMont}
              totalePrezzoNetto={costs.totalePrezzoNettoMont}
              margine={costs.margineMont}
              marginalita={costs.marginalitaMont}
              scontoPerc={num(formData.scontoMontaggio)}
              onScontoChange={v => update('scontoMontaggio', v)}
              scontoEditable
            />
          }
        />

        {/* SMONTAGGIO */}
        <SezioneServizio
          title="Smontaggio"
          datiIngresso={
            <DatiIngressoSmontaggio formData={formData} update={update} onReset={resetSmontaggio}/>
          }
          calcoloCosti={
            <CalcoloCostiTabella
              titolo="Calcolo costi Smontaggio"
              voci={costs.voiciSmon}
              ricaricoFactor={costs.ricaricoFactor}
            />
          }
          specchietto={
            <Specchietto
              totaleCosti={costs.totaleCostoSmontaggio}
              totalePrezzoListino={costs.totalePrezzoListinoSmon}
              totalePrezzoNetto={costs.totalePrezzoNettoSmon}
              margine={costs.margineSmon}
              marginalita={costs.marginalitaSmon}
              scontoPerc={num(formData.scontoMontaggio)}
              scontoEditable={false}
            />
          }
        />

        {/* Footer totale + azioni */}
        <Card className="mt-8">
          <CardContent className="flex items-center justify-between gap-4 py-6">
            <div>
              <div className="text-sm text-muted-foreground">Servizi di Montaggio/Smontaggio</div>
              <div className="text-sm text-muted-foreground">Totale Prezzo Netto</div>
              <div className="text-3xl font-bold text-primary">€{fmt(costs.totaleNettoCombinato)}</div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg"
                      onClick={() => navigate('/preventivi', {state: {openPreventivoId: preventivoId, focusSection: 'servizi'}})}>
                Annulla
              </Button>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="lg">
                {saveMutation.isPending ? 'Salvataggio...' : 'Salva Configurazione'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface SezioneServizioProps {
  title: string;
  datiIngresso: React.ReactNode;
  calcoloCosti: React.ReactNode;
  specchietto: React.ReactNode;
}

function SezioneServizio({title, datiIngresso, calcoloCosti, specchietto}: SezioneServizioProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">{datiIngresso}</div>
        <div className="lg:col-span-2 space-y-4">
          {calcoloCosti}
          {specchietto}
        </div>
      </div>
    </section>
  );
}

interface DatiIngressoProps {
  formData: PreventivoServiziBean;
  update: <K extends keyof PreventivoServiziBean>(key: K, value: PreventivoServiziBean[K]) => void;
  onReset: () => void;
}

function DatiIngressoMontaggio({formData, update, onReset}: DatiIngressoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Servizio di Montaggio - Dati ingresso</CardTitle>
      </CardHeader>
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
            <Label>Giorni montaggio + viaggio</Label>
            <Input type="number" value={formData.giorniMontaggio ?? 0}
                   onChange={e => update('giorniMontaggio', parseInt(e.target.value) || 0)}/>
          </div>
          <div>
            <Label>Ore lavoro montaggio in cantiere/persona</Label>
            <Input type="number" value={formData.oreLavoroCantxperMont ?? 0}
                   onChange={e => update('oreLavoroCantxperMont', parseFloat(e.target.value) || 0)}/>
          </div>
        </div>
        <div>
          <Label>Km Viaggio montaggio A+R</Label>
          <Input type="number" value={formData.kmArMont ?? 0}
                 onChange={e => update('kmArMont', parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox checked={formData.consegCant ?? false}
                    onCheckedChange={v => update('consegCant', Boolean(v))}/>
          <Label>Consegna cantiere</Label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label>Volo</Label>
          <Select value={formData.voloMont ?? 'NO'} onValueChange={v => update('voloMont', v)}>
            <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
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
        <div>
          <Label>Ore viaggio trasferta montatori (treno/aereo, no camion)</Label>
          <Input type="number" value={formData.oreViaggioTrasfertaMont ?? 0}
                 onChange={e => update('oreViaggioTrasfertaMont', parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox checked={formData.viaggioAutoComMont ?? false}
                    onCheckedChange={v => update('viaggioAutoComMont', Boolean(v))}/>
          <Label>Viaggio auto commerciale</Label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label>Extra (park, metro, taxi, …)</Label>
          <Select value={formData.extraCostiTrasfertaMont ?? 'NO'}
                  onValueChange={v => update('extraCostiTrasfertaMont', v)}>
            <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
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
        <div>
          <Label>Ricarico Listino %</Label>
          <Input type="number" value={formData.ricaricoMontaggio ?? 0}
                 onChange={e => update('ricaricoMontaggio', parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2"/>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DatiIngressoSmontaggio({formData, update, onReset}: DatiIngressoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Servizio di Smontaggio - Dati ingresso</CardTitle>
      </CardHeader>
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
            <Label>Giorni smontaggio + viaggio</Label>
            <Input type="number" value={formData.giorniSmontaggioViaggio ?? 0}
                   onChange={e => update('giorniSmontaggioViaggio', parseInt(e.target.value) || 0)}/>
          </div>
          <div>
            <Label>Ore lavoro smontaggio in cantiere/persona</Label>
            <Input type="number" value={formData.oreLavoroCantxperSmon ?? 0}
                   onChange={e => update('oreLavoroCantxperSmon', parseFloat(e.target.value) || 0)}/>
          </div>
        </div>
        <div>
          <Label>Km Viaggio smontaggio A+R</Label>
          <Input type="number" value={formData.kmArSmon ?? 0}
                 onChange={e => update('kmArSmon', parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label>Volo</Label>
          <Select value={formData.voloSmon ?? 'NO'} onValueChange={v => update('voloSmon', v)}>
            <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
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
        <div>
          <Label>Ore viaggio trasferta smontatori (treno/aereo, no camion)</Label>
          <Input type="number" value={formData.oreViaggioTrasfertaSmon ?? 0}
                 onChange={e => update('oreViaggioTrasfertaSmon', parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox checked={formData.viaggioAutoComSmon ?? false}
                    onCheckedChange={v => update('viaggioAutoComSmon', Boolean(v))}/>
          <Label>Viaggio auto commerciale</Label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label>Extra (park, metro, taxi, …)</Label>
          <Select value={formData.extraCostiTrasfertaSmon ?? 'NO'}
                  onValueChange={v => update('extraCostiTrasfertaSmon', v)}>
            <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
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
        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2"/>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface CalcoloCostiTabellaProps {
  titolo: string;
  voci: { label: string; costo: number }[];
  ricaricoFactor: number;
}

function CalcoloCostiTabella({titolo, voci, ricaricoFactor}: CalcoloCostiTabellaProps) {
  const totCosto = voci.reduce((s, v) => s + v.costo, 0);
  const totPrezzo = totCosto * ricaricoFactor;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titolo}</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voce</TableHead>
              <TableHead className="text-right w-32">Costo</TableHead>
              <TableHead className="text-right w-32">Prezzo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voci.map(v => (
              <TableRow key={v.label}>
                <TableCell className="py-1">{v.label}</TableCell>
                <TableCell className="text-right py-1">€ {fmt(v.costo)}</TableCell>
                <TableCell className="text-right py-1">€ {fmt(v.costo * ricaricoFactor)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2">
              <TableCell className="font-semibold">Totale</TableCell>
              <TableCell className="text-right font-semibold">€ {fmt(totCosto)}</TableCell>
              <TableCell className="text-right font-semibold">€ {fmt(totPrezzo)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface SpecchiettoProps {
  totaleCosti: number;
  totalePrezzoListino: number;
  totalePrezzoNetto: number;
  margine: number;
  marginalita: number;
  scontoPerc: number;
  scontoEditable: boolean;
  onScontoChange?: (v: number) => void;
}

function Specchietto({
                       totaleCosti, totalePrezzoListino, totalePrezzoNetto, margine, marginalita,
                       scontoPerc, scontoEditable, onScontoChange,
                     }: SpecchiettoProps) {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Cell label="Totale Costi" value={`€${fmt(totaleCosti)}`}/>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Sconto</div>
            {scontoEditable ? (
              <div className="flex items-center gap-2">
                <Input type="number" min={0} max={100} value={scontoPerc}
                       onChange={e => onScontoChange?.(parseFloat(e.target.value) || 0)}
                       className="w-24 h-9 text-right"/>
                <span>%</span>
              </div>
            ) : (
              <div className="text-lg font-bold">{scontoPerc.toFixed(0)}%</div>
            )}
          </div>
          <Cell label="Totale Prezzo Netto" value={`€${fmt(totalePrezzoNetto)}`} primary/>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <Cell label="Totale Prezzo Listino" value={`€${fmt(totalePrezzoListino)}`}/>
          <Cell label="Margine di Vendita" value={`${marginalita.toFixed(1)}%`}
                color={marginalita < 0 ? 'text-red-600' : 'text-green-600'}/>
          <Cell label="Margine" value={`€${fmt(margine)}`}
                color={margine < 0 ? 'text-red-600' : 'text-green-600'}/>
        </div>
      </CardContent>
    </Card>
  );
}

function Cell({label, value, primary, color}: { label: string; value: React.ReactNode; primary?: boolean; color?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-lg font-bold ${primary ? 'text-primary' : ''} ${color ?? ''}`}>{value}</div>
    </div>
  );
}
