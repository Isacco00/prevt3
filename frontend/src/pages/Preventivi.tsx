import React, {useState, useCallback, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {supabase} from '@/integrations/supabase/client';
import {useAuth} from '@/hooks/useAuth';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Plus, Edit, Trash2, Search, FileText, Calculator, ChevronDown, ChevronRight} from 'lucide-react';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {StandSection} from '@/components/StandSection';
import {StorageSection} from '@/components/StorageSection';
import {DeskSection} from '@/components/DeskSection';
import {ExpositoreSection} from '@/components/ExpositoreSection';
import {ServicesSection} from '@/components/ServicesSection';
import {AltriBeniServiziSection} from '@/components/AltriBeniServiziSection';
import {CondizioniFornituraSection} from '@/components/CondizioniFornituraSection';
import {TotalePreventivoSection} from '@/components/TotalePreventivoSection';
import {Settings} from 'lucide-react';
import {Checkbox} from '@/components/ui/checkbox';
import {Link, useLocation} from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {useToast} from '@/hooks/use-toast';
import {PreventivoBean} from "@/types/preventivo.ts";
import {PreventiviAPI} from "@/api/preventivi.ts";
import {ProspectsAPI} from "@/api/prospects.ts";
import {ParametriAPI} from "@/api/parametri.ts";

const Preventivi = () => {
    const location = useLocation();

    // Query per recuperare i preventivi (REST, pattern standard)
    const {
        data: preventivi = [],
    } = useQuery({
        queryKey: ["preventivi"],
        queryFn: PreventiviAPI.getPreventiviList,
    });

    // Query per recuperare i preventivi (REST, pattern standard)
    const {
        data: prospects = [],
    } = useQuery({
        queryKey: ["prospects"],
        queryFn: ProspectsAPI.getProspects,
    });

    // physicalElements calcolati dopo il caricamento dei parametri
    // Query per recuperare i parametri
    const {
        data: parametri = [],
    } = useQuery({
        queryKey: ["parametri-for-preventivi"],
        queryFn: () => ParametriAPI.getParametriList({
            sortFields: [{
                field: "PARAMETRI_TIPO",
                desc: false
            }, {
                field: "PARAMETRI_ORDINE",
                desc: false
            }]
        })
    });

    // Fetch listino accessori desk
    const {
        data: accessoriDesk
    } = useQuery({
        queryKey: ["listino-accessori-desk"],
        queryFn: () => PreventiviAPI.getListinoAccessoriDesk({
            attivo: true, sortFields: [{
                field: "LISTINO_ACCESSORI_DESK_NAME",
                desc: false
            }]
        })
    });

    // Fetch costi struttura desk
    const {
        data: costiStrutturaDesk
    } = useQuery({
        queryKey: ["costi-struttura-desk-layout"],
        queryFn: () => PreventiviAPI.getCostiStrutturaDesk({attivo: true})
    });

    // Query per recuperare i parametri a costi unitari
    const {
        data: parametriCostiUnitari = []
    } = useQuery({
        queryKey: ['parametri-costi-unitari'],
        queryFn: () => ParametriAPI.getParametriACostiUnitari({
            attivo: true, sortFields: [{
                field: "PARAMETRI_COSTI_UNITARI_PARAMETRO",
                desc: false
            }]
        })
    });

    // Query per recuperare i costi retroilluminazione
    const {
        data: costiRetroilluminazione = []
    } = useQuery({
        queryKey: ['costi-retroilluminazione'],
        queryFn: () => ParametriAPI.getCostiRetroilluminazione({
            sortFields: [{
                field: "PARAMETRI_COSTI_RETROILLUMINAZIONE_ALTEZZA",
                desc: false
            }]
        })
    });

    // Fetch accessori stand for cost calculation
    const {
        data: accessoriStand = []
    } = useQuery({
        queryKey: ['listino-accessori-stand'],
        queryFn: () => ParametriAPI.getListinoAccessoriStand({
            attivo: true
        })
    });

    // Query per accessori espositori
    const {
        data: accessoriEspositoriDB = []
    } = useQuery({
        queryKey: ['listino-accessori-espositori'],
        queryFn: () => PreventiviAPI.getListinoAccessoriEspositori({
            attivo: true, sortFields: [{
                field: "LISTINO_ACCESSORI_ESPOSITORI_NOME",
                desc: false
            }]
        })
    });

    // Fetch service costs for totals calculation
    const {
        data: serviceCosts
    } = useQuery({
        queryKey: ['service-costs'],
        queryFn: async () => {
            const {
                data,
                error
            } = await supabase.from('parametri_a_costi_unitari').select('*').in('parametro', ['Costo_certificazione', 'Costo_istruzionieassistenza']).eq('attivo', true);
            if (error) throw error;
            const costs: {
                [key: string]: number;
            } = {};
            data.forEach(item => {
                costs[item.parametro] = item.valore;
            });
            return costs;
        }
    });

    const {
        user
    } = useAuth();
    const queryClient = useQueryClient();
    const {
        toast
    } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPreventivo, setEditingPreventivo] = useState<PreventivoBean | null>(null);

    // Fetch preventivi servizi data
    const {
        data: preventivoServizi
    } = useQuery({
        queryKey: ['preventivo-servizi', editingPreventivo?.id],
        queryFn: async () => {
            if (!editingPreventivo?.id) return null;
            const {
                data,
                error
            } = await supabase.from('preventivi_servizi').select('*').eq('preventivo_id', editingPreventivo.id).single();
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

            return data;
        },
        enabled: !!editingPreventivo?.id
    });

    // Fetch altri beni/servizi for the current preventivo
    const {
        data: altriBeniServizi
    } = useQuery({
        queryKey: ['altri-beni-servizi', editingPreventivo?.id],
        queryFn: async () => {
            if (!editingPreventivo?.id) return [];
            const {
                data,
                error
            } = await supabase.from('altri_beni_servizi').select('*').eq('preventivo_id', editingPreventivo.id);
            if (error) throw error;
            return data || [];
        },
        enabled: !!editingPreventivo?.id
    });

    const [deletePreventivo, setDeletePreventivo] = useState<PreventivoBean | null>(null);
    const [formData, setFormData] = useState({
        numeroPreventivo: '',
        titolo: '',
        descrizione: '',
        prospectId: '',
        profondita: '',
        larghezza: '',
        altezza: '',
        layout: '',
        distribuzione: '',
        complessita: 'normale',
        status: 'bozza',
        dataScadenza: '',
        note: '',
        bifaccialita: '0',
        retroilluminazione: '',
        premontaggio: true,
        // Stand margins
        marginalitaStruttura: 0,
        marginalitaGrafica: 0,
        marginalitaRetroilluminazione: 0,
        marginalitaAccessori: 0,
        marginalitaPremontaggio: 0,
        // Storage margins
        marginalitaStrutturaStorage: 0,
        marginalitaGraficaStorage: 0,
        marginalitaPremontaggioStorage: 0,
        // Desk margins
        marginalitaStrutturaDesk: 0,
        marginalitaGraficaDesk: 0,
        marginalitaPremontaggioDesk: 0,
        marginalitaAccessoriDesk: 0,
        // Espositori margins
        marginalitaStrutturaEspositori: 0,
        marginalitaGraficaEspositori: 0,
        marginalitaPremontaggioEspositori: 0,
        marginalitaAccessoriEspositori: 0,
        // Stand accessories
        borsaStand: '',
        bauleTrolley: '',
        staffaMonitor: '',
        mensola: '',
        spotLight: '',
        kitFaro50w: '',
        kitFaro100w: '',
        quadroElettrico16a: '',
        nicchia: '',
        pedana: '',
        // Storage fields
        larghezzaStorage: '',
        profonditaStorage: '',
        altezzaStorage: '',
        layoutStorage: '',
        numeroPorte: '',
        // Desk fields
        deskLayouts: [{
            layout: '50',
            quantity: 0
        }, {
            layout: '100',
            quantity: 0
        }, {
            layout: '150',
            quantity: 0
        }, {
            layout: '200',
            quantity: 0
        }],
        // Accessori stand dinamici
        accessoriStand: {},
        // Desk accessories (individual fields)
        portaScorrevole: 0,
        ripianoSuperiore: 0,
        ripianoInferiore: 0,
        tecaPlexiglass: 0,
        fronteLuminoso: 0,
        borsa: 0,
        // Espositore fields
        qtaTipo30: 0,
        qtaTipo50: 0,
        qtaTipo100: 0,
        ripiano30x30: 0,
        ripiano50x50: 0,
        ripiano100x50: 0,
        tecaPlexiglass30x30x30: 0,
        tecaPlexiglass50x50x50: 0,
        tecaPlexiglass100x50x30: 0,
        retroilluminazione30x30x100h: 0,
        retroilluminazione50x50x100h: 0,
        retroilluminazione100x50x100h: 0,
        borsaEspositori: 0,
        // Services fields
        servizioMontaggioSmontaggio: false,
        servizioCertificazioni: false,
        servizioIstruzioniAssistenza: false,
        // Complexity fields
        extraPercComplex: 0,
        costoRetroilluminazione: 0
    });

    // State per controllare le sezioni collassabili
    const [sectionsOpen, setSectionsOpen] = useState({
        stand: false,
        storage: false,
        desk: false,
        espositori: false,
        servizi: false,
        altri_beni_servizi: false,
        condizioni_fornitura: false
    });

    // Totali Storage "lifted" dalla sezione Storage
    const [storageCostsLifted, setStorageCostsLifted] = useState({
        costoStrutturaStorage: 0,
        costoGraficaStorage: 0,
        costoPremontaggioStorage: 0,
        costoTotaleStorage: 0
    });

    // Totali Espositori "lifted" dalla sezione Espositori
    const [expositoreCostsLifted, setExpositoreCostsLifted] = useState({
        strutturaEspositori: 0,
        graficaEspositori: 0,
        premontaggioEspositori: 0,
        accessoriEspositori: 0,
        costoTotaleEspositori: 0
    });

    // Totali Desk "lifted" dal calcolo automatico
    const [deskCostsLifted, setDeskCostsLifted] = useState({
        strutturaTerra: 0,
        graficaCordino: 0,
        premontaggio: 0,
        accessori: 0,
        totale: 0
    });

    // Totali calcolati da TotalePreventivoSection
    const [calculatedTotals, setCalculatedTotals] = useState({
        totalePreventivo: 0,
        totaleCosti: 0
    });

    // Calcoli automatici degli elementi fisici
    const calculatePhysicalElements = (profiliDistribuzioneMap: Record<number, number>) => {
        if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione) {
            return {
                superficieStampa: 0,
                superficieMq: 0,
                sviluppoLineare: 0,
                numeroPezzi: 0
            };
        }
        const profondita = parseFloat(formData.profondita);
        const larghezza = parseFloat(formData.larghezza);
        const altezza = parseFloat(formData.altezza);
        const distribuzione = parseInt(formData.distribuzione);
        const bifaccialita = parseInt(formData.bifaccialita);

        // Superficie di stampa
        let superficieStampa = 0;
        switch (formData.layout) {
            case '4_lati':
                superficieStampa = (2 * larghezza + 2 * profondita) * altezza + bifaccialita * altezza;
                break;
            case '3_lati':
                superficieStampa = (larghezza + 2 * profondita) * altezza + bifaccialita * altezza + altezza;
                break;
            case '2_lati':
                superficieStampa = (larghezza + profondita) * altezza + bifaccialita * altezza + altezza;
                break;
            case '1_lato':
                superficieStampa = larghezza * altezza + bifaccialita * altezza + altezza;
                break;
            case '0_lati':
                superficieStampa = 0;
                break;
        }

        // Superficie metri quadri
        const superficieMq = larghezza * profondita;

        // Sviluppo lineare
        let sviluppoLineare = 0;
        switch (formData.layout) {
            case '4_lati':
                sviluppoLineare = 2 * larghezza + 2 * profondita;
                break;
            case '3_lati':
                sviluppoLineare = larghezza + 2 * profondita;
                break;
            case '2_lati':
                sviluppoLineare = larghezza + profondita;
                break;
            case '1_lato':
                sviluppoLineare = larghezza;
                break;
            case '0_lati':
                sviluppoLineare = 0;
                break;
        }

        // Numero di pezzi
        const fattoreDistribuzione = profiliDistribuzioneMap[distribuzione] || 0;
        const numeroPezzi = sviluppoLineare * fattoreDistribuzione + bifaccialita * (distribuzione + 1);
        return {
            superficieStampa,
            superficieMq,
            sviluppoLineare,
            numeroPezzi
        };
    };

    // Mappa dinamica profili per distribuzione dai parametri
    const profiliDistribuzioneMap = React.useMemo(() => {
        const map: Record<number, number> = {};
        for (const p of parametri as any[]) {
            if (p.tipo === 'profili_distribuzione') {
                const key = parseInt(p.nome as string || '', 10);
                if (!isNaN(key)) map[key] = Number(p.valore) || 0;
            }
        }
        return map;
    }, [parametri]);

    // Elementi fisici calcolati (dipendono dai parametri)
    const physicalElements = calculatePhysicalElements(profiliDistribuzioneMap);
    const updatePreventivoMutation = useMutation({
        mutationFn: async (data: any) => {
            if (!user || !editingPreventivo) throw new Error('User not authenticated or no preventivo selected');

            // Calcoli automatici
            const profondita = parseFloat(data.profondita);
            const larghezza = parseFloat(data.larghezza);
            const altezza = parseFloat(data.altezza);
            const distribuzione = parseInt(data.distribuzione);
            const bifaccialita = parseFloat(data.bifaccialita ?? '0') || 0;
            const retroilluminazione = parseFloat(data.retroilluminazione ?? '0') || 0;

            // Calcolo elementi fisici
            const elements = calculatePhysicalElements(profiliDistribuzioneMap);
            const superficie = larghezza * profondita;
            const volume = superficie * altezza;

            // Calcolo dei costi usando i parametri
            const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
            const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
            const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === data.altezza);
            const strutturaTerra = costoAltezzaParam ? elements.sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;
            const graficaCordino = costoStampaParam ? elements.superficieStampa * (costoStampaParam.valore || 0) : 0;
            const premontaggio = costoPremontaggio && data.premontaggio ? elements.numeroPezzi * (costoPremontaggio.valore || 0) : 0;
            const costo_totale = strutturaTerra + graficaCordino + premontaggio;
            const superficie_mq = superficie / 10000;
            const volume_mc = volume / 1000000;

            // Evita overflow su colonne numeric(10,2)
            const MAX_NUMERIC = 99999999.99;
            let costo_mq_value = superficie_mq > 0 ? costo_totale / superficie_mq : 0;
            let costo_mc_value = volume_mc > 0 ? costo_totale / volume_mc : 0;
            if (!isFinite(costo_mq_value) || Math.abs(costo_mq_value) > MAX_NUMERIC) costo_mq_value = MAX_NUMERIC;
            if (!isFinite(costo_mc_value) || Math.abs(costo_mc_value) > MAX_NUMERIC) costo_mc_value = MAX_NUMERIC;

            // Calcoli Storage
            let superficie_stampa_storage = 0;
            let sviluppo_metri_lineari_storage = 0;
            let numeroPezzi_storage = 0;
            if (data.larg_storage && data.prof_storage && data.alt_storage && data.layout_storage) {
                const larg = parseFloat(data.larg_storage);
                const prof = parseFloat(data.prof_storage);
                const alt = parseFloat(data.alt_storage);
                const layout = data.layout_storage;

                // Calcolo superficie di stampa storage
                if (layout === "0") {
                    superficie_stampa_storage = (2 * larg + 2 * prof) * alt;
                } else if (layout === "1") {
                    superficie_stampa_storage = (2 * larg + 2 * prof) * alt + 2;
                } else if (layout === "2") {
                    superficie_stampa_storage = (larg + prof) * alt + 2;
                }

                // Calcolo sviluppo in metri lineari storage
                if (layout === "0") {
                    sviluppo_metri_lineari_storage = larg + prof;
                } else if (layout === "1") {
                    sviluppo_metri_lineari_storage = 2 * larg + 2 * prof;
                } else if (layout === "2") {
                    sviluppo_metri_lineari_storage = larg + prof + 1;
                }

                // Numero pezzi storage basato su distribuzione
                numeroPezzi_storage = sviluppo_metri_lineari_storage * distribuzione;
            }

            // Calcoli Desk
            let superficie_stampa_desk = 0;
            let numeroPezzi_desk = 0;
            if (data.desk_qta && data.layoutDesk) {
                const qta = parseInt(data.desk_qta);
                const layout = data.layoutDesk;

                // Calcolo superficie di stampa desk
                if (layout === "50") {
                    superficie_stampa_desk = 1.5 * qta;
                } else if (layout === "100") {
                    superficie_stampa_desk = 2 * qta;
                } else if (layout === "150") {
                    superficie_stampa_desk = 2.5 * qta;
                } else if (layout === "200") {
                    superficie_stampa_desk = 3 * qta;
                }

                // Calcolo numero di pezzi desk
                if (layout === "50" || layout === "100" || layout === "150") {
                    numeroPezzi_desk = 12 * qta;
                } else if (layout === "200") {
                    numeroPezzi_desk = 20 * qta;
                }
            }

            // Calcoli Espositori
            const qta30 = parseInt(data.qta_tipo30) || 0;
            const qta50 = parseInt(data.qta_tipo50) || 0;
            const qta100 = parseInt(data.qta_tipo100) || 0;
            const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
            const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;

            // Calcolo del totale preventivo (con margini applicati)
            const calculatePreventivoWithMargin = (cost: number, margin: number) => {
                return cost * (1 + margin / 100);
            };

            // Fetch current servizi and altri beni data for total calculation
            const [serviziData, altriBeniData] = await Promise.all([
                supabase
                    .from('preventivi_servizi')
                    .select('*')
                    .eq('preventivo_id', editingPreventivo.id)
                    .maybeSingle(),
                supabase
                    .from('altri_beni_servizi')
                    .select('*')
                    .eq('preventivo_id', editingPreventivo.id)
            ]);

            // Calculate additional costs for storage, desk, espositori
            // (riutilizzo le variabili già dichiarate sopra: costoStampaParam, costoPremontaggio)

            // Storage costs
            const costoGraficaStorage = costoStampaParam ? superficie_stampa_storage * (costoStampaParam.valore || 0) : 0;
            const costoPremontaggioStorage = costoPremontaggio && data.premontaggio ? numeroPezzi_storage * (costoPremontaggio.valore || 0) : 0;
            const costoStrutturaStorage = sviluppo_metri_lineari_storage * (costoAltezzaParam?.valore || 0);

            // Desk costs
            const costo_grafica_desk = costoStampaParam ? superficie_stampa_desk * (costoStampaParam.valore || 0) : 0;
            const costo_premontaggioDesk = costoPremontaggio && data.premontaggio ? numeroPezzi_desk * (costoPremontaggio.valore || 0) : 0;
            const costo_struttura_desk = numeroPezzi_desk * 0.5; // Assumo un costo base per desk

            // Espositori costs
            const costo_grafica_espositori = costoStampaParam ? superficieStampaEspositori * (costoStampaParam.valore || 0) : 0;
            const costo_premontaggio_espositori = costoPremontaggio && data.premontaggio ? numeroPezziEspositori * (costoPremontaggio.valore || 0) : 0;
            const costo_struttura_espositori = (qta30 * 50) + (qta50 * 75) + (qta100 * 100); // Costi base espositori

            // Retroilluminazione cost
            const costoRetroilluminazione = retroilluminazione * elements.sviluppoLineare * 10; // Stima costo retroilluminazione

            // Extra stand complesso
            const extraStandComplesso = parseFloat(data.extra_perc_complex || '0') * strutturaTerra / 100;

            // Calculate totali preventivi with margins
            const preventivoStruttura =
                calculatePreventivoWithMargin(strutturaTerra, data.marginalitaStruttura || 50) +
                calculatePreventivoWithMargin(costoStrutturaStorage, data.marginalitaStrutturaStorage || 50) +
                calculatePreventivoWithMargin(costo_struttura_desk, data.marginalitaStrutturaDesk || 50) +
                calculatePreventivoWithMargin(costo_struttura_espositori, data.marginalitaStrutturaEspositori || 50);

            const preventivoGrafiche =
                calculatePreventivoWithMargin(graficaCordino, data.marginalita_grafica || 50) +
                calculatePreventivoWithMargin(costoGraficaStorage, data.marginalitaGraficaStorage || 50) +
                calculatePreventivoWithMargin(costo_grafica_desk, data.marginalitaGraficaDesk || 50) +
                calculatePreventivoWithMargin(costo_grafica_espositori, data.marginalitaGraficaEspositori || 50);

            const preventivoRetroilluminazione = calculatePreventivoWithMargin(costoRetroilluminazione, data.marginalita_retroilluminazione || 50);
            const preventivoExtraComplessa = calculatePreventivoWithMargin(extraStandComplesso, data.marginalita_struttura || 50);

            const preventivoPremontaggi =
                calculatePreventivoWithMargin(premontaggio, data.marginalitaPremontaggio || 50) +
                calculatePreventivoWithMargin(costoPremontaggioStorage, data.marginalitaPremontaggioStorage || 50) +
                calculatePreventivoWithMargin(costo_premontaggioDesk, data.marginalitaPremontaggioDesk || 50) +
                calculatePreventivoWithMargin(costo_premontaggio_espositori, data.marginalitaPremontaggioEspositori || 50);

            // Calculate accessori using EXACT same values as TotalePreventivoSection
            const costiAccessoriStand = costs.costiAccessori;
            const costiAccessoriDesk = costs.costiAccessoriDesk || 0;
            const costiAccessoriEspositori = expositoreCostsLifted.accessoriEspositori;

            const preventivoAccessori =
                calculatePreventivoWithMargin(costiAccessoriStand, data.marginalitaAccessori || 50) +
                calculatePreventivoWithMargin(costiAccessoriDesk, data.marginalitaAccessoriDesk || 50) +
                calculatePreventivoWithMargin(costiAccessoriEspositori, data.marginalitaAccessoriEspositori || 50);

            // Services total
            const servicesTotal = serviziData.data ?
                (serviziData.data.preventivo_montaggio || 0) + (serviziData.data.preventivo_smontaggio || 0) : 0;

            // Altri beni/servizi total (this matches altriBeniServiziTotal from TotalePreventivoSection)
            const altriBeniServiziTotal = altriBeniData.data ?
                altriBeniData.data.reduce((sum: number, item: any) => {
                    const costoUnitario = item.costoUnitario || 0;
                    const quantita = item.quantita || 0;
                    const marginalita = item.marginalita || 0;
                    const costoTotale = costoUnitario * quantita;
                    return sum + costoTotale * (1 + marginalita / 100);
                }, 0) : 0;

            // Calculate final totals using values from TotalePreventivoSection
            const totaleCosti = calculatedTotals.totaleCosti;
            const totalePreventivo = calculatedTotals.totalePreventivo;

            const {
                error
            } = await supabase.from('preventivi').update({
                numeroPreventivo: data.numeroPreventivo,
                titolo: data.titolo,
                descrizione: data.descrizione,
                profondita: profondita,
                larghezza: larghezza,
                altezza: altezza,
                layout: data.layout,
                distribuzione: distribuzione,
                complessita: data.complessita,
                status: data.status,
                dataScadenza: data.dataScadenza || null,
                note: data.note,
                prospect_id: data.prospect_id || null,
                superficie_stampa: elements.superficieStampa,
                sviluppo_lineare: elements.sviluppoLineare,
                numeroPezzi: elements.numeroPezzi,
                costo_struttura: strutturaTerra,
                costo_grafica: graficaCordino,
                costo_premontaggio: premontaggio,
                costo_totale: costo_totale,
                costo_mq: costo_mq_value,
                costo_mc: costo_mc_value,
                totale: costo_totale,
                bifaccialita,
                retroilluminazione,
                premontaggio: data.premontaggio,
                // Stand margins
                marginalita_struttura: data.marginalita_struttura,
                marginalita_grafica: data.marginalita_grafica,
                marginalita_retroilluminazione: data.marginalita_retroilluminazione,
                marginalitaAccessori: data.marginalitaAccessori,
                marginalitaPremontaggio: data.marginalitaPremontaggio,
                // Storage margins
                marginalitaStrutturaStorage: data.marginalitaStrutturaStorage || 50,
                marginalitaGraficaStorage: data.marginalitaGraficaStorage || 50,
                marginalitaPremontaggioStorage: data.marginalitaPremontaggioStorage || 50,
                // Desk margins
                marginalitaStrutturaDesk: data.marginalitaStrutturaDesk || 50,
                marginalitaGraficaDesk: data.marginalitaGraficaDesk || 50,
                marginalitaPremontaggioDesk: data.marginalitaPremontaggioDesk || 50,
                marginalitaAccessoriDesk: data.marginalitaAccessoriDesk || 50,
                // Espositori margins
                marginalitaStrutturaEspositori: data.marginalitaStrutturaEspositori || 50,
                marginalitaGraficaEspositori: data.marginalitaGraficaEspositori || 50,
                marginalitaPremontaggioEspositori: data.marginalitaPremontaggioEspositori || 50,
                marginalitaAccessoriEspositori: data.marginalitaAccessoriEspositori || 50,
                // Stand accessories
                borsa_stand: parseInt(data.borsa_stand) || 0,
                baule_trolley: parseInt(data.baule_trolley) || 0,
                staffa_monitor: parseInt(data.staffa_monitor) || 0,
                mensola: parseInt(data.mensola) || 0,
                spot_light: parseInt(data.spot_light) || 0,
                kit_faro_50w: parseInt(data.kit_faro_50w) || 0,
                kit_faro_100w: parseInt(data.kit_faro_100w) || 0,
                quadro_elettrico_16a: parseInt(data.quadro_elettrico_16a) || 0,
                nicchia: parseInt(data.nicchia) || 0,
                pedana: parseInt(data.pedana) || 0,
                // Accessori stand dinamici
                accessori_stand_config: JSON.stringify(data.accessori_stand || {}),
                // Storage fields
                larg_storage: parseFloat(data.larg_storage) || 0,
                prof_storage: parseFloat(data.prof_storage) || 0,
                alt_storage: parseFloat(data.alt_storage) || 2.5,
                layout_storage: data.layout_storage || '0',
                numero_porte: data.numero_porte || '0',
                superficie_stampa_storage,
                sviluppo_metri_lineari_storage,
                numeroPezzi_storage,
                // Desk fields
                layoutDesk: JSON.stringify(formData.deskLayouts || [{
                    layout: '',
                    quantity: 0
                }]),
                // Desk accessories
                portaScorrevole: formData.portaScorrevole,
                ripianoSuperiore: formData.ripianoSuperiore,
                ripianoInferiore: formData.ripianoInferiore,
                tecaPlexiglass: formData.tecaPlexiglass,
                fronteLuminoso: formData.fronteLuminoso,
                borsa: formData.borsa,
                superficie_stampa_desk,
                numeroPezzi_desk,
                // Espositore fields
                qta_tipo30: qta30,
                qta_tipo50: qta50,
                qta_tipo100: qta100,
                numeroPezziEspositori,
                superficieStampaEspositori,
                ripiano30x30: parseInt(data.ripiano30x30) || 0,
                ripiano50x50: parseInt(data.ripiano50x50) || 0,
                ripiano100x50: parseInt(data.ripiano100x50) || 0,
                tecaPlexiglass30x30x30: parseInt(data.tecaPlexiglass30x30x30) || 0,
                tecaPlexiglass50x50x50: parseInt(data.tecaPlexiglass50x50x50) || 0,
                tecaPlexiglass100x50x30: parseInt(data.tecaPlexiglass100x50x30) || 0,
                retroilluminazione30x30x100h: parseInt(data.retroilluminazione30x30x100h) || 0,
                retroilluminazione50x50x100h: parseInt(data.retroilluminazione50x50x100h) || 0,
                retroilluminazione_100x50x100h: parseInt(data.retroilluminazione100x50x100h) || 0,
                borsa_espositori: parseInt(data.borsaEspositori) || 0,
                // Services fields
                servizio_montaggio_smontaggio: data.servizio_montaggio_smontaggio || false,
                servizio_certificazioni: data.servizio_certificazioni || false,
                servizio_istruzioni_assistenza: data.servizio_istruzioni_assistenza || false,
                // Extra stand complesso
                extra_perc_complex: parseFloat(data.extra_perc_complex || '0') || 0,
                extraStandComplesso: extraStandComplesso,
                // Total preventivo calculation
                totalePreventivo: totalePreventivo,
                totaleCosti: totaleCosti
            }).eq('id', editingPreventivo.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['preventivi']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-count']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-in-corso']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-valore']
            });
            queryClient.invalidateQueries({
                queryKey: ['ultimi-preventivi']
            });
            setIsDialogOpen(false);
            resetForm();
            toast({
                title: "Successo",
                description: "Preventivo aggiornato con successo"
            });
        },
        onError: error => {
            toast({
                title: "Errore",
                description: "Errore nell'aggiornamento del preventivo",
                variant: "destructive"
            });
            console.error('Error updating preventivo:', error);
        }
    });

    // Function to update margins based on prospect type
    const updateMarginsBasedOnProspect = (prospectId: string) => {
        const selectedProspect = prospects.find((p: any) => p.id === prospectId);
        if (selectedProspect && marginalitaProspect.length > 0) {
            const defaultMargin = marginalitaProspect.find((m: any) => m.tipoProspect === selectedProspect.tipoProspect);
            if (defaultMargin) {
                setFormData(prev => ({
                    ...prev,
                    prospectId: prospectId,
                    marginalitaStruttura: defaultMargin.marginalita,
                    marginalitaGrafica: defaultMargin.marginalita,
                    marginalitaRetroilluminazione: defaultMargin.marginalita,
                    marginalitaAccessori: defaultMargin.marginalita,
                    marginalitaPremontaggio: defaultMargin.marginalita,
                    // Storage margins
                    marginalitaStrutturaStorage: defaultMargin.marginalita,
                    marginalitaGraficaStorage: defaultMargin.marginalita,
                    marginalitaPremontaggioStorage: defaultMargin.marginalita,
                    // Desk margins
                    marginalitaStrutturaDesk: defaultMargin.marginalita,
                    marginalitaGraficaDesk: defaultMargin.marginalita,
                    marginalitaPremontaggioDesk: defaultMargin.marginalita,
                    marginalitaAccessoriDesk: defaultMargin.marginalita,
                    // Espositori margins
                    marginalitaStrutturaEspositori: defaultMargin.marginalita,
                    marginalitaGraficaEspositori: defaultMargin.marginalita,
                    marginalitaPremontaggioEspositori: defaultMargin.marginalita,
                    marginalitaAccessoriEspositori: defaultMargin.marginalita
                }));
                return;
            }
        }
        // Fallback if no default found
        setFormData(prev => ({
            ...prev,
            prospectId: prospectId
        }));
    };

    // Query per recuperare le marginalità per prospect
    const {
        data: marginalitaProspect = []
    } = useQuery({
        queryKey: ['marginalita-per-prospect'],
        queryFn: async () => {
            const {
                data,
                error
            } = await supabase.from('marginalita_per_prospect').select('*').eq('attivo', true);
            if (error) throw error;
            return data;
        },
        enabled: !!user
    });

    // Note: Default margins are only applied when creating new preventivo via updateMarginsBasedOnProspect function
    // When editing existing preventivo, all margin values are loaded from database and should not be overridden

    // Query per layout costs espositori
    const {
        data: layoutCostsEspositori = []
    } = useQuery({
        queryKey: ['costi-struttura-espositori-layout'],
        queryFn: () => PreventiviAPI.getCostiStrutturaEspositoriLayout({
            attivo: true, sortFields: [{
                field: "COSTI_STRUTTURA_ESPOSITORI_LAYOUT_ESPOSITORE",
                desc: false
            }]
        })
    });

    // Calcolo automatico dei costi storage (sempre aggiornato)
    const calculatedStorageCosts = React.useMemo(() => {
        if (!formData.larghezzaStorage || !formData.profonditaStorage || !formData.altezzaStorage || !parametri.length || !parametriCostiUnitari.length || !accessoriStand.length) {
            return {
                costoStrutturaStorage: 0,
                costoGraficaStorage: 0,
                costoPremontaggioStorage: 0,
                costoTotaleStorage: 0
            };
        }

        const larg = parseFloat(formData.larghezzaStorage);
        const prof = parseFloat(formData.profonditaStorage);
        const alt = parseFloat(formData.altezzaStorage);
        const layout = formData.layoutStorage;
        const distribuzione = parseInt(formData.distribuzione || '0');

        // Calcolo superficie di stampa storage
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

        // Calcolo sviluppo lineare storage
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

        // Calcolo numero pezzi storage
        const fattoreDistribuzione = profiliDistribuzioneMap[distribuzione] || 0;
        const numeroPezzi = sviluppo_lineare * fattoreDistribuzione;

        // Parametri necessari
        const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
        const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
        const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === formData.altezzaStorage);

        // Trova il costo della porta
        const portaAccessorio = accessoriStand.find(acc => acc.nome?.toLowerCase().includes('porta'));
        const costoPorta = portaAccessorio ? portaAccessorio.costoUnitario : 0;
        const numeroPorte = parseInt(formData.numeroPorte || '0') || 0;

        // Calcolo costi
        const costoStrutturaBase = costoAltezzaParam ? sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;
        const costoPorte = numeroPorte * costoPorta;
        const costoStrutturaStorage = costoStrutturaBase + costoPorte;

        const costoGraficaStorage = costoStampaParam ? superficie_stampa * (costoStampaParam.valore || 0) : 0;
        const costoPremontaggioStorage = costoPremontaggio ? numeroPezzi * (costoPremontaggio.valore || 0) : 0;
        const costoTotaleStorage = costoStrutturaStorage + costoGraficaStorage + costoPremontaggioStorage;

        return {
            costoStrutturaStorage,
            costoGraficaStorage,
            costoPremontaggioStorage,
            costoTotaleStorage
        };
    }, [
        formData.larghezzaStorage,
        formData.profonditaStorage,
        formData.altezzaStorage,
        formData.layoutStorage,
        formData.numeroPorte,
        formData.distribuzione,
        parametri,
        parametriCostiUnitari,
        profiliDistribuzioneMap,
        accessoriStand
    ]);

    // Calcolo automatico dei costi espositori (sempre aggiornato)
    const calculatedEspositoriCosts = React.useMemo(() => {
        const qta30 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
        const qta50 = parseInt(formData.qtaTipo50?.toString() || '0') || 0;
        const qta100 = parseInt(formData.qtaTipo100?.toString() || '0') || 0;

        if ((qta30 + qta50 + qta100) === 0 || !parametriCostiUnitari.length || !layoutCostsEspositori.length) {
            return {
                strutturaEspositori: 0,
                graficaEspositori: 0,
                premontaggioEspositori: 0,
                accessoriEspositori: 0,
                costoTotaleEspositori: 0
            };
        }

        // Calcolo elementi fisici espositori
        const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
        const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;

        // Calcolo costi struttura
        const layoutCost30 = layoutCostsEspositori.find(l => l.layoutEspositore === '30');
        const layoutCost50 = layoutCostsEspositori.find(l => l.layoutEspositore === '50');
        const layoutCost100 = layoutCostsEspositori.find(l => l.layoutEspositore === '100');

        const strutturaEspositori =
            qta30 * (layoutCost30?.costoUnitario || 0) +
            qta50 * (layoutCost50?.costoUnitario || 0) +
            qta100 * (layoutCost100?.costoUnitario || 0);

        // Calcolo costi grafiche
        const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
        const graficaEspositori = costoStampaParam ? superficieStampaEspositori * (costoStampaParam.valore || 0) : 0;

        // Calcolo costi premontaggio
        const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
        const premontaggioEspositori = costoPremontaggio ? numeroPezziEspositori * (costoPremontaggio.valore || 0) : 0;

        // Calcolo costi accessori
        let accessoriEspositori = 0;
        if (accessoriEspositori && accessoriEspositoriDB.length > 0) {
            const getAccessoryPrice = (name: string): number => {
                const accessory = accessoriEspositoriDB.find(item => item.nome === name);
                return accessory ? Number(accessory.costoUnitario) : 0;
            };

            accessoriEspositori += (formData.ripiano30x30 || 0) * getAccessoryPrice('Ripiano 30x30');
            accessoriEspositori += (formData.ripiano50x50 || 0) * getAccessoryPrice('Ripiano 50x50');
            accessoriEspositori += (formData.ripiano100x50 || 0) * getAccessoryPrice('Ripiano 100x50');
            accessoriEspositori += (formData.tecaPlexiglass30x30x30 || 0) * getAccessoryPrice('Teca in plexiglass 30x30x30');
            accessoriEspositori += (formData.tecaPlexiglass50x50x50 || 0) * getAccessoryPrice('Teca in plexiglass 50x50x50');
            accessoriEspositori += (formData.tecaPlexiglass100x50x30 || 0) * getAccessoryPrice('Teca in plexiglass 100x50x30');
            accessoriEspositori += (formData.retroilluminazione30x30x100h || 0) * getAccessoryPrice('Retroilluminazione 30x30x100 H');
            accessoriEspositori += (formData.retroilluminazione50x50x100h || 0) * getAccessoryPrice('Retroilluminazione 50x50x100 H');
            accessoriEspositori += (formData.retroilluminazione100x50x100h || 0) * getAccessoryPrice('Retroilluminazione 100x50x100 H');
            accessoriEspositori += (formData.borsaEspositori || 0) * getAccessoryPrice('Borsa');
        }

        const costoTotaleEspositori = strutturaEspositori + graficaEspositori + premontaggioEspositori + accessoriEspositori;

        return {
            strutturaEspositori,
            graficaEspositori,
            premontaggioEspositori,
            accessoriEspositori,
            costoTotaleEspositori
        };
    }, [
        formData.qtaTipo30,
        formData.qtaTipo50,
        formData.qtaTipo100,
        formData.ripiano30x30,
        formData.ripiano50x50,
        formData.ripiano100x50,
        formData.tecaPlexiglass30x30x30,
        formData.tecaPlexiglass50x50x50,
        formData.tecaPlexiglass100x50x30,
        formData.retroilluminazione30x30x100h,
        formData.retroilluminazione50x50x100h,
        formData.retroilluminazione100x50x100h,
        formData.borsaEspositori,
        parametriCostiUnitari,
        layoutCostsEspositori,
        accessoriEspositoriDB
    ]);

    // Calcolo automatico dei costi desk (sempre aggiornato)
    const calculatedDeskCosts = React.useMemo(() => {
        if (!accessoriDesk || !costiStrutturaDesk || !parametriCostiUnitari.length) {
            return {
                strutturaTerra: 0,
                graficaCordino: 0,
                premontaggio: 0,
                accessori: 0,
                totale: 0
            };
        }

        const deskLayoutsArray = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
            try {
                return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
            } catch {
                return [];
            }
        })();

        // Costo struttura desk
        const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: any) => {
            const costoLayout = costiStrutturaDesk?.find((c: any) => c.layoutDesk === config.layout);
            return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
        }, 0);

        // Grafica desk
        const superficie_stampa_desk = deskLayoutsArray.reduce((total, config: any) => {
            const {layout, quantity} = config;
            if (!layout || !quantity) return total;
            switch (layout) {
                case "50":
                    return total + 1.5 * quantity;
                case "100":
                    return total + 2 * quantity;
                case "150":
                    return total + 2.5 * quantity;
                case "200":
                    return total + 3 * quantity;
                default:
                    return total;
            }
        }, 0);

        const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
        const graficaCordinoDesk = costoStampaParam ? superficie_stampa_desk * (costoStampaParam.valore || 0) : 0;

        // Premontaggio desk
        const numeroPezzi_desk = deskLayoutsArray.reduce((total, config: any) => {
            const {layout, quantity} = config;
            if (!layout || !quantity) return total;
            switch (layout) {
                case "50":
                case "100":
                case "150":
                    return total + 12 * quantity;
                case "200":
                    return total + 20 * quantity;
                default:
                    return total;
            }
        }, 0);

        const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
        const premontaggioDesk = costoPremontaggio ? numeroPezzi_desk * (costoPremontaggio.valore || 0) : 0;

        // Accessori desk
        const costiAccessoriDesk =
            (formData.portaScorrevole || 0) * (accessoriDesk.find(a => a.nome === 'Porta scorrevole con chiave')?.costoUnitario || 0) +
            (formData.ripianoSuperiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Superiore L 100')?.costoUnitario || 0) +
            (formData.ripianoInferiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Inferiore L 100')?.costoUnitario || 0) +
            (formData.tecaPlexiglass || 0) * (accessoriDesk.find(a => a.nome === 'Teca in plexiglass')?.costoUnitario || 0) +
            (formData.fronteLuminoso || 0) * (accessoriDesk.find(a => a.nome === 'Fronte luminoso dim. 100x100')?.costoUnitario || 0) +
            (formData.borsa || 0) * (accessoriDesk.find(a => a.nome === 'Borsa')?.costoUnitario || 0);

        const totale_desk = strutturaTerraDesk + graficaCordinoDesk + premontaggioDesk + costiAccessoriDesk;

        return {
            strutturaTerra: strutturaTerraDesk,
            graficaCordino: graficaCordinoDesk,
            premontaggio: premontaggioDesk,
            accessori: costiAccessoriDesk,
            totale: totale_desk
        };
    }, [
        formData.deskLayouts,
        formData.portaScorrevole,
        formData.ripianoSuperiore,
        formData.ripianoInferiore,
        formData.tecaPlexiglass,
        formData.fronteLuminoso,
        formData.borsa,
        parametriCostiUnitari,
        accessoriDesk,
        costiStrutturaDesk
    ]);

    // Usa i costi calcolati o quelli lifted (dai componenti figli quando le sezioni sono aperte)
    const finalStorageCosts = storageCostsLifted.costoTotaleStorage > 0 ? storageCostsLifted : calculatedStorageCosts;
    const finalEspositoriCosts = expositoreCostsLifted.costoTotaleEspositori > 0 ? expositoreCostsLifted : calculatedEspositoriCosts;
    const finalDeskCosts = deskCostsLifted.totale > 0 ? deskCostsLifted : calculatedDeskCosts;

    // Calcolo dei costi automatici
    const calculateCosts = () => {
        if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione || !parametri.length) {
            return {
                strutturaTerra: 0,
                graficaCordino: 0,
                premontaggio: 0,
                retroilluminazione: 0,
                extraStandComplesso: 0,
                costiAccessori: 0,
                // Preventivo values
                preventivoStruttura: 0,
                preventivoGrafica: 0,
                preventivoRetroilluminazione: 0,
                preventivoAccessori: 0,
                preventivoPremontaggio: 0,
                // Summary values
                totalePreventivoStand: 0,
                totaleCostiStand: 0,
                marginalitaMedia: 0,
                totale: 0
            };
        }
        const elements = physicalElements;

        // Trova i parametri necessari
        const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
        const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
        const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valoreChiave === formData.altezza);

        // Struttura a terra: sviluppo lineare * costo per m/l in base all'altezza
        const strutturaTerra = costoAltezzaParam ? elements.sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;

        // Grafica con cordino cucito: superficie di stampa * costo stampa grafica al mq
        const graficaCordino = costoStampaParam ? elements.superficieStampa * (costoStampaParam.valore || 0) : 0;

        // Premontaggio: numero pezzi * costo premontaggio al pezzo (solo se premontaggio è attivo)
        const premontaggio = costoPremontaggio && formData.premontaggio ? elements.numeroPezzi * (costoPremontaggio.valore || 0) : 0;

        // Retroilluminazione: metri retroilluminazione * costo per m/l in base all'altezza
        const costoRetroilluminazioneParam = costiRetroilluminazione.find(c => c.altezza === parseFloat(formData.altezza));
        const retroilluminazione = costoRetroilluminazioneParam ? parseFloat(formData.retroilluminazione || '0') * (costoRetroilluminazioneParam.costoAlMetro || 0) : 0;

        // Extra per struttura complessa: percentuale sui costi di struttura a terra
        const extraPercComplex = formData.extraPercComplex || 0;
        const extraStandComplesso = strutturaTerra * (extraPercComplex / 100);

        // Calcolo costi accessori
        let costiAccessori = 0;
        if (formData.accessoriStand && accessoriStand.length > 0) {
            accessoriStand.forEach(accessorio => {
                const quantity = formData.accessoriStand[accessorio.id] || 0;
                costiAccessori += quantity * accessorio.costoUnitario;
            });
        }

        // Calcolo costi accessori desk
        let costiAccessoriDesk = 0;
        if (accessoriDesk && accessoriDesk.length > 0) {
            // Calcolo basato sui campi individuali del formData
            costiAccessoriDesk += (formData.portaScorrevole || 0) * (accessoriDesk.find(a => a.nome === 'Porta scorrevole con chiave')?.costoUnitario || 0);
            costiAccessoriDesk += (formData.ripianoSuperiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Superiore L 100')?.costoUnitario || 0);
            costiAccessoriDesk += (formData.ripianoInferiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Inferiore L 100')?.costoUnitario || 0);
            costiAccessoriDesk += (formData.tecaPlexiglass || 0) * (accessoriDesk.find(a => a.nome === 'Teca in plexiglass')?.costoUnitario || 0);
            costiAccessoriDesk += (formData.fronteLuminoso || 0) * (accessoriDesk.find(a => a.nome === 'Fronte luminoso dim. 100x100')?.costoUnitario || 0);
            costiAccessoriDesk += (formData.borsa || 0) * (accessoriDesk.find(a => a.nome === 'Borsa')?.costoUnitario || 0);
        }

        // Calcolo costi desk
        const costoStampaDeskParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
        const costoPremontaggerDesk = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');

        // Costo struttura desk
        const deskLayoutsArray = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
            try {
                return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
            } catch {
                return [];
            }
        })();
        const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: any) => {
            const costoLayout = costiStrutturaDesk?.find((c: any) => c.layoutDesk === config.layout);
            return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
        }, 0);

        // Grafica desk con cordino cucito
        const superficie_stampa_desk = calculateSuperficieStampaDesk();
        const graficaCordinoDesk = costoStampaDeskParam ? superficie_stampa_desk * (costoStampaDeskParam.valore || 0) : 0;

        // Premontaggio desk
        const numeroPezzi_desk = calculateNumeroPezziDesk();
        const premontaggioDesk = costoPremontaggerDesk ? numeroPezzi_desk * (costoPremontaggerDesk.valore || 0) : 0;
        const totale_desk = strutturaTerraDesk + graficaCordinoDesk + premontaggioDesk + costiAccessoriDesk;
        const totale = strutturaTerra + graficaCordino + premontaggio + retroilluminazione + costiAccessori + extraStandComplesso;

        // Calculate preventivos (quotes) based on costs and margins
        const preventivoStruttura = strutturaTerra * (1 + formData.marginalitaStruttura / 100);
        const preventivoGrafica = graficaCordino * (1 + formData.marginalitaGrafica / 100);
        const preventivoRetroilluminazione = retroilluminazione * (1 + formData.marginalitaRetroilluminazione / 100);
        const preventivoAccessori = costiAccessori * (1 + formData.marginalitaAccessori / 100);
        const preventivoPremontaggio = premontaggio * (1 + formData.marginalitaPremontaggio / 100);

        // Total preventivo and total costs for summary
        const totalePreventivoStand = preventivoStruttura + preventivoGrafica + preventivoRetroilluminazione + preventivoAccessori + preventivoPremontaggio + extraStandComplesso;
        const totaleCostiStand = strutturaTerra + graficaCordino + retroilluminazione + costiAccessori + premontaggio;
        const marginalitaMedia = totaleCostiStand > 0 ? (totalePreventivoStand - totaleCostiStand) / totaleCostiStand * 100 : 0;
        return {
            strutturaTerra,
            graficaCordino,
            premontaggio,
            retroilluminazione,
            extraStandComplesso,
            costiAccessori,
            // Preventivo values
            preventivoStruttura,
            preventivoGrafica,
            preventivoRetroilluminazione,
            preventivoAccessori,
            preventivoPremontaggio,
            // Summary values
            totalePreventivoStand,
            totaleCostiStand,
            marginalitaMedia,
            costiAccessoriDesk,
            costiDesk: {
                strutturaTerra: strutturaTerraDesk,
                graficaCordino: graficaCordinoDesk,
                premontaggio: premontaggioDesk,
                accessori: costiAccessoriDesk,
                totale: totale_desk
            },
            totale
        };
    };

    // Funzioni helper per calcolo desk
    const calculateSuperficieStampaDesk = () => {
        const arr = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
            try {
                return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
            } catch {
                return [];
            }
        })();
        if (!arr.length) return 0;
        return arr.reduce((total, config: any) => {
            const {
                layout,
                quantity
            } = config;
            if (!layout || !quantity) return total;
            switch (layout) {
                case "50":
                    return total + 1.5 * quantity;
                case "100":
                    return total + 2 * quantity;
                case "150":
                    return total + 2.5 * quantity;
                case "200":
                    return total + 3 * quantity;
                default:
                    return total;
            }
        }, 0);
    };
    const calculateNumeroPezziDesk = () => {
        const arr = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
            try {
                return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
            } catch {
                return [];
            }
        })();
        if (!arr.length) return 0;
        return arr.reduce((total, config: any) => {
            const {
                layout,
                quantity
            } = config;
            if (!layout || !quantity) return total;
            switch (layout) {
                case "50":
                case "100":
                case "150":
                    return total + 12 * quantity;
                case "200":
                    return total + 20 * quantity;
                default:
                    return total;
            }
        }, 0);
    };

    // Calcola gli elementi fisici per gli espositori
    const calculateExpositorePhysicalElements = () => {
        const qta30 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
        const qta50 = parseInt(formData.qtaTipo50?.toString() || '0') || 0;
        const qta100 = parseInt(formData.qtaTipo100?.toString() || '0') || 0;
        const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
        const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;
        return {
            numeroPezziEspositori,
            superficieStampaEspositori
        };
    };
    const espositorePhysicalElements = calculateExpositorePhysicalElements();
    const costs = calculateCosts();

    // Effect per ricalcolare i costi quando si apre un preventivo esistente
    React.useEffect(() => {
        if (!editingPreventivo || !parametriCostiUnitari.length || !accessoriEspositoriDB.length) return;

        // Calcola costi Storage
        const calculateStorageCostsOnLoad = () => {
            const larg = parseFloat(formData.larghezzaStorage) || 0;
            const prof = parseFloat(formData.profonditaStorage) || 0;
            const alt = parseFloat(formData.altezzaStorage) || 2.5;
            const layout = formData.layoutStorage || '0';
            const distribuzione = parseInt(formData.distribuzione) || 0;

            if (!larg || !prof || !distribuzione) {
                return {
                    costoStrutturaStorage: 0,
                    costoGraficaStorage: 0,
                    costoPremontaggioStorage: 0,
                    costoTotaleStorage: 0
                };
            }

            // Calcolo superficie di stampa
            let superficie_stampa = 0;
            if (layout === "0") {
                superficie_stampa = (2 * larg + 2 * prof) * alt;
            } else if (layout === "1") {
                superficie_stampa = (2 * larg + 2 * prof) * alt + 2;
            } else if (layout === "2") {
                superficie_stampa = (larg + prof) * alt + 2;
            }

            // Calcolo sviluppo lineare
            let sviluppo_lineare = 0;
            if (layout === "0") {
                sviluppo_lineare = larg + prof;
            } else if (layout === "1") {
                sviluppo_lineare = 2 * larg + 2 * prof;
            } else if (layout === "2") {
                sviluppo_lineare = larg + prof + 1;
            }

            const numeroPezzi = sviluppo_lineare * distribuzione;

            // Trova i parametri di costo
            const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
            const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
            const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === alt.toString());

            const costoStrutturaStorage = costoAltezzaParam ? sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;
            const costoGraficaStorage = costoStampaParam ? superficie_stampa * (costoStampaParam.valore || 0) : 0;
            const costoPremontaggioStorage = costoPremontaggio ? numeroPezzi * (costoPremontaggio.valore || 0) : 0;
            const costoTotaleStorage = costoStrutturaStorage + costoGraficaStorage + costoPremontaggioStorage;

            return {
                costoStrutturaStorage,
                costoGraficaStorage,
                costoPremontaggioStorage,
                costoTotaleStorage
            };
        };

        // Calcola costi Espositori
        const calculateEspositoriCostsOnLoad = () => {
            const qta30 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
            const qta50 = parseInt(formData.qtaTipo50?.toString() || '0') || 0;
            const qta100 = parseInt(formData.qtaTipo100?.toString() || '0') || 0;

            if (!qta30 && !qta50 && !qta100) {
                return {
                    strutturaEspositori: 0,
                    graficaEspositori: 0,
                    premontaggioEspositori: 0,
                    accessoriEspositori: 0,
                    costoTotaleEspositori: 0
                };
            }

            // Calcolo elementi fisici
            const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
            const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;

            // Trova parametri di costo per struttura
            const costoStruttura30 = layoutCostsEspositori?.find(c => c.layoutEspositore === '30x30x100h');
            const costoStruttura50 = layoutCostsEspositori?.find(c => c.layoutEspositore === '50x50x100h');
            const costoStruttura100 = layoutCostsEspositori?.find(c => c.layoutEspositore === '100x50x100h');

            const strutturaEspositori = (qta30 * (costoStruttura30?.costoUnitario || 0)) +
                (qta50 * (costoStruttura50?.costoUnitario || 0)) +
                (qta100 * (costoStruttura100?.costoUnitario || 0));

            const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
            const graficaEspositori = costoStampaParam ? superficieStampaEspositori * (costoStampaParam.valore || 0) : 0;

            const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
            const premontaggioEspositori = costoPremontaggio ? numeroPezziEspositori * (costoPremontaggio.valore || 0) : 0;

            // Calcolo accessori espositori
            const accessoriEspositori =
                (parseInt(formData.ripiano30x30?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Ripiano 30x30')?.costoUnitario || 0)) +
                (parseInt(formData.ripiano50x50?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Ripiano 50x50')?.costoUnitario || 0)) +
                (parseInt(formData.ripiano100x50?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Ripiano 100x50')?.costoUnitario || 0)) +
                (parseInt(formData.tecaPlexiglass30x30x30?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Teca plexiglass 30x30x30')?.costoUnitario || 0)) +
                (parseInt(formData.tecaPlexiglass50x50x50?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Teca plexiglass 50x50x50')?.costoUnitario || 0)) +
                (parseInt(formData.tecaPlexiglass100x50x30?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Teca plexiglass 100x50x30')?.costoUnitario || 0)) +
                (parseInt(formData.retroilluminazione30x30x100h?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Retroilluminazione 30x30x100h')?.costoUnitario || 0)) +
                (parseInt(formData.retroilluminazione50x50x100h?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Retroilluminazione 50x50x100h')?.costoUnitario || 0)) +
                (parseInt(formData.retroilluminazione100x50x100h?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Retroilluminazione 100x50x100h')?.costoUnitario || 0)) +
                (parseInt(formData.borsaEspositori?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Borsa')?.costoUnitario || 0));

            const costoTotaleEspositori = strutturaEspositori + graficaEspositori + premontaggioEspositori + accessoriEspositori;

            return {
                strutturaEspositori,
                graficaEspositori,
                premontaggioEspositori,
                accessoriEspositori,
                costoTotaleEspositori
            };
        };

        // Calcola costi Desk
        const calculateDeskCostsOnLoad = () => {
            if (!accessoriDesk || !costiStrutturaDesk) {
                return {
                    strutturaTerra: 0,
                    graficaCordino: 0,
                    premontaggio: 0,
                    accessori: 0,
                    totale: 0
                };
            }

            const deskLayoutsArray = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
                try {
                    return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
                } catch {
                    return [];
                }
            })();

            // Costo struttura desk
            const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: any) => {
                const costoLayout = costiStrutturaDesk?.find((c: any) => c.layoutDesk === config.layout);
                return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
            }, 0);

            // Grafica desk
            const superficie_stampa_desk = deskLayoutsArray.reduce((total, config: any) => {
                const {layout, quantity} = config;
                if (!layout || !quantity) return total;
                switch (layout) {
                    case "50":
                        return total + 1.5 * quantity;
                    case "100":
                        return total + 2 * quantity;
                    case "150":
                        return total + 2.5 * quantity;
                    case "200":
                        return total + 3 * quantity;
                    default:
                        return total;
                }
            }, 0);

            const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
            const graficaCordinoDesk = costoStampaParam ? superficie_stampa_desk * (costoStampaParam.valore || 0) : 0;

            // Premontaggio desk
            const numeroPezzi_desk = deskLayoutsArray.reduce((total, config: any) => {
                const {layout, quantity} = config;
                if (!layout || !quantity) return total;
                switch (layout) {
                    case "50":
                    case "100":
                    case "150":
                        return total + 12 * quantity;
                    case "200":
                        return total + 20 * quantity;
                    default:
                        return total;
                }
            }, 0);

            const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
            const premontaggioDesk = costoPremontaggio ? numeroPezzi_desk * (costoPremontaggio.valore || 0) : 0;

            // Accessori desk
            const costiAccessoriDesk =
                (formData.portaScorrevole || 0) * (accessoriDesk.find(a => a.nome === 'Porta scorrevole con chiave')?.costoUnitario || 0) +
                (formData.ripianoSuperiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Superiore L 100')?.costoUnitario || 0) +
                (formData.ripianoInferiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Inferiore L 100')?.costoUnitario || 0) +
                (formData.tecaPlexiglass || 0) * (accessoriDesk.find(a => a.nome === 'Teca in plexiglass')?.costoUnitario || 0) +
                (formData.fronteLuminoso || 0) * (accessoriDesk.find(a => a.nome === 'Fronte luminoso dim. 100x100')?.costoUnitario || 0) +
                (formData.borsa || 0) * (accessoriDesk.find(a => a.nome === 'Borsa')?.costoUnitario || 0);

            const totale_desk = strutturaTerraDesk + graficaCordinoDesk + premontaggioDesk + costiAccessoriDesk;

            return {
                strutturaTerra: strutturaTerraDesk,
                graficaCordino: graficaCordinoDesk,
                premontaggio: premontaggioDesk,
                accessori: costiAccessoriDesk,
                totale: totale_desk
            };
        };

        // Aggiorna i costi solo se abbiamo tutti i dati necessari
        if (parametri.length > 0) {
            const storageCosts = calculateStorageCostsOnLoad();
            const espositoriCosts = calculateEspositoriCostsOnLoad();
            const deskCosts = calculateDeskCostsOnLoad();

            setStorageCostsLifted(storageCosts);
            setExpositoreCostsLifted(espositoriCosts);
            setDeskCostsLifted(deskCosts);
        }
    }, [editingPreventivo, formData, parametriCostiUnitari, parametri, accessoriEspositoriDB, layoutCostsEspositori, accessoriDesk, costiStrutturaDesk]);

    // Mutation per creare un nuovo preventivo
    const createPreventivoMutation = useMutation({
        mutationFn: async (data: any) => {
            if (!user) throw new Error('User not authenticated');

            // Calcoli automatici
            const profondita = parseFloat(data.profondita);
            const larghezza = parseFloat(data.larghezza);
            const altezza = parseFloat(data.altezza);
            const distribuzione = parseInt(data.distribuzione);
            const bifaccialita = parseFloat(data.bifaccialita ?? '0') || 0;
            const retroilluminazione = parseFloat(data.retroilluminazione ?? '0') || 0;

            // Calcolo elementi fisici
            const elements = calculatePhysicalElements(profiliDistribuzioneMap);
            const superficie = larghezza * profondita;
            const volume = superficie * altezza;

            // Calcolo dei costi usando i parametri
            const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
            const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
            const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === data.altezza);
            const strutturaTerra = costoAltezzaParam ? elements.sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;
            const graficaCordino = costoStampaParam ? elements.superficieStampa * (costoStampaParam.valore || 0) : 0;
            const premontaggio = costoPremontaggio && data.premontaggio ? elements.numeroPezzi * (costoPremontaggio.valore || 0) : 0;
            const costo_totale = strutturaTerra + graficaCordino + premontaggio;
            const superficie_mq = superficie / 10000; // Conversione da cm² a m²
            const volume_mc = volume / 1000000; // Conversione da cm³ a m³

            // Evita overflow su colonne numeric(10,2)
            const MAX_NUMERIC = 99999999.99;
            let costo_mq_value = superficie_mq > 0 ? costo_totale / superficie_mq : 0;
            let costo_mc_value = volume_mc > 0 ? costo_totale / volume_mc : 0;
            if (!isFinite(costo_mq_value) || Math.abs(costo_mq_value) > MAX_NUMERIC) costo_mq_value = MAX_NUMERIC;
            if (!isFinite(costo_mc_value) || Math.abs(costo_mc_value) > MAX_NUMERIC) costo_mc_value = MAX_NUMERIC;

            // Calcoli Storage
            let superficie_stampa_storage = 0;
            let sviluppo_metri_lineari_storage = 0;
            let numeroPezzi_storage = 0;
            if (data.larg_storage && data.prof_storage && data.alt_storage && data.layout_storage) {
                const larg = parseFloat(data.larg_storage);
                const prof = parseFloat(data.prof_storage);
                const alt = parseFloat(data.alt_storage);
                const layout = data.layout_storage;

                // Calcolo superficie di stampa storage
                if (layout === "0") {
                    superficie_stampa_storage = (2 * larg + 2 * prof) * alt;
                } else if (layout === "1") {
                    superficie_stampa_storage = (2 * larg + 2 * prof) * alt + 2;
                } else if (layout === "2") {
                    superficie_stampa_storage = (larg + prof) * alt + 2;
                }

                // Calcolo sviluppo in metri lineari storage
                if (layout === "0") {
                    sviluppo_metri_lineari_storage = larg + prof;
                } else if (layout === "1") {
                    sviluppo_metri_lineari_storage = 2 * larg + 2 * prof;
                } else if (layout === "2") {
                    sviluppo_metri_lineari_storage = larg + prof + 1;
                }

                // Numero pezzi storage basato su distribuzione
                numeroPezzi_storage = sviluppo_metri_lineari_storage * distribuzione;
            }

            // Calcoli Desk
            let superficie_stampa_desk = 0;
            let numeroPezzi_desk = 0;
            if (data.desk_qta && data.layoutDesk) {
                const qta = parseInt(data.desk_qta);
                const layout = data.layoutDesk;

                // Calcolo superficie di stampa desk
                if (layout === "50") {
                    superficie_stampa_desk = 1.5 * qta;
                } else if (layout === "100") {
                    superficie_stampa_desk = 2 * qta;
                } else if (layout === "150") {
                    superficie_stampa_desk = 2.5 * qta;
                } else if (layout === "200") {
                    superficie_stampa_desk = 3 * qta;
                }

                // Calcolo numero di pezzi desk
                if (layout === "50" || layout === "100" || layout === "150") {
                    numeroPezzi_desk = 12 * qta;
                } else if (layout === "200") {
                    numeroPezzi_desk = 20 * qta;
                }
            }

            // Calcoli Espositori
            const qta30 = parseInt(data.qta_tipo30) || 0;
            const qta50 = parseInt(data.qta_tipo50) || 0;
            const qta100 = parseInt(data.qta_tipo100) || 0;
            const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
            const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;

            // Calcolo del totale preventivo (con margini applicati)
            const calculatePreventivoWithMargin = (cost: number, margin: number) => {
                return cost * (1 + margin / 100);
            };

            // Calculate additional costs for storage, desk, espositori
            // Storage costs
            const costoGraficaStorage = costoStampaParam ? superficie_stampa_storage * (costoStampaParam.valore || 0) : 0;
            const costoPremontaggioStorage = costoPremontaggio && data.premontaggio ? numeroPezzi_storage * (costoPremontaggio.valore || 0) : 0;
            const costoStrutturaStorage = sviluppo_metri_lineari_storage * (costoAltezzaParam?.valore || 0);

            // Desk costs
            const costo_grafica_desk = costoStampaParam ? superficie_stampa_desk * (costoStampaParam.valore || 0) : 0;
            const costo_premontaggioDesk = costoPremontaggio && data.premontaggio ? numeroPezzi_desk * (costoPremontaggio.valore || 0) : 0;
            const costo_struttura_desk = numeroPezzi_desk * 0.5; // Assumo un costo base per desk

            // Espositori costs
            const costo_grafica_espositori = costoStampaParam ? superficieStampaEspositori * (costoStampaParam.valore || 0) : 0;
            const costo_premontaggio_espositori = costoPremontaggio && data.premontaggio ? numeroPezziEspositori * (costoPremontaggio.valore || 0) : 0;
            const costo_struttura_espositori = (qta30 * 50) + (qta50 * 75) + (qta100 * 100); // Costi base espositori

            // Retroilluminazione cost
            const costoRetroilluminazione = retroilluminazione * elements.sviluppo_lineare * 10; // Stima costo retroilluminazione

            // Extra stand complesso
            const extraStandComplesso = parseFloat(data.extra_perc_complex || '0') * strutturaTerra / 100;

            // Calculate totali preventivi with margins (per nuovo preventivo, servizi e altri beni/servizi sono 0)
            const preventivoStruttura =
                calculatePreventivoWithMargin(strutturaTerra, data.marginalita_struttura || 50) +
                calculatePreventivoWithMargin(costoStrutturaStorage, data.marginalitaStrutturaStorage || 50) +
                calculatePreventivoWithMargin(costo_struttura_desk, data.marginalitaStrutturaDesk || 50) +
                calculatePreventivoWithMargin(costo_struttura_espositori, data.marginalitaStrutturaEspositori || 50);

            const preventivoGrafiche =
                calculatePreventivoWithMargin(graficaCordino, data.marginalita_grafica || 50) +
                calculatePreventivoWithMargin(costoGraficaStorage, data.marginalitaGraficaStorage || 50) +
                calculatePreventivoWithMargin(costo_grafica_desk, data.marginalitaGraficaDesk || 50) +
                calculatePreventivoWithMargin(costo_grafica_espositori, data.marginalitaGraficaEspositori || 50);

            const preventivoRetroilluminazione = calculatePreventivoWithMargin(costoRetroilluminazione, data.marginalita_retroilluminazione || 50);
            const preventivoExtraComplessa = calculatePreventivoWithMargin(extraStandComplesso, data.marginalita_struttura || 50);

            const preventivoPremontaggi =
                calculatePreventivoWithMargin(premontaggio, data.marginalitaPremontaggio || 50) +
                calculatePreventivoWithMargin(costoPremontaggioStorage, data.marginalitaPremontaggioStorage || 50) +
                calculatePreventivoWithMargin(costo_premontaggioDesk, data.marginalitaPremontaggioDesk || 50) +
                calculatePreventivoWithMargin(costo_premontaggio_espositori, data.marginalitaPremontaggioEspositori || 50);

            // Calculate final totals using values from TotalePreventivoSection
            const totaleCosti = calculatedTotals.totaleCosti;
            const totalePreventivo = calculatedTotals.totalePreventivo;

            const {
                error
            } = await supabase.from('preventivi').insert({
                numeroPreventivo: data.numeroPreventivo,
                titolo: data.titolo,
                descrizione: data.descrizione,
                user_id: user.id,
                profondita: profondita,
                larghezza: larghezza,
                altezza: altezza,
                layout: data.layout,
                distribuzione: distribuzione,
                complessita: data.complessita,
                status: data.status,
                dataScadenza: data.dataScadenza || null,
                note: data.note,
                prospect_id: data.prospect_id || null,
                superficie_stampa: elements.superficieStampa,
                sviluppo_lineare: elements.sviluppoLineare,
                numeroPezzi: elements.numeroPezzi,
                costo_struttura: strutturaTerra,
                costo_grafica: graficaCordino,
                costo_premontaggio: premontaggio,
                costo_totale: costo_totale,
                costo_mq: costo_mq_value,
                costo_mc: costo_mc_value,
                costo_fisso: 0,
                totale: costo_totale,
                bifaccialita,
                retroilluminazione,
                // Stand margins
                marginalita_struttura: data.marginalita_struttura,
                marginalita_grafica: data.marginalita_grafica,
                marginalita_retroilluminazione: data.marginalita_retroilluminazione,
                marginalitaAccessori: data.marginalitaAccessori,
                marginalitaPremontaggio: data.marginalitaPremontaggio,
                // Storage margins
                marginalitaStrutturaStorage: data.marginalitaStrutturaStorage || 50,
                marginalitaGraficaStorage: data.marginalitaGraficaStorage || 50,
                marginalitaPremontaggioStorage: data.marginalitaPremontaggioStorage || 50,
                // Desk margins
                marginalitaStrutturaDesk: data.marginalitaStrutturaDesk || 50,
                marginalitaGraficaDesk: data.marginalitaGraficaDesk || 50,
                marginalitaPremontaggioDesk: data.marginalitaPremontaggioDesk || 50,
                marginalitaAccessoriDesk: data.marginalitaAccessoriDesk || 50,
                // Espositori margins
                marginalitaStrutturaEspositori: data.marginalitaStrutturaEspositori || 50,
                marginalitaGraficaEspositori: data.marginalitaGraficaEspositori || 50,
                marginalitaPremontaggioEspositori: data.marginalitaPremontaggioEspositori || 50,
                marginalitaAccessoriEspositori: data.marginalitaAccessoriEspositori || 50,
                // Stand accessories
                borsa_stand: parseInt(formData.borsaStand) || 0,
                baule_trolley: parseInt(formData.bauleTrolley) || 0,
                staffa_monitor: parseInt(formData.staffaMonitor) || 0,
                mensola: parseInt(formData.mensola) || 0,
                spot_light: parseInt(formData.spotLight) || 0,
                kit_faro_50w: parseInt(formData.kitFaro50w) || 0,
                kit_faro_100w: parseInt(formData.kitFaro100w) || 0,
                quadro_elettrico_16a: parseInt(formData.quadroElettrico16a) || 0,
                nicchia: parseInt(formData.nicchia) || 0,
                pedana: parseInt(formData.pedana) || 0,
                // Storage fields
                larg_storage: parseFloat(data.larg_storage) || 0,
                prof_storage: parseFloat(data.prof_storage) || 0,
                alt_storage: parseFloat(data.alt_storage) || 2.5,
                layout_storage: data.layout_storage || '0',
                numero_porte: data.numero_porte || '0',
                superficie_stampa_storage,
                sviluppo_metri_lineari_storage,
                numeroPezzi_storage,
                // Desk fields
                layoutDesk: JSON.stringify(data.deskLayouts || [{
                    layout: '50',
                    quantity: 0
                }, {
                    layout: '100',
                    quantity: 0
                }, {
                    layout: '150',
                    quantity: 0
                }, {
                    layout: '200',
                    quantity: 0
                }]),
                superficie_stampa_desk,
                numeroPezzi_desk,
                // Espositore fields
                qta_tipo30: qta30,
                qta_tipo50: qta50,
                qta_tipo100: qta100,
                numeroPezziEspositori,
                superficieStampaEspositori,
                ripiano30x30: parseInt(data.ripiano30x30) || 0,
                ripiano50x50: parseInt(data.ripiano50x50) || 0,
                ripiano100x50: parseInt(data.ripiano100x50) || 0,
                tecaPlexiglass30x30x30: parseInt(data.tecaPlexiglass30x30x30) || 0,
                tecaPlexiglass50x50x50: parseInt(data.tecaPlexiglass50x50x50) || 0,
                tecaPlexiglass100x50x30: parseInt(data.tecaPlexiglass100x50x30) || 0,
                retroilluminazione30x30x100h: parseInt(data.retroilluminazione30x30x100h) || 0,
                retroilluminazione50x50x100h: parseInt(data.retroilluminazione50x50x100h) || 0,
                retroilluminazione_100x50x100h: parseInt(data.retroilluminazione_100x50x100h) || 0,
                borsa_espositori: parseInt(data.borsa_espositori) || 0,
                // Services fields
                servizio_montaggio_smontaggio: data.servizio_montaggio_smontaggio || false,
                servizio_certificazioni: data.servizio_certificazioni || false,
                servizio_istruzioni_assistenza: data.servizio_istruzioni_assistenza || false,
                // Total preventivo calculation
                totalePreventivo: totalePreventivo,
                totaleCosti: totaleCosti
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['preventivi']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-count']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-in-corso']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-valore']
            });
            queryClient.invalidateQueries({
                queryKey: ['ultimi-preventivi']
            });
            setIsDialogOpen(false);
            resetForm();
            toast({
                title: "Successo",
                description: "Preventivo creato con successo"
            });
        },
        onError: error => {
            toast({
                title: "Errore",
                description: "Errore nella creazione del preventivo",
                variant: "destructive"
            });
            console.error('Error creating preventivo:', error);
        }
    });

    // Mutation per eliminare un preventivo
    const deletePreventivoMutation = useMutation({
        mutationFn: async (id: string) => {
            const {
                error
            } = await supabase.from('preventivi').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['preventivi']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-count']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-in-corso']
            });
            queryClient.invalidateQueries({
                queryKey: ['preventivi-valore']
            });
            queryClient.invalidateQueries({
                queryKey: ['ultimi-preventivi']
            });
            setDeletePreventivo(null);
            toast({
                title: "Successo",
                description: "Preventivo eliminato con successo"
            });
        },
        onError: error => {
            console.error('Error deleting preventivo:', error);
            toast({
                title: "Errore",
                description: "Errore durante l'eliminazione del preventivo",
                variant: "destructive"
            });
        }
    });

    const resetForm = () => {
        setFormData({
            numeroPreventivo: '',
            titolo: '',
            descrizione: '',
            prospectId: '',
            profondita: '',
            larghezza: '',
            altezza: '',
            layout: '',
            distribuzione: '',
            complessita: 'normale',
            status: 'bozza',
            dataScadenza: '',
            note: '',
            bifaccialita: '0',
            retroilluminazione: '',
            premontaggio: true,
            // Stand accessories
            borsaStand: '',
            bauleTrolley: '',
            staffaMonitor: '',
            mensola: '',
            spotLight: '',
            kitFaro50w: '',
            kitFaro100w: '',
            quadroElettrico16a: '',
            nicchia: '',
            pedana: '',
            // Storage fields
            larghezzaStorage: '',
            profonditaStorage: '',
            altezzaStorage: '',
            layoutStorage: '',
            numeroPorte: '',
            // Desk fields
            deskLayouts: [{
                layout: '50',
                quantity: 0
            }, {
                layout: '100',
                quantity: 0
            }, {
                layout: '150',
                quantity: 0
            }, {
                layout: '200',
                quantity: 0
            }],
            // Desk accessories
            portaScorrevole: 0,
            ripianoSuperiore: 0,
            ripianoInferiore: 0,
            tecaPlexiglass: 0,
            fronteLuminoso: 0,
            borsa: 0,
            // Espositore fields
            qtaTipo30: 0,
            qtaTipo50: 0,
            qtaTipo100: 0,
            ripiano30x30: 0,
            ripiano50x50: 0,
            ripiano100x50: 0,
            tecaPlexiglass30x30x30: 0,
            tecaPlexiglass50x50x50: 0,
            tecaPlexiglass100x50x30: 0,
            retroilluminazione30x30x100h: 0,
            retroilluminazione50x50x100h: 0,
            retroilluminazione100x50x100h: 0,
            borsaEspositori: 0,
            // Services fields
            servizioMontaggioSmontaggio: false,
            servizioCertificazioni: false,
            servizioIstruzioniAssistenza: false,
            // Complexity fields
            extraPercComplex: 0,
            costoRetroilluminazione: 0,
            // Stand margins
            marginalitaStruttura: 50,
            marginalitaGrafica: 50,
            marginalitaRetroilluminazione: 50,
            marginalitaAccessori: 50,
            marginalitaPremontaggio: 50,
            // Storage margins
            marginalitaStrutturaStorage: 50,
            marginalitaGraficaStorage: 50,
            marginalitaPremontaggioStorage: 50,
            // Desk margins
            marginalitaStrutturaDesk: 50,
            marginalitaGraficaDesk: 50,
            marginalitaPremontaggioDesk: 50,
            marginalitaAccessoriDesk: 50,
            // Espositori margins
            marginalitaStrutturaEspositori: 0,
            marginalitaGraficaEspositori: 0,
            marginalitaPremontaggioEspositori: 0,
            marginalitaAccessoriEspositori: 0,
            // Accessori stand dinamici
            accessoriStand: {}
        });
        setEditingPreventivo(null);
        setSectionsOpen({
            stand: false,
            storage: false,
            desk: false,
            espositori: false,
            servizi: false,
            altri_beni_servizi: false,
            condizioni_fornitura: false
        });
    };
    const openEditDialog = (preventivo: PreventivoBean) => {
        setEditingPreventivo(preventivo);
        setFormData({
            numeroPreventivo: preventivo.numeroPreventivo,
            titolo: preventivo.titolo,
            descrizione: preventivo.descrizione || '',
            prospectId: preventivo.prospect.id || '',
            profondita: preventivo.profondita.toString(),
            larghezza: preventivo.larghezza.toString(),
            altezza: preventivo.altezza.toString(),
            layout: preventivo.layout,
            distribuzione: preventivo.distribuzione.toString(),
            complessita: preventivo.complessita || 'normale',
            status: preventivo.status,
            dataScadenza: preventivo.dataScadenza || '',
            note: preventivo.note || '',
            bifaccialita: preventivo.bifaccialita?.toString() || '0',
            retroilluminazione: preventivo.retroilluminazione?.toString() || '',
            premontaggio: preventivo.premontaggio ?? true,
            // Stand accessories
            borsaStand: preventivo.borsaStandard?.toString() || '',
            bauleTrolley: preventivo.bauleTrolley?.toString() || '',
            staffaMonitor: preventivo.staffaMonitor?.toString() || '',
            mensola: (preventivo as any).mensola?.toString() || '',
            spotLight: (preventivo as any).spotLight?.toString() || '',
            kitFaro50w: (preventivo as any).kitFaro50w?.toString() || '',
            kitFaro100w: (preventivo as any).kitFaro100w?.toString() || '',
            quadroElettrico16a: (preventivo as any).quadroElettrico16a?.toString() || '',
            nicchia: (preventivo as any).nicchia?.toString() || '',
            pedana: (preventivo as any).pedana?.toString() || '',
            // Storage fields
            larghezzaStorage: (preventivo as any).larghezzaStorage?.toString() || '',
            profonditaStorage: (preventivo as any).profonditaStorage?.toString() || '',
            altezzaStorage: (preventivo as any).altezzaStorage?.toString() || '',
            layoutStorage: (preventivo as any).layoutStorage || '',
            numeroPorte: (preventivo as any).numeroPorte || '',
            // Desk fields
            deskLayouts: (() => {
                try {
                    if (preventivo.layoutDesk) return JSON.parse(preventivo.layoutDesk);
                    const v = preventivo.layoutDesk;
                    if (Array.isArray(v)) return v;
                    if (typeof v === 'string') return JSON.parse(v);
                    return [{
                        layout: '50',
                        quantity: 0
                    }, {
                        layout: '100',
                        quantity: 0
                    }, {
                        layout: '150',
                        quantity: 0
                    }, {
                        layout: '200',
                        quantity: 0
                    }];
                } catch {
                    return [{
                        layout: '50',
                        quantity: 0
                    }, {
                        layout: '100',
                        quantity: 0
                    }, {
                        layout: '150',
                        quantity: 0
                    }, {
                        layout: '200',
                        quantity: 0
                    }];
                }
            })(),
            // Desk accessories
            portaScorrevole: preventivo.portaScorrevole || 0,
            ripianoSuperiore: preventivo.ripianoSuperiore || 0,
            ripianoInferiore: preventivo.ripianoInferiore || 0,
            tecaPlexiglass: preventivo.tecaPlexiglass || 0,
            fronteLuminoso: preventivo.fronteLuminoso || 0,
            borsa: preventivo.borsa || 0,
            // Espositore fields
            qtaTipo30: preventivo.qtaTipo30 || 0,
            qtaTipo50: preventivo.qtaTipo50 || 0,
            qtaTipo100: preventivo.qtaTipo100 || 0,
            ripiano30x30: preventivo.ripiano30x30 || 0,
            ripiano50x50: preventivo.ripiano50x50 || 0,
            ripiano100x50: preventivo.ripiano100x50 || 0,
            tecaPlexiglass30x30x30: preventivo.tecaPlexiglass30x30x30 || 0,
            tecaPlexiglass50x50x50: preventivo.tecaPlexiglass50x50x50 || 0,
            tecaPlexiglass100x50x30: preventivo.tecaPlexiglass100x50x30 || 0,
            retroilluminazione30x30x100h: preventivo.retroilluminazione30x30x100h || 0,
            retroilluminazione50x50x100h: preventivo.retroilluminazione50x50x100h || 0,
            retroilluminazione100x50x100h: preventivo.retroilluminazione100x50x100h || 0,
            borsaEspositori: preventivo.borsaEspositori || 0,
            // Services
            servizioMontaggioSmontaggio: preventivo.servizioMontaggioSmontaggio || false,
            servizioCertificazioni: preventivo.servizioCertificazioni || false,
            servizioIstruzioniAssistenza: preventivo.servizioIstruzioniAssistenza || false,
            // Complexity fields
            extraPercComplex: preventivo.extraPercComplex || 0,
            costoRetroilluminazione: preventivo.costoRetroilluminazione || 0,
            // Stand margins
            marginalitaStruttura: preventivo.marginalitaStruttura,
            marginalitaGrafica: preventivo.marginalitaGrafica,
            marginalitaRetroilluminazione: preventivo.marginalitaRetroilluminazione,
            marginalitaAccessori: preventivo.marginalitaAccessori,
            marginalitaPremontaggio: preventivo.marginalitaPremontaggio,
            // Storage margins
            marginalitaStrutturaStorage: preventivo.marginalitaStrutturaStorage || 50,
            marginalitaGraficaStorage: preventivo.marginalitaGraficaStorage || 50,
            marginalitaPremontaggioStorage: preventivo.marginalitaPremontaggioStorage || 50,
            // Desk margins
            marginalitaStrutturaDesk: preventivo.marginalitaStrutturaDesk || 50,
            marginalitaGraficaDesk: preventivo.marginalitaGraficaDesk || 50,
            marginalitaPremontaggioDesk: preventivo.marginalitaPremontaggioDesk || 50,
            marginalitaAccessoriDesk: preventivo.marginalitaAccessoriDesk || 50,
            // Espositori margins
            marginalitaStrutturaEspositori: preventivo.marginalitaStrutturaEspositori || 0,
            marginalitaGraficaEspositori: preventivo.marginalitaGraficaEspositori || 0,
            marginalitaPremontaggioEspositori: preventivo.marginalitaPremontaggioEspositori || 0,
            marginalitaAccessoriEspositori: preventivo.marginalitaAccessoriEspositori || 0,
            // Accessori stand dinamici
            accessoriStand: (() => {
                try {
                    return JSON.parse(preventivo.accessoriStandConfig || '{}');
                } catch {
                    return {};
                }
            })()
        });
        setSectionsOpen({
            stand: false,
            storage: false,
            desk: false,
            espositori: false,
            servizi: false,
            altri_beni_servizi: false,
            condizioni_fornitura: false
        });
        setIsDialogOpen(true);
    };

    // Reopen specific preventivo when arriving from service configuration
    React.useEffect(() => {
        const state = (location as any).state as any;
        if (state?.openPreventivoId && preventivi.length) {
            const p = preventivi.find(x => x.id === state.openPreventivoId);
            if (p) {
                openEditDialog(p);
                setSectionsOpen({
                    stand: false,
                    storage: false,
                    desk: false,
                    espositori: false,
                    servizi: true,
                    altri_beni_servizi: false,
                    condizioni_fornitura: false
                });
                // Clear navigation state to avoid reopening on refresh
                window.history.replaceState({}, '', '/preventivi');
            }
        }
    }, [location, preventivi]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validazione base
        if (!formData.numeroPreventivo || !formData.titolo || !formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione) {
            toast({
                title: "Errore",
                description: "Compila tutti i campi obbligatori",
                variant: "destructive"
            });
            return;
        }
        if (editingPreventivo) {
            updatePreventivoMutation.mutate(formData);
        } else {
            createPreventivoMutation.mutate(formData);
        }
    };

    // Filtri
    const filteredPreventivi = preventivi.filter(preventivo => {
        const matchesSearch = preventivo.numeroPreventivo.toLowerCase().includes(searchTerm.toLowerCase()) || preventivo.titolo.toLowerCase().includes(searchTerm.toLowerCase()) || preventivo.prospect?.ragioneSociale?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || preventivo.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const statusMap = {
            bozza: {
                label: 'Bozza',
                variant: 'secondary' as const
            },
            inviato: {
                label: 'Inviato',
                variant: 'default' as const
            },
            accettato: {
                label: 'Accettato',
                variant: 'default' as const
            },
            rifiutato: {
                label: 'Rifiutato',
                variant: 'destructive' as const
            },
            in_revisione: {
                label: 'In Revisione',
                variant: 'outline' as const
            }
        };
        const config = statusMap[status as keyof typeof statusMap] || {
            label: status,
            variant: 'secondary' as const
        };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };
    return <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Preventivi</h2>
                <p className="text-muted-foreground">
                    Gestisci tutti i tuoi preventivi
                </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => {
                        setEditingPreventivo(null);
                        resetForm();
                        setIsDialogOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4"/>
                        Nuovo Preventivo
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingPreventivo ? 'Modifica Preventivo' : 'Nuovo Preventivo'}</DialogTitle>
                        <DialogDescription>
                            {editingPreventivo ? 'Modifica il preventivo esistente' : 'Crea un nuovo preventivo compilando le sezioni seguenti'}.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Sezione 1: Anagrafica Preventivo */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5"/>
                                <h3 className="text-lg font-semibold">1. Anagrafica Preventivo</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="numeroPreventivo">Numero Preventivo *</Label>
                                    <Input id="numeroPreventivo" value={formData.numeroPreventivo}
                                           onChange={e => setFormData({
                                               ...formData,
                                               numeroPreventivo: e.target.value
                                           })} placeholder="es. PREV-2024-001" required/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="titolo">Titolo *</Label>
                                    <Input id="titolo" value={formData.titolo} onChange={e => setFormData({
                                        ...formData,
                                        titolo: e.target.value
                                    })} placeholder="Titolo del preventivo" required/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="prospectId">Cliente</Label>
                                    <Select value={formData.prospectId} onValueChange={updateMarginsBasedOnProspect}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleziona un cliente"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {prospects.map(prospect => <SelectItem key={prospect.id}
                                                                                   value={prospect.id}>
                                                {prospect.ragioneSociale}
                                            </SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Stato</Label>
                                    <Select value={formData.status} onValueChange={value => setFormData({
                                        ...formData,
                                        status: value
                                    })}>
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bozza">Bozza</SelectItem>
                                            <SelectItem value="inviato">Inviato</SelectItem>
                                            <SelectItem value="in_revisione">In Revisione</SelectItem>
                                            <SelectItem value="accettato">Accettato</SelectItem>
                                            <SelectItem value="rifiutato">Rifiutato</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descrizione">Descrizione</Label>
                                <Textarea id="descrizione" value={formData.descrizione} onChange={e => setFormData({
                                    ...formData,
                                    descrizione: e.target.value
                                })} placeholder="Descrizione dettagliata del preventivo"/>
                            </div>
                        </div>

                        <Separator/>


                        {/* Sezione Stand - collassabile */}
                        <Collapsible open={sectionsOpen.stand} onOpenChange={open => setSectionsOpen(prev => ({
                            ...prev,
                            stand: open
                        }))}>
                            <div
                                className="bg-[hsl(var(--section-stand))] border border-[hsl(var(--section-stand-border))] rounded-lg overflow-hidden">
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost"
                                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-stand-border))] rounded-none border-0">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full bg-[hsl(var(--section-stand-foreground))]"></div>
                                            <span
                                                className="font-medium text-[hsl(var(--section-stand-foreground))]">Stand</span>
                                            <span
                                                className="ml-2 text-xs bg-[hsl(var(--section-stand-foreground))] text-[hsl(var(--section-stand))] px-2 py-1 rounded-full">
                          Principale
                        </span>
                                        </div>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-stand-foreground))] ${sectionsOpen.stand ? 'rotate-180' : ''}`}/>
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="border-t border-[hsl(var(--section-stand-border))] bg-card p-6">
                                        <StandSection formData={formData} setFormData={setFormData}
                                                      physicalElements={physicalElements} costs={costs}/>
                                    </div>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>

                        {/* Sezioni aggiuntive collassabili */}
                        <div className="space-y-3">
                            <Collapsible open={sectionsOpen.storage} onOpenChange={open => setSectionsOpen(prev => ({
                                ...prev,
                                storage: open
                            }))}>
                                <div
                                    className="bg-[hsl(var(--section-storage))] border border-[hsl(var(--section-storage-border))] rounded-lg overflow-hidden">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost"
                                                className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-storage-border))] rounded-none border-0">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full bg-[hsl(var(--section-storage-foreground))]"></div>
                                                <span
                                                    className="font-medium text-[hsl(var(--section-storage-foreground))]">Storage</span>
                                            </div>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-storage-foreground))] ${sectionsOpen.storage ? 'rotate-180' : ''}`}/>
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div
                                            className="border-t border-[hsl(var(--section-storage-border))] bg-card p-6">
                                            <StorageSection formData={formData} setFormData={setFormData}
                                                            profiliDistribuzioneMap={profiliDistribuzioneMap}
                                                            parametri={parametri} accessoriStand={accessoriStand}
                                                            onCostsChange={setStorageCostsLifted}/>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            <Collapsible open={sectionsOpen.desk} onOpenChange={open => setSectionsOpen(prev => ({
                                ...prev,
                                desk: open
                            }))}>
                                <div
                                    className="bg-[hsl(var(--section-desk))] border border-[hsl(var(--section-desk-border))] rounded-lg overflow-hidden">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost"
                                                className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-desk-border))] rounded-none border-0">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full bg-[hsl(var(--section-desk-foreground))]"></div>
                                                <span
                                                    className="font-medium text-[hsl(var(--section-desk-foreground))]">Desk</span>
                                            </div>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-desk-foreground))] ${sectionsOpen.desk ? 'rotate-180' : ''}`}/>
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="border-t border-[hsl(var(--section-desk-border))] bg-card p-6">
                                            <DeskSection data={{
                                                deskLayouts: formData.deskLayouts,
                                                portaScorrevole: formData.portaScorrevole,
                                                ripianoSuperiore: formData.ripianoSuperiore,
                                                ripianoInferiore: formData.ripianoInferiore,
                                                tecaPlexiglass: formData.tecaPlexiglass,
                                                fronteLuminoso: formData.fronteLuminoso,
                                                borsa: formData.borsa,
                                                marginalitaStrutturaDesk: formData.marginalitaStrutturaDesk,
                                                marginalitaGraficaDesk: formData.marginalitaGraficaDesk,
                                                marginalitaPremontaggioDesk: formData.marginalitaPremontaggioDesk,
                                                marginalitaAccessoriDesk: formData.marginalitaAccessoriDesk
                                            }} onChange={(field, value) => setFormData(prev => ({
                                                ...prev,
                                                [field]: value
                                            }))} parametri={parametri}
                                                         costiAccessori={calculateCosts().costiAccessoriDesk}
                                                         costiDesk={calculateCosts().costiDesk}/>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>
                            {/*
                            <Collapsible open={sectionsOpen.espositori} onOpenChange={open => setSectionsOpen(prev => ({
                                ...prev,
                                espositori: open
                            }))}>
                                <div
                                    className="bg-[hsl(var(--section-expo))] border border-[hsl(var(--section-expo-border))] rounded-lg overflow-hidden">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost"
                                                className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-expo-border))] rounded-none border-0">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full bg-[hsl(var(--section-expo-foreground))]"></div>
                                                <span
                                                    className="font-medium text-[hsl(var(--section-expo-foreground))]">Espositori/Plinto</span>
                                            </div>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-expo-foreground))] ${sectionsOpen.espositori ? 'rotate-180' : ''}`}/>
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="border-t border-[hsl(var(--section-expo-border))] bg-card p-6">
                                            <ExpositoreSection formData={{
                                                qtaTipo30: formData.qtaTipo30,
                                                qtaTipo50: formData.qtaTipo50,
                                                qtaTipo100: formData.qtaTipo100,
                                                ripiano30x30: formData.ripiano30x30,
                                                ripiano50x50: formData.ripiano50x50,
                                                ripiano100x50: formData.ripiano100x50,
                                                tecaPlexiglass30x30x30: formData.tecaPlexiglass30x30x30,
                                                tecaPlexiglass50x50x50: formData.tecaPlexiglass50x50x50,
                                                tecaPlexiglass100x50x30: formData.tecaPlexiglass100x50x30,
                                                retroilluminazione30x30x100h: formData.retroilluminazione30x30x100h,
                                                retroilluminazione50x50x100h: formData.retroilluminazione50x50x100h,
                                                retroilluminazione100x50x100h: formData.retroilluminazione100x50x100h,
                                                borsaEspositori: formData.borsaEspositori,
                                                marginalitaStrutturaEspositori: formData.marginalitaStrutturaEspositori,
                                                marginalitaGraficaEspositori: formData.marginalitaGraficaEspositori,
                                                marginalitaPremontaggioEspositori: formData.marginalitaPremontaggioEspositori,
                                                marginalitaAccessoriEspositori: formData.marginalitaAccessoriEspositori,
                                            }} setFormData={setFormData} physicalElements={espositorePhysicalElements}
                                                               onChange={(field, value) => setFormData(prev => ({
                                                                   ...prev,
                                                                   [field]: value
                                                               }))} costiEspositori={{
                                                strutturaEspositori: expositoreCostsLifted.strutturaEspositori,
                                                graficaEspositori: expositoreCostsLifted.graficaEspositori,
                                                premontaggioEspositori: expositoreCostsLifted.premontaggioEspositori,
                                                accessoriEspositori: expositoreCostsLifted.accessoriEspositori,
                                                totale: expositoreCostsLifted.costoTotaleEspositori
                                            }} onCostsChange={setExpositoreCostsLifted}/>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>*/}
                            {/*
                            <Collapsible open={sectionsOpen.servizi} onOpenChange={open => setSectionsOpen(prev => ({
                                ...prev,
                                servizi: open
                            }))}>
                                <div
                                    className="bg-[hsl(var(--section-complement))] border border-[hsl(var(--section-complement-border))] rounded-lg overflow-hidden">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost"
                                                className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-complement-border))] rounded-none border-0 px-[15px]">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full bg-[hsl(var(--section-complement-foreground))]"></div>
                                                <span
                                                    className="font-medium text-[hsl(var(--section-complement-foreground))]">Servizi</span>
                                            </div>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-complement-foreground))] ${sectionsOpen.servizi ? 'rotate-180' : ''}`}/>
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div
                                            className="border-t border-[hsl(var(--section-complement-border))] bg-card p-6">
                                            <ServicesSection formData={formData} setFormData={setFormData}
                                                             preventivo_id={editingPreventivo?.id}/>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>*/}
                            {/* Sezioni aggiuntive collassabili
                            <Collapsible open={sectionsOpen.altri_beni_servizi}
                                         onOpenChange={open => setSectionsOpen(prev => ({
                                             ...prev,
                                             altri_beni_servizi: open
                                         }))}>
                                <div
                                    className="bg-[hsl(var(--section-services))] border border-[hsl(var(--section-services-border))] rounded-lg overflow-hidden">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost"
                                                className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-services-border))] rounded-none border-0">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full bg-[hsl(var(--section-services-foreground))]"></div>
                                                <span
                                                    className="font-medium text-[hsl(var(--section-services-foreground))]">Altri Beni/Servizi</span>
                                            </div>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-services-foreground))] ${sectionsOpen.altri_beni_servizi ? 'rotate-180' : ''}`}/>
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div
                                            className="border-t border-[hsl(var(--section-services-border))] bg-card p-6 mx-0 my-0 px-[2px] py-[12px]">
                                            <AltriBeniServiziSection preventivoId={editingPreventivo?.id || ''}/>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>*/}

                            <Collapsible open={sectionsOpen.condizioni_fornitura}
                                         onOpenChange={open => setSectionsOpen(prev => ({
                                             ...prev,
                                             condizioni_fornitura: open
                                         }))}>
                                <div
                                    className="bg-[hsl(var(--section-conditions))] border border-[hsl(var(--section-conditions-border))] rounded-lg overflow-hidden">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost"
                                                className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-conditions-border))] rounded-none border-0">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full bg-[hsl(var(--section-conditions-foreground))]"></div>
                                                <span
                                                    className="font-medium text-[hsl(var(--section-conditions-foreground))]">Condizioni di fornitura</span>
                                            </div>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-conditions-foreground))] ${sectionsOpen.condizioni_fornitura ? 'rotate-180' : ''}`}/>
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div
                                            className="border-t border-[hsl(var(--section-conditions-border))] bg-card p-6">
                                            <CondizioniFornituraSection preventivoId={editingPreventivo?.id || ''}/>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>
                        </div>

                        {/* Sezione Totale Preventivo Fornitura */}
                        <TotalePreventivoSection
                            standCosts={{
                                strutturaTerra: costs.strutturaTerra,
                                graficaCordino: costs.graficaCordino,
                                retroilluminazione: costs.retroilluminazione,
                                extraStandComplesso: costs.extraStandComplesso,
                                costiAccessori: costs.costiAccessori,
                                premontaggio: costs.premontaggio,
                                totale: costs.totale
                            }}
                            standMargins={{
                                marginalitaStruttura: formData.marginalitaStruttura,
                                marginalitaGrafica: formData.marginalitaGrafica,
                                marginalitaRetroilluminazione: formData.marginalitaRetroilluminazione,
                                marginalitaAccessori: formData.marginalitaAccessori,
                                marginalitaPremontaggio: formData.marginalitaPremontaggio
                            }}
                            storageCosts={finalStorageCosts}
                            storageMargins={{
                                marginalitaStrutturaStorage: formData.marginalitaStrutturaStorage,
                                marginalitaGraficaStorage: formData.marginalitaGraficaStorage,
                                marginalitaPremontaggioStorage: formData.marginalitaPremontaggioStorage
                            }}
                            deskCosts={finalDeskCosts}
                            deskMargins={{
                                marginalitaStrutturaDesk: formData.marginalitaStrutturaDesk,
                                marginalitaGraficaDesk: formData.marginalitaGraficaDesk,
                                marginalitaPremontaggioDesk: formData.marginalitaPremontaggioDesk,
                                marginalitaAccessoriDesk: formData.marginalitaAccessoriDesk
                            }}
                            espositoriCosts={finalEspositoriCosts}
                            espositoriMargins={{
                                marginalitaStrutturaEspositori: formData.marginalitaStrutturaEspositori,
                                marginalitaGraficaEspositori: formData.marginalitaGraficaEspositori,
                                marginalitaPremontaggioEspositori: formData.marginalitaPremontaggioEspositori,
                                marginalitaAccessoriEspositori: formData.marginalitaAccessoriEspositori
                            }}
                            servicesTotal={(() => {
                                const costoMontaggio = formData.servizioMontaggioSmontaggio ? (preventivoServizi?.preventivo_montaggio || 0) + (preventivoServizi?.preventivo_smontaggio || 0) : 0;
                                const costoCertificazioni = formData.servizioCertificazioni ? serviceCosts?.['Costo_certificazione'] || 0 : 0;
                                const costoIstruzioni = formData.servizioIstruzioniAssistenza ? serviceCosts?.['Costo_istruzionieassistenza'] || 0 : 0;
                                return costoMontaggio + costoCertificazioni + costoIstruzioni;
                            })()}
                            servicesCost={(() => {
                                const costoMontaggio = formData.servizioMontaggioSmontaggio ? (preventivoServizi?.totale_costo_montaggio || 0) + (preventivoServizi?.totale_costo_smontaggio || 0) : 0;
                                return costoMontaggio
                            })()}

                            altriBeniServiziTotal={(altriBeniServizi || []).reduce((sum, item) => sum + (item.totale || 0), 0)}
                            altriBeniServiziCost={(altriBeniServizi || []).reduce((sum, item) => sum + ((item.costoUnitario || 0) * (item.quantita || 0)), 0)}
                            onTotalsCalculated={setCalculatedTotals}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dataScadenza">Data Scadenza</Label>
                                <Input id="dataScadenza" type="date" value={formData.dataScadenza}
                                       onChange={e => setFormData({
                                           ...formData,
                                           dataScadenza: e.target.value
                                       })}/>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note">Note</Label>
                            <Textarea id="note" value={formData.note} onChange={e => setFormData({
                                ...formData,
                                note: e.target.value
                            })} placeholder="Note aggiuntive"/>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Annulla
                            </Button>
                            <Button type="submit"
                                    disabled={createPreventivoMutation.isPending || updatePreventivoMutation.isPending}>
                                {editingPreventivo ? updatePreventivoMutation.isPending ? 'Aggiornamento...' : 'Aggiorna' : createPreventivoMutation.isPending ? 'Salvataggio...' : 'Salva'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5"/>
                    Elenco Preventivi
                </CardTitle>
                <CardDescription>
                    Gestisci e visualizza tutti i tuoi preventivi
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Cerca per numero, titolo o cliente..." value={searchTerm}
                               onChange={e => setSearchTerm(e.target.value)} className="pl-8"/>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtra per stato"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tutti gli stati</SelectItem>
                            <SelectItem value="bozza">Bozza</SelectItem>
                            <SelectItem value="inviato">Inviato</SelectItem>
                            <SelectItem value="in_revisione">In Revisione</SelectItem>
                            <SelectItem value="accettato">Accettato</SelectItem>
                            <SelectItem value="rifiutato">Rifiutato</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {filteredPreventivi.length === 0 ?
                    <div className="text-center py-6 text-muted-foreground">
                        Nessun preventivo trovato
                    </div> : <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numero</TableHead>
                                <TableHead>Titolo</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Dimensioni</TableHead>
                                <TableHead>Elementi Fisici</TableHead>
                                <TableHead>Totale</TableHead>
                                <TableHead>Stato</TableHead>
                                <TableHead>Data Creazione</TableHead>
                                <TableHead>Azioni</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPreventivi.map(preventivo => <TableRow key={preventivo.id}>
                                <TableCell className="font-medium">
                                    {preventivo.numeroPreventivo}
                                </TableCell>
                                <TableCell>{preventivo.titolo}</TableCell>
                                <TableCell>
                                    {preventivo.prospect?.ragioneSociale || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <div>{preventivo.profondita}×{preventivo.larghezza}×{preventivo.altezza}m</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <div>Stampa: {preventivo.superficieStampa?.toFixed(2)}m²</div>
                                        <div className="text-muted-foreground">
                                            {preventivo.sviluppoLineare?.toFixed(2)}m
                                            • {preventivo.numeroPezzi?.toFixed(0)}pz
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">
                                        €{preventivo.totalePreventivo?.toLocaleString('it-IT', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }) || '0'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(preventivo.status)}
                                </TableCell>
                                <TableCell>
                                    {new Date(preventivo.createdAt).toLocaleDateString('it-IT')}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(preventivo)}>
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="ghost" size="sm"
                                                onClick={() => setDeletePreventivo(preventivo)}
                                                className="text-destructive hover:text-destructive/90">
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>}
            </CardContent>
        </Card>

        {/* Alert Dialog per conferma cancellazione */}
        <AlertDialog open={!!deletePreventivo} onOpenChange={() => setDeletePreventivo(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sei sicuro di cancellare il preventivo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Questa azione non può essere annullata. Il preventivo "{deletePreventivo?.titolo}" verrà
                        eliminato definitivamente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => deletePreventivo && deletePreventivoMutation.mutate(deletePreventivo.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Elimina
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>;
};
export default Preventivi;
