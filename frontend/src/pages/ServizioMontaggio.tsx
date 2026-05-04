import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {toast} from 'sonner';
import {ArrowLeft, RotateCcw} from 'lucide-react';
import {
  CostoExtraTrasfMontBean,
  CostoVoloArBean,
  PreventivoServiziBean
} from "@/types/parametri.ts";
import {ParametriAPI} from "@/api/parametri.ts";
import {PreventiviAPI} from "@/api/preventivi.ts";

const DEFAULT_MONT: Partial<PreventivoServiziBean> = {
  personaleMont: 0,
  costoOrarioMont: 20,
  giorniMontaggio: 0,
  oreLavoroCantxperMont: 0,
  kmArMont: 0,
  puntoPartenza: '',
  puntoArrivo: '',
  rientroDopomont: true,
  giorniViaggio: 0,
  pernottamentiViaggio: 0,
  tempoViaggioArMont: 0,
  costoOrarioViaggio: 0,
  noleggioMezzo: 'No',
  giorniNoleggio: 0,
  costoPedaggi: 0,
  costoVoloPp: 0,
  costoTrenoPp: 0,
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

const posF = (v: string) => Math.max(0, parseFloat(v) || 0);
const posI = (v: string) => Math.max(0, parseInt(v) || 0);

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
    // Lookup parametri_a_costi_unitari per label "parametro"
    const getParam = (label: string) => {
      const p = parametri.find(x => x.parametro === label);
      return p ? num(p.valore) : 0;
    };
    // Lookup parametri_a_costi_unitari per nome_variabile
    const getParamVar = (nomeVar: string) => {
      const p = parametri.find(x => x.nomeVariabile === nomeVar);
      return p ? num(p.valore) : 0;
    };
    const getFlightSmon = (tipo: string) => {
      const v = costiVolo.find(x => x.tipologia === tipo);
      return v ? num(v.costoVoloAr) : 0;
    };
    const getExtraMont = (livello: string) => {
      const e = costiExtra.find(x => x.livello === livello);
      return e ? num(e.costoExtraMont) : 0;
    };
    const getExtraSmont = (livello: string) => {
      const e = costiExtra.find(x => x.livello === livello);
      return e ? num(e.costoExtraSmont) : 0;
    };

    // Parametri da parametri_a_costi_unitari (label)
    const costoPasto = getParam('Costo pasto');
    const costoAlloggio = getParam('Costo alloggio');

    // Parametri trasporto/noleggio da parametri_a_costi_unitari (nome_variabile)
    const costoFissoConsegna = getParamVar('costo_fisso_consegna');
    const costoAutoXkm = getParamVar('costo_auto_xkm');
    const costoFurgoneXkm = getParamVar('costo_furgone_xkm');
    const costoAltromezzoXkm = getParamVar('costo_altromezzo_xkm');
    const costoNoleggioAuto = getParamVar('costo_noleggio_auto');
    const costoNoleggioFurgone = getParamVar('costo_noleggio_furgone');
    const costoNoleggioAltromezzo = getParamVar('costo_noleggio_altromezzo');
    const costoAutowowXkm = getParamVar('costo_autowow_xkm');
    const costoFurgextraXkm = getParamVar('costo_furgextra_xkm');
    const costoTirextraXkm = getParamVar('costo_tirextra_xkm');

    // Smon usa ancora i vecchi parametri label
    const costoMontXkmSmon = getParam('Costo montatori xkm');
    const costoKmTrenoSmon = getParam('Costo treno al km');
    const costoKmAutoSmon = getParam('Costo auto al km');

    const ricaricoPerc = num(formData.ricaricoMontaggio);
    const scontoPerc = num(formData.scontoMontaggio);
    const ricaricoFactor = 1 + ricaricoPerc / 100;
    const scontoFactor = 1 - scontoPerc / 100;

    // ---- MONTAGGIO ----
    const personaleMont = num(formData.personaleMont);
    const costoOrarioMont = num(formData.costoOrarioMont);
    const giorniMontaggio = num(formData.giorniMontaggio);
    const oreLavoroMont = num(formData.oreLavoroCantxperMont);
    const giorniViaggio = num(formData.giorniViaggio);
    const pernottamentiViaggio = num(formData.pernottamentiViaggio);
    const rientroDopomont = formData.rientroDopomont !== false;
    const tempoViaggioArMont = num(formData.tempoViaggioArMont);
    const costoOrarioViaggio = num(formData.costoOrarioViaggio);
    // Spec: utente inserisce solo Andata; se Rientro_dopomont=yes raddoppio per A+R
    const kmAndataInput = num(formData.kmArMont);
    const kmArMont = rientroDopomont ? kmAndataInput * 2 : kmAndataInput;
    const tempoViaggioReale = rientroDopomont ? tempoViaggioArMont * 2 : tempoViaggioArMont;
    const noleggioMezzo = formData.noleggioMezzo ?? 'No';
    const costoPedaggi = num(formData.costoPedaggi);
    const costoVoloPp = num(formData.costoVoloPp);
    const costoTrenoPp = num(formData.costoTrenoPp);
    const voloAttivo = !!formData.voloMont && formData.voloMont !== 'NO';
    const trenoAttivo = !!formData.trenoMont;
    const oreViaggioTrenoAereo = (voloAttivo || trenoAttivo) ? num(formData.oreViaggioTrasfertaMont) : 0;
    const extraKmFurgMont = num(formData.extraKmTraspFurgMont);
    const extraKmTirMont = num(formData.extraKmTraspTirMont);

    // Ore montaggio fiera/cantiere
    const totCostOreMont = personaleMont * costoOrarioMont * giorniMontaggio * oreLavoroMont;

    // Ore di viaggio da/per fiera/cantiere (auto + treno/aereo, A+R se rientro)
    const totCostOreViaggio = personaleMont * costoOrarioViaggio * (tempoViaggioReale + oreViaggioTrenoAereo);

    // Num vitti = 2 * personale * (giorni_montaggio + giorni_viaggio)
    const numVitti = 2 * personaleMont * (giorniMontaggio + giorniViaggio);

    // Num pernottamenti
    let numAlloggi: number;
    if (giorniMontaggio === 1) {
      numAlloggi = pernottamentiViaggio * personaleMont;
    } else {
      numAlloggi = (giorniMontaggio - 1 + pernottamentiViaggio) * personaleMont;
    }
    if (numAlloggi < 0) numAlloggi = 0;

    const totCostVittAll = numVitti * costoPasto + numAlloggi * costoAlloggio;

    // Noleggio mezzi + spese (carburante/pedaggi)
    const giorniNoleggio = num(formData.giorniNoleggio);
    let totCostNoleggio = 0;
    if (noleggioMezzo === 'Auto') {
      totCostNoleggio = costoAutoXkm * kmArMont + costoNoleggioAuto * giorniNoleggio + costoPedaggi;
    } else if (noleggioMezzo === 'Furgone') {
      totCostNoleggio = costoFurgoneXkm * kmArMont + costoNoleggioFurgone * giorniNoleggio + costoPedaggi;
    } else if (noleggioMezzo === 'Altro') {
      totCostNoleggio = costoAltromezzoXkm * kmArMont + costoNoleggioAltromezzo * giorniNoleggio + costoPedaggi;
    }

    // Voli aerei + treni
    const totCostoVoloTreno =
      ((voloAttivo ? costoVoloPp : 0) + (trenoAttivo ? costoTrenoPp : 0)) * personaleMont;

    // Auto propria/WOW
    const totCostiAuto = formData.viaggioAutoComMont ? kmArMont * costoAutowowXkm : 0;

    // Extra trasferta giornaliera
    const extraLivelloMont = formData.extraCostiTrasfertaMont ?? 'NO';
    const totCostiExtraTrasfMont = extraLivelloMont !== 'NO'
      ? getExtraMont(extraLivelloMont) * giorniMontaggio * personaleMont : 0;

    // Trasporti km mezzo leggero/pesante
    const totCostiExtraKmTraspFurgMont = extraKmFurgMont * costoFurgextraXkm;
    const totCostiExtraKmTraspTirMont = extraKmTirMont * costoTirextraXkm;

    // Consegna cantiere
    const totCostiConsegnaCantiere = formData.consegCant ? costoFissoConsegna : 0;

    const voiciMont = [
      {label: 'Ore montaggio fiera/cantiere', costo: totCostOreMont},
      {label: 'Ore di viaggio da/per fiera/cantiere', costo: totCostOreViaggio},
      {label: 'Vitto/Alloggio', costo: totCostVittAll},
      {label: 'Noleggio mezzi + spese (carburante, pedaggi)', costo: totCostNoleggio},
      {label: 'Voli aerei/treni', costo: totCostoVoloTreno},
      {label: 'Auto propria/WOW', costo: totCostiAuto},
      {label: 'Costi extra (park, metro, taxi, materiali di consumo)', costo: totCostiExtraTrasfMont},
      {label: 'Trasporto extra con autista mezzo leggero (<35 q.li)', costo: totCostiExtraKmTraspFurgMont},
      {label: 'Trasporto extra con autista mezzo pesante (>35 q.li)', costo: totCostiExtraKmTraspTirMont},
      {label: 'Consegna in cantiere', costo: totCostiConsegnaCantiere},
    ];

    const totaleCostoMontaggio = voiciMont.reduce((s, v) => s + v.costo, 0);
    const totalePrezzoListinoMont = totaleCostoMontaggio * ricaricoFactor;
    const totalePrezzoNettoMont = totalePrezzoListinoMont * scontoFactor;
    const margineMont = totalePrezzoNettoMont - totaleCostoMontaggio;
    const marginalitaMont = totalePrezzoNettoMont > 0 ? margineMont / totalePrezzoNettoMont * 100 : 0;

    // ---- SMONTAGGIO (resta su parametri label come prima) ----
    const personaleSmon = num(formData.personaleSmon);
    const costoOrarioSmon = num(formData.costoOrarioSmon);
    const giorniSmon = num(formData.giorniSmontaggioViaggio);
    const oreLavoroSmon = num(formData.oreLavoroCantxperSmon);
    const kmArSmon = num(formData.kmArSmon);
    const oreViaggioSmon = num(formData.oreViaggioTrasfertaSmon);
    const extraKmFurgSmon = num(formData.extraKmTraspFurgSmon);
    const extraKmTirSmon = num(formData.extraKmTraspTirSmon);

    const totCostOreSmon = personaleSmon * costoOrarioSmon * giorniSmon * oreLavoroSmon;
    const totCostKmSmon = kmArSmon * costoMontXkmSmon;
    const numVittiSmon = 2 * personaleSmon * giorniSmon;
    const numAlloggiSmon = giorniSmon <= 1 ? 0 : (giorniSmon - 1) * personaleSmon;
    const totCostVittAllSmon = numVittiSmon * costoPasto + numAlloggiSmon * costoAlloggio;
    const totCostoVoloARSmon = formData.voloSmon && formData.voloSmon !== 'NO'
      ? getFlightSmon(formData.voloSmon) * personaleSmon : 0;
    const totCostoTrenoSmon = formData.trenoSmon ? kmArSmon * costoKmTrenoSmon * personaleSmon : 0;
    const totCostoTrasfPersSmon = personaleSmon * oreViaggioSmon * costoOrarioSmon;
    const totCostiAutoSmon = formData.viaggioAutoComSmon ? kmArSmon * costoKmAutoSmon : 0;
    const totCostiExtraTrasfSmon = formData.extraCostiTrasfertaSmon && formData.extraCostiTrasfertaSmon !== 'NO'
      ? getExtraSmont(formData.extraCostiTrasfertaSmon) * giorniSmon * personaleSmon : 0;
    const totCostiExtraKmTraspFurgSmon = extraKmFurgSmon * getParam('Costo furgone al km');
    const totCostiExtraKmTraspTirSmon = extraKmTirSmon * getParam('Costo TIR al km');

    const voiciSmon = [
      {label: 'Costo ore smontatori', costo: totCostOreSmon},
      {label: 'Costo km smontaggio', costo: totCostKmSmon},
      {label: 'Costo vitto e alloggio smontatori', costo: totCostVittAllSmon},
      {label: 'Costo volo aereo A/R', costo: totCostoVoloARSmon},
      {label: 'Costo treno A/R', costo: totCostoTrenoSmon},
      {label: 'Costo di trasferta del personale', costo: totCostoTrasfPersSmon},
      {label: 'Costo viaggio in auto', costo: totCostiAutoSmon},
      {label: 'Costi extra (park, metro, taxi)', costo: totCostiExtraTrasfSmon},
      {label: 'Costi trasporto mezzo leggero (<35 q.li)', costo: totCostiExtraKmTraspFurgSmon},
      {label: 'Costi trasporto mezzo pesante (>35 q.li)', costo: totCostiExtraKmTraspTirSmon},
    ];
    const totaleCostoSmontaggio = voiciSmon.reduce((s, v) => s + v.costo, 0);
    const totalePrezzoListinoSmon = totaleCostoSmontaggio * ricaricoFactor;
    const totalePrezzoNettoSmon = totalePrezzoListinoSmon * scontoFactor;
    const margineSmon = totalePrezzoNettoSmon - totaleCostoSmontaggio;
    const marginalitaSmon = totalePrezzoNettoSmon > 0 ? margineSmon / totalePrezzoNettoSmon * 100 : 0;

    const totaleNettoCombinato = totalePrezzoNettoMont + totalePrezzoNettoSmon;

    return {
      voiciMont, voiciSmon,
      totCostOreMont, totCostOreViaggio, numVitti, numAlloggi, totCostVittAll,
      totCostNoleggio, totCostoVoloTreno, totCostiAuto,
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
        totCostKmMont: costs.totCostOreViaggio,
        numVitti: costs.numVitti,
        numAlloggi: costs.numAlloggi,
        totCostVittall: costs.totCostVittAll,
        totCostoVoloAr: costs.totCostoVoloTreno,
        totCostoTreno: 0,
        totCostoTrasfPers: costs.totCostOreViaggio,
        totCostiAuto: costs.totCostiAuto,
        totCostNoleggio: costs.totCostNoleggio,
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
              ricaricoPerc={num(formData.ricaricoMontaggio)}
              onRicaricoChange={v => update('ricaricoMontaggio', v)}
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
              ricaricoPerc={num(formData.ricaricoMontaggio)}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div>{datiIngresso}</div>
        <div className="space-y-4 lg:sticky lg:top-4">
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
  const voloOn = !!formData.voloMont && formData.voloMont !== 'NO';
  const trenoOn = !!formData.trenoMont;
  const extraOn = !!formData.extraCostiTrasfertaMont && formData.extraCostiTrasfertaMont !== 'NO';
  const noleggioOn = (formData.noleggioMezzo ?? 'No') !== 'No';
  const sectionTitle = "text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1";
  const lbl = "text-xs";
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base">Servizio di Montaggio - Dati ingresso</CardTitle>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2"/>Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        <div className={sectionTitle}>Personale e tempi</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={lbl}>Personale</Label>
            <Input type="number" min={0} value={formData.personaleMont ?? 0}
                   onChange={e => update('personaleMont', posI(e.target.value))}/>
          </div>
          <div>
            <Label className={lbl}>Costo orario montaggio</Label>
            <Input type="number" min={0} value={formData.costoOrarioMont ?? 0}
                   onChange={e => update('costoOrarioMont', posF(e.target.value))}/>
          </div>
          <div>
            <Label className={lbl}>Giorni di montaggio</Label>
            <Input type="number" min={0} value={formData.giorniMontaggio ?? 0}
                   onChange={e => update('giorniMontaggio', posI(e.target.value))}/>
          </div>
          <div>
            <Label className={lbl}>Ore giornaliere</Label>
            <Input type="number" min={0} value={formData.oreLavoroCantxperMont ?? 0}
                   onChange={e => update('oreLavoroCantxperMont', posF(e.target.value))}/>
          </div>
        </div>

        <div className={sectionTitle}>Tragitto e viaggio</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={lbl}>Punto Partenza</Label>
            <Input value={formData.puntoPartenza ?? ''}
                   onChange={e => update('puntoPartenza', e.target.value)}/>
          </div>
          <div>
            <Label className={lbl}>Punto Arrivo</Label>
            <Input value={formData.puntoArrivo ?? ''}
                   onChange={e => update('puntoArrivo', e.target.value)}/>
          </div>
          <div className="flex items-center space-x-2 self-end pb-1 col-span-2">
            <Checkbox checked={formData.rientroDopomont ?? true}
                      onCheckedChange={v => update('rientroDopomont', Boolean(v))}/>
            <Label className={lbl}>Rientro a fine montaggio</Label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={lbl}>Km Viaggio solo andata</Label>
            <Input type="number" min={0} value={formData.kmArMont ?? 0}
                   onChange={e => update('kmArMont', posF(e.target.value))}/>
          </div>
          <div>
            <Label className={lbl}>Giorni viaggio</Label>
            <Input type="number" min={0} value={formData.giorniViaggio ?? 0}
                   onChange={e => update('giorniViaggio', posI(e.target.value))}/>
          </div>
          <div>
            <Label className={lbl}>Ore viaggio solo andata</Label>
            <Input type="number" min={0} value={formData.tempoViaggioArMont ?? 0}
                   onChange={e => update('tempoViaggioArMont', posF(e.target.value))}/>
          </div>
          <div>
            <Label className={lbl}>Costo orario viaggio</Label>
            <Input type="number" min={0} value={formData.costoOrarioViaggio ?? 0}
                   onChange={e => update('costoOrarioViaggio', posF(e.target.value))}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={lbl}>Pernottamenti per persona</Label>
            <Input type="number" min={0} value={formData.pernottamentiViaggio ?? 0}
                   onChange={e => update('pernottamentiViaggio', posI(e.target.value))}/>
          </div>
        </div>

        <div className={sectionTitle}>Mezzo e trasferta</div>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div className="col-span-2">
            <Label className={lbl}>Noleggio Mezzo</Label>
            <RadioGroup
              className="flex gap-3 mt-1"
              value={formData.noleggioMezzo ?? 'No'}
              onValueChange={v => update('noleggioMezzo', v)}>
              {['No', 'Auto', 'Furgone', 'Altro'].map(opt => (
                <label key={opt} className="flex items-center gap-1 text-xs">
                  <RadioGroupItem value={opt}/>
                  <span>{opt}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className={lbl}>Giorni Noleggio</Label>
            <Input type="number" min={0} disabled={!noleggioOn}
                   value={formData.giorniNoleggio ?? 0}
                   onChange={e => update('giorniNoleggio', posI(e.target.value))}/>
          </div>
          <div>
            <Label className={lbl}>Stima Pedaggi</Label>
            <Input type="number" min={0} value={formData.costoPedaggi ?? 0}
                   onChange={e => update('costoPedaggi', posF(e.target.value))}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div className="flex items-center space-x-2 pb-1">
            <Checkbox checked={voloOn}
                      onCheckedChange={v => {
                        update('voloMont', v ? 'SI' : 'NO');
                        if (!v) update('costoVoloPp', 0);
                      }}/>
            <Label className={lbl}>Volo aereo p/p</Label>
          </div>
          <div>
            <Label className={lbl}>€ volo p/p</Label>
            <Input type="number" min={0} disabled={!voloOn} value={formData.costoVoloPp ?? 0}
                   onChange={e => update('costoVoloPp', posF(e.target.value))}/>
          </div>
          <div className="flex items-center space-x-2 pb-1">
            <Checkbox checked={trenoOn}
                      onCheckedChange={v => {
                        update('trenoMont', Boolean(v));
                        if (!v) update('costoTrenoPp', 0);
                      }}/>
            <Label className={lbl}>Treno p/p</Label>
          </div>
          <div>
            <Label className={lbl}>€ treno p/p</Label>
            <Input type="number" min={0} disabled={!trenoOn} value={formData.costoTrenoPp ?? 0}
                   onChange={e => update('costoTrenoPp', posF(e.target.value))}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={lbl}>Ore viaggio trasferta (treno/aereo)</Label>
            <Input type="number" min={0} disabled={!voloOn && !trenoOn}
                   value={formData.oreViaggioTrasfertaMont ?? 0}
                   onChange={e => update('oreViaggioTrasfertaMont', posF(e.target.value))}/>
          </div>
        </div>

        <div className={sectionTitle}>Costi extra</div>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div className="flex items-center space-x-2 pb-1">
            <Checkbox checked={formData.viaggioAutoComMont ?? false}
                      onCheckedChange={v => update('viaggioAutoComMont', Boolean(v))}/>
            <Label className={lbl}>Auto propria/WOW</Label>
          </div>
          <div className="flex items-center space-x-2 pb-1">
            <Checkbox checked={formData.consegCant ?? false}
                      onCheckedChange={v => update('consegCant', Boolean(v))}/>
            <Label className={lbl}>Consegna in cantiere</Label>
          </div>
          <div className="flex items-center space-x-2 pb-1">
            <Checkbox checked={extraOn}
                      onCheckedChange={v => update('extraCostiTrasfertaMont', v ? 'Basso' : 'NO')}/>
            <Label className={lbl}>Extra giornaliero p/p</Label>
          </div>
          <Select value={extraOn ? (formData.extraCostiTrasfertaMont ?? 'Basso') : 'NO'}
                  disabled={!extraOn}
                  onValueChange={v => update('extraCostiTrasfertaMont', v)}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="Basso">Basso</SelectItem>
              <SelectItem value="Medio">Medio</SelectItem>
              <SelectItem value="Alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={lbl}>Km extra trasporto Furgone (&lt;35 q.li)</Label>
            <Input type="number" min={0} value={formData.extraKmTraspFurgMont ?? 0}
                   onChange={e => update('extraKmTraspFurgMont', posF(e.target.value))}/>
          </div>
          <div>
            <Label className={lbl}>Km extra trasporto camion (&gt;35 q.li)</Label>
            <Input type="number" min={0} value={formData.extraKmTraspTirMont ?? 0}
                   onChange={e => update('extraKmTraspTirMont', posF(e.target.value))}/>
          </div>
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
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2"/>Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Personale</Label>
            <Input type="number" min={0} value={formData.personaleSmon ?? 0}
                   onChange={e => update('personaleSmon', posI(e.target.value))}/>
          </div>
          <div>
            <Label>Costo orario</Label>
            <Input type="number" min={0} value={formData.costoOrarioSmon ?? 0}
                   onChange={e => update('costoOrarioSmon', posF(e.target.value))}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Giorni smontaggio + viaggio</Label>
            <Input type="number" min={0} value={formData.giorniSmontaggioViaggio ?? 0}
                   onChange={e => update('giorniSmontaggioViaggio', posI(e.target.value))}/>
          </div>
          <div>
            <Label>Ore lavoro smontaggio cantiere/persona</Label>
            <Input type="number" min={0} value={formData.oreLavoroCantxperSmon ?? 0}
                   onChange={e => update('oreLavoroCantxperSmon', posF(e.target.value))}/>
          </div>
        </div>
        <div>
          <Label>Km Viaggio smontaggio A+R</Label>
          <Input type="number" min={0} value={formData.kmArSmon ?? 0}
                 onChange={e => update('kmArSmon', posF(e.target.value))}/>
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
          <Label>Ore viaggio trasferta smontatori (treno/aereo)</Label>
          <Input type="number" min={0} value={formData.oreViaggioTrasfertaSmon ?? 0}
                 onChange={e => update('oreViaggioTrasfertaSmon', posF(e.target.value))}/>
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
            <Label>Km. extra Furgone (&lt;35 q.li)</Label>
            <Input type="number" min={0} value={formData.extraKmTraspFurgSmon ?? 0}
                   onChange={e => update('extraKmTraspFurgSmon', posF(e.target.value))}/>
          </div>
          <div>
            <Label>Km. extra camion (&gt;35 q.li)</Label>
            <Input type="number" min={0} value={formData.extraKmTraspTirSmon ?? 0}
                   onChange={e => update('extraKmTraspTirSmon', posF(e.target.value))}/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CalcoloCostiTabellaProps {
  titolo: string;
  voci: { label: string; costo: number }[];
  ricaricoFactor: number;
  ricaricoPerc: number;
  onRicaricoChange?: (v: number) => void;
}

function CalcoloCostiTabella({titolo, voci, ricaricoFactor, ricaricoPerc, onRicaricoChange}: CalcoloCostiTabellaProps) {
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
              <TableHead>Voce di costo</TableHead>
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
            <TableRow className="border-t-2 bg-muted/40">
              <TableCell className="font-semibold">
                <div className="flex items-center gap-2">
                  <span>Totale</span>
                  <span className="text-xs text-muted-foreground ml-4">Ricarico</span>
                  {onRicaricoChange ? (
                    <div className="flex items-center gap-1">
                      <Input type="number" min={0} value={ricaricoPerc}
                             onChange={e => onRicaricoChange(posF(e.target.value))}
                             className="w-16 h-7 text-right"/>
                      <span className="text-xs">%</span>
                    </div>
                  ) : (
                    <span className="text-xs">{ricaricoPerc}%</span>
                  )}
                </div>
              </TableCell>
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
                       onChange={e => onScontoChange?.(posF(e.target.value))}
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
