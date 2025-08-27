import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, FileText, Calculator, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StandSection } from '@/components/StandSection';
import { StorageSection } from '@/components/StorageSection';
import { DeskSection } from '@/components/DeskSection';
import { ExpositoreSection } from '@/components/ExpositoreSection';
import { EmptySection } from '@/components/EmptySection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Preventivo {
  id: string;
  numero_preventivo: string;
  titolo: string;
  descrizione?: string;
  prospect_id?: string;
  profondita: number;
  larghezza: number;
  altezza: number;
  layout: string;
  distribuzione: number;
  complessita: string;
  superficie?: number;
  volume?: number;
  superficie_stampa?: number;
  sviluppo_lineare?: number;
  numero_pezzi?: number;
  costo_mq: number;
  costo_mc: number;
  costo_fisso: number;
  costo_struttura?: number;
  costo_grafica?: number;
  costo_premontaggio?: number;
  costo_totale?: number;
  totale?: number;
  status: string;
  data_scadenza?: string;
  note?: string;
  created_at: string;
  prospects?: {
    ragione_sociale: string;
  };
}

interface Prospect {
  id: string;
  ragione_sociale: string;
}

const Preventivi = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPreventivo, setEditingPreventivo] = useState<Preventivo | null>(null);
  const [deletePreventivo, setDeletePreventivo] = useState<Preventivo | null>(null);
  const [formData, setFormData] = useState({
    numero_preventivo: '',
    titolo: '',
    descrizione: '',
    prospect_id: '',
    profondita: '',
    larghezza: '',
    altezza: '',
    layout: '',
    distribuzione: '',
    complessita: 'normale',
    status: 'bozza',
    data_scadenza: '',
    note: '',
    bifaccialita: '0',
    retroilluminazione: '',
    // Stand accessories
    borsa_stand: '',
    baule_trolley: '',
    staffa_monitor: '',
    mensola: '',
    spot_light: '',
    kit_faro_50w: '',
    kit_faro_100w: '',
    quadro_elettrico_16a: '',
    nicchia: '',
    pedana: '',
    // Storage fields
    larg_storage: '',
    prof_storage: '',
    alt_storage: '',
    layout_storage: '',
    numero_porte: '',
    // Desk fields
    desk_qta: 1,
    layout_desk: '',
    porta_scorrevole: 0,
    ripiano_superiore: 0,
    ripiano_inferiore: 0,
    teca_plexiglass: 0,
    fronte_luminoso: 0,
    borsa: 0,
    // Espositore fields
    qta_tipo30: 0,
    qta_tipo50: 0,
    qta_tipo100: 0,
    ripiano_30x30: 0,
    ripiano_50x50: 0,
    ripiano_100x50: 0,
    teca_plexiglass_30x30x30: 0,
    teca_plexiglass_50x50x50: 0,
    teca_plexiglass_100x50x30: 0,
    retroilluminazione_30x30x100h: 0,
    retroilluminazione_50x50x100h: 0,
    retroilluminazione_100x50x100h: 0,
  });

  // State per controllare le sezioni collassabili
  const [sectionsOpen, setSectionsOpen] = useState({
    stand: true,
    storage: false,
    desk: false,
    espositori: false,
    complementi: false,
  });

  // Calcoli automatici degli elementi fisici
  const calculatePhysicalElements = (profiliDistribuzioneMap: Record<number, number>) => {
    if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione) {
      return {
        superficie_stampa: 0,
        superficie_mq: 0,
        sviluppo_lineare: 0,
        numero_pezzi: 0
      };
    }

    const profondita = parseFloat(formData.profondita);
    const larghezza = parseFloat(formData.larghezza);
    const altezza = parseFloat(formData.altezza);
    const distribuzione = parseInt(formData.distribuzione);
    const bifaccialita = parseInt(formData.bifaccialita);

    // Superficie di stampa
    let superficie_stampa = 0;
    switch (formData.layout) {
      case '4_lati':
        superficie_stampa = (2 * larghezza + 2 * profondita) * altezza + bifaccialita * altezza;
        break;
      case '3_lati':
        superficie_stampa = (larghezza + 2 * profondita) * altezza + bifaccialita * altezza + altezza;
        break;
      case '2_lati':
        superficie_stampa = (larghezza + profondita) * altezza + bifaccialita * altezza + altezza;
        break;
      case '1_lato':
        superficie_stampa = larghezza * altezza + bifaccialita * altezza + altezza;
        break;
      case '0_lati':
        superficie_stampa = 0;
        break;
    }

    // Superficie metri quadri
    const superficie_mq = larghezza * profondita;

    // Sviluppo lineare
    let sviluppo_lineare = 0;
    switch (formData.layout) {
      case '4_lati':
        sviluppo_lineare = 2 * larghezza + 2 * profondita;
        break;
      case '3_lati':
        sviluppo_lineare = larghezza + 2 * profondita;
        break;
      case '2_lati':
        sviluppo_lineare = larghezza + profondita;
        break;
      case '1_lato':
        sviluppo_lineare = larghezza;
        break;
      case '0_lati':
        sviluppo_lineare = 0;
        break;
    }

    // Numero di pezzi
    const fattoreDistribuzione = profiliDistribuzioneMap[distribuzione] || 0;
    const numero_pezzi = sviluppo_lineare * fattoreDistribuzione + bifaccialita * (distribuzione + 1);

    return {
      superficie_stampa,
      superficie_mq,
      sviluppo_lineare,
      numero_pezzi
    };
  };

  // physicalElements calcolati dopo il caricamento dei parametri

  // Query per recuperare i preventivi
  const { data: preventivi = [], isLoading } = useQuery({
    queryKey: ['preventivi'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('preventivi')
        .select(`
          *,
          prospects:prospect_id (ragione_sociale)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Preventivo[];
    },
    enabled: !!user,
  });

  // Query per recuperare i parametri
  const { data: parametri = [] } = useQuery({
    queryKey: ['parametri-for-preventivi'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('parametri')
        .select('*')
        .eq('user_id', user.id)
        .order('tipo', { ascending: true })
        .order('ordine', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Mappa dinamica profili per distribuzione dai parametri
  const profiliDistribuzioneMap = React.useMemo(() => {
    const map: Record<number, number> = {};
    for (const p of (parametri as any[])) {
      if (p.tipo === 'profili_distribuzione') {
        const key = parseInt((p.nome as string) || '', 10);
        if (!isNaN(key)) map[key] = Number(p.valore) || 0;
      }
    }
    return map;
  }, [parametri]);

  // Elementi fisici calcolati (dipendono dai parametri)
  const physicalElements = calculatePhysicalElements(profiliDistribuzioneMap);

  // Query per recuperare le anagrafiche
  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects-for-preventivi'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('prospects')
        .select('id, ragione_sociale')
        .eq('user_id', user.id)
        .order('ragione_sociale');
      
      if (error) throw error;
      return data as Prospect[];
    },
    enabled: !!user,
  });

  // Calcolo dei costi automatici
  const calculateCosts = () => {
    if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione || !parametri.length) {
      return {
        struttura_terra: 0,
        grafica_cordino: 0,
        premontaggio: 0,
        totale: 0
      };
    }

    const elements = physicalElements;
    
    // Trova i parametri necessari
    const costoStampaParam = parametri.find(p => p.tipo === 'costo_stampa');
    const costoPremontaggio = parametri.find(p => p.tipo === 'costo_premontaggio');
    const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === formData.altezza);

    // Struttura a terra: sviluppo lineare * costo per m/l in base all'altezza
    const struttura_terra = costoAltezzaParam ? 
      elements.sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;

    // Grafica con cordino cucito: superficie di stampa * costo stampa grafica al mq
    const grafica_cordino = costoStampaParam ? 
      elements.superficie_stampa * (costoStampaParam.valore || 0) : 0;

    // Premontaggio: numero pezzi * costo premontaggio al pezzo
    const premontaggio = costoPremontaggio ? 
      elements.numero_pezzi * (costoPremontaggio.valore || 0) : 0;

    const totale = struttura_terra + grafica_cordino + premontaggio;

    return {
      struttura_terra,
      grafica_cordino,
      premontaggio,
      totale
    };
  };

  // Calcola gli elementi fisici per gli espositori
  const calculateExpositorePhysicalElements = () => {
    const qta30 = parseInt(formData.qta_tipo30?.toString() || '0') || 0;
    const qta50 = parseInt(formData.qta_tipo50?.toString() || '0') || 0;
    const qta100 = parseInt(formData.qta_tipo100?.toString() || '0') || 0;

    const numero_pezzi_espositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
    const superficie_stampa_espositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;

    return {
      numero_pezzi_espositori,
      superficie_stampa_espositori
    };
  };

  const espositorePhysicalElements = calculateExpositorePhysicalElements();
  const costs = calculateCosts();

  // Mutation per creare un nuovo preventivo
  const createPreventivoMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('User not authenticated');
      
      // Calcoli automatici
      const profondita = parseFloat(data.profondita);
      const larghezza = parseFloat(data.larghezza);
      const altezza = parseFloat(data.altezza);
      const distribuzione = parseInt(data.distribuzione);
      const bifaccialita = parseFloat((data.bifaccialita ?? '0')) || 0;
      const retroilluminazione = parseFloat((data.retroilluminazione ?? '0')) || 0;
      
      // Calcolo elementi fisici
      const elements = calculatePhysicalElements(profiliDistribuzioneMap);
      
      const superficie = larghezza * profondita;
      const volume = superficie * altezza;

      // Calcolo dei costi usando i parametri
      const costoStampaParam = parametri.find(p => p.tipo === 'costo_stampa');
      const costoPremontaggio = parametri.find(p => p.tipo === 'costo_premontaggio');
      const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === data.altezza);

      const struttura_terra = costoAltezzaParam ? 
        elements.sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;
      const grafica_cordino = costoStampaParam ? 
        elements.superficie_stampa * (costoStampaParam.valore || 0) : 0;
      const premontaggio = costoPremontaggio ? 
        elements.numero_pezzi * (costoPremontaggio.valore || 0) : 0;

      const costo_totale = struttura_terra + grafica_cordino + premontaggio;
      const superficie_mq = superficie / 10000; // Conversione da cm² a m²
      const volume_mc = volume / 1000000; // Conversione da cm³ a m³

      // Evita overflow su colonne numeric(10,2)
      const MAX_NUMERIC = 99999999.99;
      let costo_mq_value = superficie_mq > 0 ? (costo_totale / superficie_mq) : 0;
      let costo_mc_value = volume_mc > 0 ? (costo_totale / volume_mc) : 0;
      if (!isFinite(costo_mq_value) || Math.abs(costo_mq_value) > MAX_NUMERIC) costo_mq_value = MAX_NUMERIC;
      if (!isFinite(costo_mc_value) || Math.abs(costo_mc_value) > MAX_NUMERIC) costo_mc_value = MAX_NUMERIC;

      // Calcoli Storage
      let superficie_stampa_storage = 0;
      let sviluppo_metri_lineari_storage = 0;
      let numero_pezzi_storage = 0;

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
        numero_pezzi_storage = sviluppo_metri_lineari_storage * distribuzione;
      }

      // Calcoli Desk
      let superficie_stampa_desk = 0;
      let numero_pezzi_desk = 0;

      if (data.desk_qta && data.layout_desk) {
        const qta = parseInt(data.desk_qta);
        const layout = data.layout_desk;

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
          numero_pezzi_desk = 12 * qta;
        } else if (layout === "200") {
          numero_pezzi_desk = 20 * qta;
        }
      }

      // Calcoli Espositori
      const qta30 = parseInt(data.qta_tipo30) || 0;
      const qta50 = parseInt(data.qta_tipo50) || 0;
      const qta100 = parseInt(data.qta_tipo100) || 0;

      const numero_pezzi_espositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
      const superficie_stampa_espositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;

      const { error } = await supabase.from('preventivi').insert({
        numero_preventivo: data.numero_preventivo,
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
        data_scadenza: data.data_scadenza || null,
        note: data.note,
        prospect_id: data.prospect_id || null,
        superficie_stampa: elements.superficie_stampa,
        sviluppo_lineare: elements.sviluppo_lineare,
        numero_pezzi: elements.numero_pezzi,
        costo_struttura: struttura_terra,
        costo_grafica: grafica_cordino,
        costo_premontaggio: premontaggio,
        costo_totale: costo_totale,
        costo_mq: costo_mq_value,
        costo_mc: costo_mc_value,
        costo_fisso: 0,
        totale: costo_totale,
        bifaccialita,
        retroilluminazione,
        // Stand accessories
        borsa_stand: parseInt(formData.borsa_stand) || 0,
        baule_trolley: parseInt(formData.baule_trolley) || 0,
        staffa_monitor: parseInt(formData.staffa_monitor) || 0,
        mensola: parseInt(formData.mensola) || 0,
        spot_light: parseInt(formData.spot_light) || 0,
        kit_faro_50w: parseInt(formData.kit_faro_50w) || 0,
        kit_faro_100w: parseInt(formData.kit_faro_100w) || 0,
        quadro_elettrico_16a: parseInt(formData.quadro_elettrico_16a) || 0,
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
        numero_pezzi_storage,
        // Desk fields
        desk_qta: parseInt(data.desk_qta) || 0,
        layout_desk: data.layout_desk || '',
        porta_scorrevole: parseInt(data.porta_scorrevole) || 0,
        ripiano_superiore: parseInt(data.ripiano_superiore) || 0,
        ripiano_inferiore: parseInt(data.ripiano_inferiore) || 0,
        teca_plexiglass: parseInt(data.teca_plexiglass) || 0,
        fronte_luminoso: parseInt(data.fronte_luminoso) || 0,
        borsa: parseInt(data.borsa) || 0,
        superficie_stampa_desk,
        numero_pezzi_desk,
        // Espositore fields
        qta_tipo30: qta30,
        qta_tipo50: qta50,
        qta_tipo100: qta100,
        numero_pezzi_espositori,
        superficie_stampa_espositori,
        ripiano_30x30: parseInt(data.ripiano_30x30) || 0,
        ripiano_50x50: parseInt(data.ripiano_50x50) || 0,
        ripiano_100x50: parseInt(data.ripiano_100x50) || 0,
        teca_plexiglass_30x30x30: parseInt(data.teca_plexiglass_30x30x30) || 0,
        teca_plexiglass_50x50x50: parseInt(data.teca_plexiglass_50x50x50) || 0,
        teca_plexiglass_100x50x30: parseInt(data.teca_plexiglass_100x50x30) || 0,
        retroilluminazione_30x30x100h: parseInt(data.retroilluminazione_30x30x100h) || 0,
        retroilluminazione_50x50x100h: parseInt(data.retroilluminazione_50x50x100h) || 0,
        retroilluminazione_100x50x100h: parseInt(data.retroilluminazione_100x50x100h) || 0,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventivi'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-count'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-in-corso'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-valore'] });
      queryClient.invalidateQueries({ queryKey: ['ultimi-preventivi'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Preventivo creato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nella creazione del preventivo",
        variant: "destructive",
      });
      console.error('Error creating preventivo:', error);
    },
  });

  // Mutation per aggiornare un preventivo
  const updatePreventivoMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user || !editingPreventivo) throw new Error('User not authenticated or no preventivo selected');
      
      // Calcoli automatici
      const profondita = parseFloat(data.profondita);
      const larghezza = parseFloat(data.larghezza);
      const altezza = parseFloat(data.altezza);
      const distribuzione = parseInt(data.distribuzione);
      const bifaccialita = parseFloat((data.bifaccialita ?? '0')) || 0;
      const retroilluminazione = parseFloat((data.retroilluminazione ?? '0')) || 0;
      
      // Calcolo elementi fisici
      const elements = calculatePhysicalElements(profiliDistribuzioneMap);
      
      const superficie = larghezza * profondita;
      const volume = superficie * altezza;

      // Calcolo dei costi usando i parametri
      const costoStampaParam = parametri.find(p => p.tipo === 'costo_stampa');
      const costoPremontaggio = parametri.find(p => p.tipo === 'costo_premontaggio');
      const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === data.altezza);

      const struttura_terra = costoAltezzaParam ? 
        elements.sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;
      const grafica_cordino = costoStampaParam ? 
        elements.superficie_stampa * (costoStampaParam.valore || 0) : 0;
      const premontaggio = costoPremontaggio ? 
        elements.numero_pezzi * (costoPremontaggio.valore || 0) : 0;

      const costo_totale = struttura_terra + grafica_cordino + premontaggio;
      const superficie_mq = superficie / 10000;
      const volume_mc = volume / 1000000;

      // Evita overflow su colonne numeric(10,2)
      const MAX_NUMERIC = 99999999.99;
      let costo_mq_value = superficie_mq > 0 ? (costo_totale / superficie_mq) : 0;
      let costo_mc_value = volume_mc > 0 ? (costo_totale / volume_mc) : 0;
      if (!isFinite(costo_mq_value) || Math.abs(costo_mq_value) > MAX_NUMERIC) costo_mq_value = MAX_NUMERIC;
      if (!isFinite(costo_mc_value) || Math.abs(costo_mc_value) > MAX_NUMERIC) costo_mc_value = MAX_NUMERIC;

      // Calcoli Storage
      let superficie_stampa_storage = 0;
      let sviluppo_metri_lineari_storage = 0;
      let numero_pezzi_storage = 0;

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
        numero_pezzi_storage = sviluppo_metri_lineari_storage * distribuzione;
      }

      // Calcoli Desk
      let superficie_stampa_desk = 0;
      let numero_pezzi_desk = 0;

      if (data.desk_qta && data.layout_desk) {
        const qta = parseInt(data.desk_qta);
        const layout = data.layout_desk;

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
          numero_pezzi_desk = 12 * qta;
        } else if (layout === "200") {
          numero_pezzi_desk = 20 * qta;
        }
      }

      // Calcoli Espositori
      const qta30 = parseInt(data.qta_tipo30) || 0;
      const qta50 = parseInt(data.qta_tipo50) || 0;
      const qta100 = parseInt(data.qta_tipo100) || 0;

      const numero_pezzi_espositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
      const superficie_stampa_espositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;

      const { error } = await supabase.from('preventivi').update({
        numero_preventivo: data.numero_preventivo,
        titolo: data.titolo,
        descrizione: data.descrizione,
        profondita: profondita,
        larghezza: larghezza,
        altezza: altezza,
        layout: data.layout,
        distribuzione: distribuzione,
        complessita: data.complessita,
        status: data.status,
        data_scadenza: data.data_scadenza || null,
        note: data.note,
        prospect_id: data.prospect_id || null,
        superficie_stampa: elements.superficie_stampa,
        sviluppo_lineare: elements.sviluppo_lineare,
        numero_pezzi: elements.numero_pezzi,
        costo_struttura: struttura_terra,
        costo_grafica: grafica_cordino,
        costo_premontaggio: premontaggio,
        costo_totale: costo_totale,
        costo_mq: costo_mq_value,
        costo_mc: costo_mc_value,
        totale: costo_totale,
        bifaccialita,
        retroilluminazione,
        // Stand accessories
        borsa_stand: parseInt(formData.borsa_stand) || 0,
        baule_trolley: parseInt(formData.baule_trolley) || 0,
        staffa_monitor: parseInt(formData.staffa_monitor) || 0,
        mensola: parseInt(formData.mensola) || 0,
        spot_light: parseInt(formData.spot_light) || 0,
        kit_faro_50w: parseInt(formData.kit_faro_50w) || 0,
        kit_faro_100w: parseInt(formData.kit_faro_100w) || 0,
        quadro_elettrico_16a: parseInt(formData.quadro_elettrico_16a) || 0,
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
        numero_pezzi_storage,
        // Desk fields
        desk_qta: parseInt(data.desk_qta) || 0,
        layout_desk: data.layout_desk || '',
        porta_scorrevole: parseInt(data.porta_scorrevole) || 0,
        ripiano_superiore: parseInt(data.ripiano_superiore) || 0,
        ripiano_inferiore: parseInt(data.ripiano_inferiore) || 0,
        teca_plexiglass: parseInt(data.teca_plexiglass) || 0,
        fronte_luminoso: parseInt(data.fronte_luminoso) || 0,
        borsa: parseInt(data.borsa) || 0,
        superficie_stampa_desk,
        numero_pezzi_desk,
        // Espositore fields
        qta_tipo30: qta30,
        qta_tipo50: qta50,
        qta_tipo100: qta100,
        numero_pezzi_espositori,
        superficie_stampa_espositori,
        ripiano_30x30: parseInt(data.ripiano_30x30) || 0,
        ripiano_50x50: parseInt(data.ripiano_50x50) || 0,
        ripiano_100x50: parseInt(data.ripiano_100x50) || 0,
        teca_plexiglass_30x30x30: parseInt(data.teca_plexiglass_30x30x30) || 0,
        teca_plexiglass_50x50x50: parseInt(data.teca_plexiglass_50x50x50) || 0,
        teca_plexiglass_100x50x30: parseInt(data.teca_plexiglass_100x50x30) || 0,
        retroilluminazione_30x30x100h: parseInt(data.retroilluminazione_30x30x100h) || 0,
        retroilluminazione_50x50x100h: parseInt(data.retroilluminazione_50x50x100h) || 0,
        retroilluminazione_100x50x100h: parseInt(data.retroilluminazione_100x50x100h) || 0,
      }).eq('id', editingPreventivo.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventivi'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-count'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-in-corso'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-valore'] });
      queryClient.invalidateQueries({ queryKey: ['ultimi-preventivi'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo", 
        description: "Preventivo aggiornato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del preventivo",
        variant: "destructive",
      });
      console.error('Error updating preventivo:', error);
    },
  });

  // Mutation per eliminare un preventivo
  const deletePreventivoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('preventivi')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventivi'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-count'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-in-corso'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-valore'] });
      queryClient.invalidateQueries({ queryKey: ['ultimi-preventivi'] });
      setDeletePreventivo(null);
      toast({
        title: "Successo",
        description: "Preventivo eliminato con successo",
      });
    },
    onError: (error) => {
      console.error('Error deleting preventivo:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione del preventivo",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      numero_preventivo: '',
      titolo: '',
      descrizione: '',
      prospect_id: '',
      profondita: '',
      larghezza: '',
      altezza: '',
      layout: '',
      distribuzione: '',
      complessita: 'normale',
      status: 'bozza',
      data_scadenza: '',
      note: '',
      bifaccialita: '0',
      retroilluminazione: '',
      // Stand accessories
      borsa_stand: '',
      baule_trolley: '',
      staffa_monitor: '',
      mensola: '',
      spot_light: '',
      kit_faro_50w: '',
      kit_faro_100w: '',
      quadro_elettrico_16a: '',
      nicchia: '',
      pedana: '',
      // Storage fields
      larg_storage: '',
      prof_storage: '',
      alt_storage: '',
      layout_storage: '',
      numero_porte: '',
      // Desk fields
      desk_qta: 1,
      layout_desk: '',
      porta_scorrevole: 0,
      ripiano_superiore: 0,
      ripiano_inferiore: 0,
      teca_plexiglass: 0,
      fronte_luminoso: 0,
      borsa: 0,
      // Espositore fields
      qta_tipo30: 0,
      qta_tipo50: 0,
      qta_tipo100: 0,
      ripiano_30x30: 0,
      ripiano_50x50: 0,
      ripiano_100x50: 0,
      teca_plexiglass_30x30x30: 0,
      teca_plexiglass_50x50x50: 0,
      teca_plexiglass_100x50x30: 0,
      retroilluminazione_30x30x100h: 0,
      retroilluminazione_50x50x100h: 0,
      retroilluminazione_100x50x100h: 0,
    });
    setEditingPreventivo(null);
    setSectionsOpen({
      stand: true,
      storage: false,
      desk: false,
      espositori: false,
      complementi: false,
    });
  };

  const openEditDialog = (preventivo: Preventivo) => {
    setEditingPreventivo(preventivo);
    setFormData({
      numero_preventivo: preventivo.numero_preventivo,
      titolo: preventivo.titolo,
      descrizione: preventivo.descrizione || '',
      prospect_id: preventivo.prospect_id || '',
      profondita: preventivo.profondita.toString(),
      larghezza: preventivo.larghezza.toString(),
      altezza: preventivo.altezza.toString(),
      layout: preventivo.layout,
      distribuzione: preventivo.distribuzione.toString(),
      complessita: preventivo.complessita || 'normale',
      status: preventivo.status,
      data_scadenza: preventivo.data_scadenza || '',
      note: preventivo.note || '',
      bifaccialita: (preventivo as any).bifaccialita?.toString() || '0',
      retroilluminazione: (preventivo as any).retroilluminazione?.toString() || '',
      // Stand accessories
      borsa_stand: (preventivo as any).borsa_stand?.toString() || '',
      baule_trolley: (preventivo as any).baule_trolley?.toString() || '',
      staffa_monitor: (preventivo as any).staffa_monitor?.toString() || '',
      mensola: (preventivo as any).mensola?.toString() || '',
      spot_light: (preventivo as any).spot_light?.toString() || '',
      kit_faro_50w: (preventivo as any).kit_faro_50w?.toString() || '',
      kit_faro_100w: (preventivo as any).kit_faro_100w?.toString() || '',
      quadro_elettrico_16a: (preventivo as any).quadro_elettrico_16a?.toString() || '',
      nicchia: (preventivo as any).nicchia?.toString() || '',
      pedana: (preventivo as any).pedana?.toString() || '',
      // Storage fields
      larg_storage: (preventivo as any).larg_storage?.toString() || '',
      prof_storage: (preventivo as any).prof_storage?.toString() || '',
      alt_storage: (preventivo as any).alt_storage?.toString() || '',
      layout_storage: (preventivo as any).layout_storage || '',
      numero_porte: (preventivo as any).numero_porte || '',
      // Desk fields
      desk_qta: (preventivo as any).desk_qta || 0,
      layout_desk: (preventivo as any).layout_desk || '',
      porta_scorrevole: (preventivo as any).porta_scorrevole || 0,
      ripiano_superiore: (preventivo as any).ripiano_superiore || 0,
      ripiano_inferiore: (preventivo as any).ripiano_inferiore || 0,
      teca_plexiglass: (preventivo as any).teca_plexiglass || 0,
      fronte_luminoso: (preventivo as any).fronte_luminoso || 0,
      borsa: (preventivo as any).borsa || 0,
      // Espositore fields
      qta_tipo30: (preventivo as any).qta_tipo30 || 0,
      qta_tipo50: (preventivo as any).qta_tipo50 || 0,
      qta_tipo100: (preventivo as any).qta_tipo100 || 0,
      ripiano_30x30: (preventivo as any).ripiano_30x30 || 0,
      ripiano_50x50: (preventivo as any).ripiano_50x50 || 0,
      ripiano_100x50: (preventivo as any).ripiano_100x50 || 0,
      teca_plexiglass_30x30x30: (preventivo as any).teca_plexiglass_30x30x30 || 0,
      teca_plexiglass_50x50x50: (preventivo as any).teca_plexiglass_50x50x50 || 0,
      teca_plexiglass_100x50x30: (preventivo as any).teca_plexiglass_100x50x30 || 0,
      retroilluminazione_30x30x100h: (preventivo as any).retroilluminazione_30x30x100h || 0,
      retroilluminazione_50x50x100h: (preventivo as any).retroilluminazione_50x50x100h || 0,
      retroilluminazione_100x50x100h: (preventivo as any).retroilluminazione_100x50x100h || 0,
    });
    setSectionsOpen({
      stand: true,
      storage: false,
      desk: false,
      espositori: false,
      complementi: false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione base
    if (!formData.numero_preventivo || !formData.titolo || !formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
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
  const filteredPreventivi = preventivi.filter((preventivo) => {
    const matchesSearch = 
      preventivo.numero_preventivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preventivo.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preventivo.prospects?.ragione_sociale?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || preventivo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      bozza: { label: 'Bozza', variant: 'secondary' as const },
      inviato: { label: 'Inviato', variant: 'default' as const },
      accettato: { label: 'Accettato', variant: 'default' as const },
      rifiutato: { label: 'Rifiutato', variant: 'destructive' as const },
      in_revisione: { label: 'In Revisione', variant: 'outline' as const },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
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
              <Plus className="mr-2 h-4 w-4" />
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
                  <FileText className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">1. Anagrafica Preventivo</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero_preventivo">Numero Preventivo *</Label>
                    <Input
                      id="numero_preventivo"
                      value={formData.numero_preventivo}
                      onChange={(e) => setFormData({ ...formData, numero_preventivo: e.target.value })}
                      placeholder="es. PREV-2024-001"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="titolo">Titolo *</Label>
                    <Input
                      id="titolo"
                      value={formData.titolo}
                      onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                      placeholder="Titolo del preventivo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prospect_id">Cliente</Label>
                    <Select value={formData.prospect_id} onValueChange={(value) => setFormData({ ...formData, prospect_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {prospects.map((prospect) => (
                          <SelectItem key={prospect.id} value={prospect.id}>
                            {prospect.ragione_sociale}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Stato</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
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
                  <Textarea
                    id="descrizione"
                    value={formData.descrizione}
                    onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                    placeholder="Descrizione dettagliata del preventivo"
                  />
                </div>
              </div>

              <Separator />

              {/* Sezione Stand - principale */}
              <div className="bg-[hsl(var(--section-stand))] border border-[hsl(var(--section-stand-border))] rounded-lg">
                <div className="p-4 border-b border-[hsl(var(--section-stand-border))]">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--section-stand-foreground))]"></div>
                    <h3 className="text-lg font-semibold text-[hsl(var(--section-stand-foreground))]">
                      Stand
                    </h3>
                    <span className="ml-auto text-xs bg-[hsl(var(--section-stand-foreground))] text-[hsl(var(--section-stand))] px-2 py-1 rounded-full">
                      Principale
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <StandSection 
                    formData={formData}
                    setFormData={setFormData}
                    physicalElements={physicalElements}
                    costs={costs}
                  />
                </div>
              </div>

              {/* Sezioni aggiuntive collassabili */}
              <div className="space-y-3">
                <Collapsible
                  open={sectionsOpen.storage}
                  onOpenChange={(open) => setSectionsOpen(prev => ({ ...prev, storage: open }))}
                >
                  <div className="bg-[hsl(var(--section-storage))] border border-[hsl(var(--section-storage-border))] rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-storage-border))] rounded-none border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[hsl(var(--section-storage-foreground))]"></div>
                          <span className="font-medium text-[hsl(var(--section-storage-foreground))]">Storage</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-storage-foreground))] ${sectionsOpen.storage ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-[hsl(var(--section-storage-border))] bg-card p-6">
                        <StorageSection 
                          formData={formData}
                          setFormData={setFormData}
                          profiliDistribuzioneMap={profiliDistribuzioneMap}
                        />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                <Collapsible
                  open={sectionsOpen.desk}
                  onOpenChange={(open) => setSectionsOpen(prev => ({ ...prev, desk: open }))}
                >
                  <div className="bg-[hsl(var(--section-desk))] border border-[hsl(var(--section-desk-border))] rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-desk-border))] rounded-none border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[hsl(var(--section-desk-foreground))]"></div>
                          <span className="font-medium text-[hsl(var(--section-desk-foreground))]">Desk</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-desk-foreground))] ${sectionsOpen.desk ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-[hsl(var(--section-desk-border))] bg-card p-6">
                         <DeskSection 
                           data={{
                             desk_qta: formData.desk_qta,
                             layout_desk: formData.layout_desk,
                             porta_scorrevole: formData.porta_scorrevole,
                             ripiano_superiore: formData.ripiano_superiore,
                             ripiano_inferiore: formData.ripiano_inferiore,
                             teca_plexiglass: formData.teca_plexiglass,
                             fronte_luminoso: formData.fronte_luminoso,
                             borsa: formData.borsa,
                           }}
                           onChange={(field, value) => setFormData(prev => ({...prev, [field]: value}))}
                         />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                <Collapsible
                  open={sectionsOpen.espositori}
                  onOpenChange={(open) => setSectionsOpen(prev => ({ ...prev, espositori: open }))}
                >
                  <div className="bg-[hsl(var(--section-expo))] border border-[hsl(var(--section-expo-border))] rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-expo-border))] rounded-none border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[hsl(var(--section-expo-foreground))]"></div>
                          <span className="font-medium text-[hsl(var(--section-expo-foreground))]">Espositori/Plinto</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-expo-foreground))] ${sectionsOpen.espositori ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                       <div className="border-t border-[hsl(var(--section-expo-border))] bg-card p-6">
                         <ExpositoreSection 
                           formData={formData}
                           setFormData={setFormData}
                           physicalElements={espositorePhysicalElements}
                         />
                       </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                <Collapsible
                  open={sectionsOpen.complementi}
                  onOpenChange={(open) => setSectionsOpen(prev => ({ ...prev, complementi: open }))}
                >
                  <div className="bg-[hsl(var(--section-complement))] border border-[hsl(var(--section-complement-border))] rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-complement-border))] rounded-none border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[hsl(var(--section-complement-foreground))]"></div>
                          <span className="font-medium text-[hsl(var(--section-complement-foreground))]">Complementi</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-complement-foreground))] ${sectionsOpen.complementi ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-[hsl(var(--section-complement-border))] bg-card p-6">
                        <EmptySection sectionName="Complementi" />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>

              {/* Sezione Totale Generale */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Totale Generale Preventivo</h3>
                </div>

                <Card className="border-2 border-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Totale Preventivo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">€{costs.totale.toFixed(2)}</div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data_scadenza">Data Scadenza</Label>
                    <Input
                      id="data_scadenza"
                      type="date"
                      value={formData.data_scadenza}
                      onChange={(e) => setFormData({ ...formData, data_scadenza: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Note aggiuntive"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={createPreventivoMutation.isPending || updatePreventivoMutation.isPending}>
                  {editingPreventivo ? (updatePreventivoMutation.isPending ? 'Aggiornamento...' : 'Aggiorna') : (createPreventivoMutation.isPending ? 'Salvataggio...' : 'Salva')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Elenco Preventivi
          </CardTitle>
          <CardDescription>
            Gestisci e visualizza tutti i tuoi preventivi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per numero, titolo o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtra per stato" />
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

          {isLoading ? (
            <div className="text-center py-6">Caricamento...</div>
          ) : filteredPreventivi.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nessun preventivo trovato
            </div>
          ) : (
            <Table>
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
                {filteredPreventivi.map((preventivo) => (
                  <TableRow key={preventivo.id}>
                    <TableCell className="font-medium">
                      {preventivo.numero_preventivo}
                    </TableCell>
                    <TableCell>{preventivo.titolo}</TableCell>
                    <TableCell>
                      {preventivo.prospects?.ragione_sociale || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{preventivo.profondita}×{preventivo.larghezza}×{preventivo.altezza}m</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Stampa: {preventivo.superficie_stampa?.toFixed(2)}m²</div>
                        <div className="text-muted-foreground">
                          {preventivo.sviluppo_lineare?.toFixed(2)}m • {preventivo.numero_pezzi?.toFixed(0)}pz
                        </div>
                      </div>
                    </TableCell>
                     <TableCell>
                       <div className="font-medium">
                         €{(preventivo.costo_totale || preventivo.totale)?.toLocaleString('it-IT') || '0'}
                       </div>
                     </TableCell>
                    <TableCell>
                      {getStatusBadge(preventivo.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(preventivo.created_at).toLocaleDateString('it-IT')}
                    </TableCell>
                     <TableCell>
                       <div className="flex gap-1">
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => openEditDialog(preventivo)}
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => setDeletePreventivo(preventivo)}
                           className="text-destructive hover:text-destructive/90"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Alert Dialog per conferma cancellazione */}
      <AlertDialog open={!!deletePreventivo} onOpenChange={() => setDeletePreventivo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di cancellare il preventivo?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il preventivo "{deletePreventivo?.titolo}" verrà eliminato definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletePreventivo && deletePreventivoMutation.mutate(deletePreventivo.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Preventivi;
