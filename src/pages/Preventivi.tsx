import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, FileText, Calculator } from 'lucide-react';
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

    // Superficie di stampa
    let superficie_stampa = 0;
    switch (formData.layout) {
      case '4_lati':
        superficie_stampa = (2 * larghezza + 2 * profondita) * altezza + altezza;
        break;
      case '3_lati':
        superficie_stampa = (larghezza + 2 * profondita) * altezza + altezza;
        break;
      case '2_lati':
        superficie_stampa = (larghezza + profondita) * altezza + altezza;
        break;
      case '1_lato':
        superficie_stampa = larghezza * altezza + altezza;
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
    const numero_pezzi = sviluppo_lineare * fattoreDistribuzione;

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
        costo_mq: superficie_mq > 0 ? costo_totale / superficie_mq : 0,
        costo_mc: volume_mc > 0 ? costo_totale / volume_mc : 0,
        costo_fisso: 0,
        totale: costo_totale,
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
        costo_mq: superficie_mq > 0 ? costo_totale / superficie_mq : 0,
        costo_mc: volume_mc > 0 ? costo_totale / volume_mc : 0,
        totale: costo_totale,
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
    });
    setEditingPreventivo(null);
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
                {editingPreventivo ? 'Modifica il preventivo esistente' : 'Crea un nuovo preventivo compilando le 4 sezioni seguenti'}.
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

              {/* Sezione 2: Dati di Ingresso */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">2. Dati di Ingresso per Stand</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profondita">Profondità (m) *</Label>
                    <Input
                      id="profondita"
                      type="number"
                      step="0.01"
                      value={formData.profondita}
                      onChange={(e) => setFormData({ ...formData, profondita: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="larghezza">Larghezza (m) *</Label>
                    <Input
                      id="larghezza"
                      type="number"
                      step="0.01"
                      value={formData.larghezza}
                      onChange={(e) => setFormData({ ...formData, larghezza: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="altezza">Altezza (m) *</Label>
                    <Select value={formData.altezza} onValueChange={(value) => setFormData({ ...formData, altezza: value })}>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="layout">Layout *</Label>
                    <Select value={formData.layout} onValueChange={(value) => setFormData({ ...formData, layout: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4_lati">4 lati</SelectItem>
                        <SelectItem value="3_lati">3 lati</SelectItem>
                        <SelectItem value="2_lati">2 lati</SelectItem>
                        <SelectItem value="1_lato">1 lato</SelectItem>
                        <SelectItem value="0_lati">0 lati</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distribuzione">Distribuzione *</Label>
                    <Select value={formData.distribuzione} onValueChange={(value) => setFormData({ ...formData, distribuzione: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona distribuzione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complessita">Complessità</Label>
                    <Select value={formData.complessita} onValueChange={(value) => setFormData({ ...formData, complessita: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normale">Normale</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sezione 3: Elementi Fisici da Calcolare */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">3. Elementi Fisici da Calcolare</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Superficie di stampa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{physicalElements.superficie_stampa.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">m²</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Superficie metri quadri</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{physicalElements.superficie_mq.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">m²</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Sviluppo lineare</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{physicalElements.sviluppo_lineare.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">m</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Numero di pezzi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{physicalElements.numero_pezzi.toFixed(0)}</div>
                      <p className="text-xs text-muted-foreground">N</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Sezione 4: Calcolo Costi */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">4. Calcolo Costi</h3>
                </div>
                
                {/* Dettaglio costi */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Struttura a terra</CardTitle>
                      <CardDescription className="text-xs">Sviluppo lineare × Costo per altezza</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">€{costs.struttura_terra.toFixed(2)}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Grafica con cordino cucito</CardTitle>
                      <CardDescription className="text-xs">Superficie stampa × Costo stampa mq</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">€{costs.grafica_cordino.toFixed(2)}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Premontaggio</CardTitle>
                      <CardDescription className="text-xs">Numero pezzi × Costo premontaggio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">€{costs.premontaggio.toFixed(2)}</div>
                    </CardContent>
                  </Card>
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
