import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2, Save, X, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserManagement } from '@/components/UserManagement';

interface Parametro {
  id: string;
  tipo: string;
  nome: string;
  valore: number | null;
  valore_testo: string | null;
  descrizione: string | null;
  valore_chiave: string | null;
  ordine: number;
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingParameter, setEditingParameter] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editingParameterId, setEditingParameterId] = useState<string | null>(null);
  const [editingParameterValue, setEditingParameterValue] = useState<string>('');
  const [editingVoloId, setEditingVoloId] = useState<string | null>(null);
  const [editingVoloValue, setEditingVoloValue] = useState<string>('');
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [editingExtraValue, setEditingExtraValue] = useState<string>('');
  const [editingRetroId, setEditingRetroId] = useState<string | null>(null);
  const [editRetroCost, setEditRetroCost] = useState<string>('');
  const [showAddRetro, setShowAddRetro] = useState(false);
  const [newRetroHeight, setNewRetroHeight] = useState('');
  const [newRetroCost, setNewRetroCost] = useState('');
  const [editingAccessorio, setEditingAccessorio] = useState<any>(null);
  const [editingAccessorioDesk, setEditingAccessorioDesk] = useState<any>(null);
  const [editingAccessorioEspositori, setEditingAccessorioEspositori] = useState<any>(null);
  const [editingCostoStrutturaDesk, setEditingCostoStrutturaDesk] = useState<any>(null);
  const [editingCostoStrutturaEspositori, setEditingCostoStrutturaEspositori] = useState<any>(null);
  const [showAddAccessorio, setShowAddAccessorio] = useState(false);
  const [showAddAccessorioDesk, setShowAddAccessorioDesk] = useState(false);
  const [showAddAccessorioEspositori, setShowAddAccessorioEspositori] = useState(false);
  const [showAddCostoStrutturaDesk, setShowAddCostoStrutturaDesk] = useState(false);
  const [showAddCostoStrutturaEspositori, setShowAddCostoStrutturaEspositori] = useState(false);
  const [newAccessorioNome, setNewAccessorioNome] = useState('');
  const [newAccessorioCosto, setNewAccessorioCosto] = useState('');
  const [editingAccessorioId, setEditingAccessorioId] = useState<string | null>(null);
  const [editAccessorioNome, setEditAccessorioNome] = useState('');
  const [editAccessorioCosto, setEditAccessorioCosto] = useState('');
  
  // Desk accessories states
  const [newAccessorioDeskNome, setNewAccessorioDeskNome] = useState('');
  const [newAccessorioDeskCosto, setNewAccessorioDeskCosto] = useState('');
  
  // Espositori accessories states
  const [newAccessorioEspositoriNome, setNewAccessorioEspositoriNome] = useState('');
  const [newAccessorioEspositoriCosto, setNewAccessorioEspositoriCosto] = useState('');
  
  // Desk structure costs states
  const [newLayoutDesk, setNewLayoutDesk] = useState('');
  const [newCostoStrutturaDesk, setNewCostoStrutturaDesk] = useState('');
  
  // Expositor structure costs states
  const [newLayoutEspositore, setNewLayoutEspositore] = useState('');
  const [newCostoStrutturaEspositori, setNewCostoStrutturaEspositori] = useState('');

  // Fetch parameters
  const { data: parametri = [], isLoading } = useQuery({
    queryKey: ['parametri'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parametri')
        .select('*')
        .order('tipo', { ascending: true })
        .order('ordine', { ascending: true });

      if (error) throw error;
      return data as Parametro[];
    },
    enabled: !!user,
  });

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

  // Update unit cost parameter mutation
  const updateParametriCostiUnitariMutation = useMutation({
    mutationFn: async ({ id, valore }: { id: string; valore: number }) => {
      const { error } = await supabase
        .from('parametri_a_costi_unitari')
        .update({ valore })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parametri-costi-unitari'] });
      toast({
        title: "Parametro aggiornato",
        description: "Il parametro è stato aggiornato con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del parametro.",
        variant: "destructive",
      });
    },
  });

  // Fetch retroilluminazione costs
  const { data: costiRetroilluminazione = [] } = useQuery({
    queryKey: ['costi-retroilluminazione'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('costi_retroilluminazione')
        .select('*')
        .order('altezza');

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Update parameter mutation
  const updateParameterMutation = useMutation({
    mutationFn: async ({ id, valore }: { id: string; valore: number }) => {
      const { error } = await supabase
        .from('parametri')
        .update({ valore })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parametri'] });
      toast({
        title: "Parametro aggiornato",
        description: "Il parametro è stato aggiornato con successo.",
      });
      setEditingParameter(null);
      setEditValue('');
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del parametro.",
        variant: "destructive",
      });
    },
  });

  // Update retroilluminazione mutation
  const updateRetroMutation = useMutation({
    mutationFn: async ({ id, costo_al_metro }: { id: string; costo_al_metro: number }) => {
      const { error } = await supabase
        .from('costi_retroilluminazione')
        .update({ costo_al_metro })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costi-retroilluminazione'] });
      toast({
        title: "Costo aggiornato",
        description: "Il costo di retroilluminazione è stato aggiornato.",
      });
      setEditingRetroId(null);
      setEditRetroCost('');
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del costo.",
        variant: "destructive",
      });
    },
  });

  // Fetch listino accessori stand
  const { data: accessoriStand = [], isLoading: isLoadingAccessori } = useQuery({
    queryKey: ['listino-accessori-stand'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listino_accessori_stand')
        .select('*')
        .eq('attivo', true)
        .order('nome');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch listino accessori desk
  const { data: accessoriDesk = [] } = useQuery({
    queryKey: ['listino-accessori-desk'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listino_accessori_desk')
        .select('*')
        .eq('attivo', true)
        .order('nome');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch costi struttura desk
  const { data: costiStrutturaDesk = [] } = useQuery({
    queryKey: ['costi-struttura-desk-layout'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('costi_struttura_desk_layout')
        .select('*')
        .eq('attivo', true)
        .order('layout_desk');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch costi struttura espositori
  const { data: costiStrutturaEspositori = [] } = useQuery({
    queryKey: ['costi-struttura-espositori-layout'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('costi_struttura_espositori_layout')
        .select('*')
        .eq('attivo', true)
        .order('layout_espositore');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch listino accessori espositori
  const { data: accessoriEspositori = [] } = useQuery({
    queryKey: ['listino-accessori-espositori'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listino_accessori_espositori')
        .select('*')
        .eq('attivo', true)
        .order('nome');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Add retroilluminazione mutation
  const addRetroMutation = useMutation({
    mutationFn: async ({ altezza, costo_al_metro }: { altezza: number; costo_al_metro: number }) => {
      const { error } = await supabase
        .from('costi_retroilluminazione')
        .insert({ altezza, costo_al_metro });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costi-retroilluminazione'] });
      toast({ title: 'Riga aggiunta', description: 'Altezza e costo aggiunti con successo.' });
      setShowAddRetro(false);
      setNewRetroHeight('');
      setNewRetroCost('');
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiungere la riga.', variant: 'destructive' });
    },
  });

  // Add accessorio mutation
  const addAccessorioMutation = useMutation({
    mutationFn: async ({ nome, costo_unitario }: { nome: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('listino_accessori_stand')
        .insert({ nome, costo_unitario });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-stand'] });
      toast({ title: 'Accessorio aggiunto', description: 'Accessorio aggiunto con successo.' });
      setShowAddAccessorio(false);
      setNewAccessorioNome('');
      setNewAccessorioCosto('');
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiungere accessorio.', variant: 'destructive' });
    },
  });

  // Update accessorio mutation
  const updateAccessorioMutation = useMutation({
    mutationFn: async ({ id, nome, costo_unitario }: { id: string; nome: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('listino_accessori_stand')
        .update({ nome, costo_unitario })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-stand'] });
      toast({ title: 'Accessorio aggiornato', description: 'Accessorio aggiornato con successo.' });
      setEditingAccessorioId(null);
      setEditAccessorioNome('');
      setEditAccessorioCosto('');
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiornare accessorio.', variant: 'destructive' });
    },
  });

  // Delete accessorio mutation
  const deleteAccessorioMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listino_accessori_stand')
        .update({ attivo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-stand'] });
      toast({ title: 'Accessorio eliminato', description: 'Accessorio eliminato con successo.' });
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile eliminare accessorio.', variant: 'destructive' });
    },
  });

  // Desk accessories mutations
  const addAccessorioDeskMutation = useMutation({
    mutationFn: async ({ nome, costo_unitario }: { nome: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('listino_accessori_desk')
        .insert({ nome, costo_unitario });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-desk'] });
      toast({ title: 'Accessorio Desk aggiunto', description: 'Accessorio Desk aggiunto con successo.' });
      setShowAddAccessorioDesk(false);
      setNewAccessorioDeskNome('');
      setNewAccessorioDeskCosto('');
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiungere accessorio Desk.', variant: 'destructive' });
    },
  });

  const updateAccessorioDeskMutation = useMutation({
    mutationFn: async ({ id, nome, costo_unitario }: { id: string; nome: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('listino_accessori_desk')
        .update({ nome, costo_unitario })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-desk'] });
      toast({ title: 'Accessorio Desk aggiornato', description: 'Accessorio Desk aggiornato con successo.' });
      setEditingAccessorioDesk(null);
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiornare accessorio Desk.', variant: 'destructive' });
    },
  });

  const deleteAccessorioDeskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listino_accessori_desk')
        .update({ attivo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-desk'] });
      toast({ title: 'Accessorio Desk eliminato', description: 'Accessorio Desk eliminato con successo.' });
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile eliminare accessorio Desk.', variant: 'destructive' });
    },
  });

  // Desk structure costs mutations
  const addCostoStrutturaDeskMutation = useMutation({
    mutationFn: async ({ layout_desk, costo_unitario }: { layout_desk: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('costi_struttura_desk_layout')
        .insert({ layout_desk, costo_unitario });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costi-struttura-desk-layout'] });
      toast({ title: 'Costo struttura Desk aggiunto', description: 'Costo struttura Desk aggiunto con successo.' });
      setShowAddCostoStrutturaDesk(false);
      setNewLayoutDesk('');
      setNewCostoStrutturaDesk('');
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiungere costo struttura Desk.', variant: 'destructive' });
    },
  });

  const updateCostoStrutturaDeskMutation = useMutation({
    mutationFn: async ({ id, layout_desk, costo_unitario }: { id: string; layout_desk: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('costi_struttura_desk_layout')
        .update({ layout_desk, costo_unitario })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costi-struttura-desk-layout'] });
      toast({ title: 'Costo struttura Desk aggiornato', description: 'Costo struttura Desk aggiornato con successo.' });
      setEditingCostoStrutturaDesk(null);
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiornare costo struttura Desk.', variant: 'destructive' });
    },
  });

  const deleteCostoStrutturaDeskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('costi_struttura_desk_layout')
        .update({ attivo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costi-struttura-desk-layout'] });
      toast({ title: 'Costo struttura Desk eliminato', description: 'Costo struttura Desk eliminato con successo.' });
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile eliminare costo struttura Desk.', variant: 'destructive' });
    },
  });

  // Expositor structure costs mutations
  const addCostoStrutturaEspositoreMutation = useMutation({
    mutationFn: async ({ layout_espositore, costo_unitario }: { layout_espositore: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('costi_struttura_espositori_layout')
        .insert({ layout_espositore, costo_unitario });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costi-struttura-espositori-layout'] });
      toast({ title: 'Costo struttura Espositore aggiunto', description: 'Costo struttura Espositore aggiunto con successo.' });
      setShowAddCostoStrutturaEspositori(false);
      setNewLayoutEspositore('');
      setNewCostoStrutturaEspositori('');
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiungere costo struttura Espositore.', variant: 'destructive' });
    },
  });

  const updateCostoStrutturaEspositoreMutation = useMutation({
    mutationFn: async ({ id, layout_espositore, costo_unitario }: { id: string; layout_espositore: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('costi_struttura_espositori_layout')
        .update({ layout_espositore, costo_unitario })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costi-struttura-espositori-layout'] });
      toast({ title: 'Costo struttura Espositore aggiornato', description: 'Costo struttura Espositore aggiornato con successo.' });
      setEditingCostoStrutturaEspositori(null);
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiornare costo struttura Espositore.', variant: 'destructive' });
    },
  });

  const deleteCostoStrutturaEspositoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('costi_struttura_espositori_layout')
        .update({ attivo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costi-struttura-espositori-layout'] });
      toast({ title: 'Costo struttura Espositore eliminato', description: 'Costo struttura Espositore eliminato con successo.' });
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile eliminare costo struttura Espositore.', variant: 'destructive' });
    },
  });

  const handleEdit = (parametro: Parametro) => {
    setEditingParameter(parametro.id);
    setEditValue(parametro.valore?.toString() || '');
  };

  const handleSave = () => {
    if (!editingParameter || !editValue) return;
    
    const numericValue = parseFloat(editValue);
    if (isNaN(numericValue)) {
      toast({
        title: "Errore",
        description: "Inserire un valore numerico valido.",
        variant: "destructive",
      });
      return;
    }

    updateParameterMutation.mutate({
      id: editingParameter,
      valore: numericValue,
    });
  };

  const handleCancel = () => {
    setEditingParameter(null);
    setEditValue('');
  };

  // Handlers for retroilluminazione editing
  const handleEditRetro = (costo: any) => {
    setEditingRetroId(costo.id);
    const costNum = Number(costo.costo_al_metro);
    const formatted = isNaN(costNum)
      ? String(costo.costo_al_metro ?? '')
      : costNum.toString().replace('.', ',');
    setEditRetroCost(formatted);
  };

  const handleSaveRetro = () => {
    if (!editingRetroId) return;
    const normalized = editRetroCost.replace(',', '.');
    const value = parseFloat(normalized);
    if (isNaN(value)) {
      toast({
        title: "Errore",
        description: "Inserire un valore numerico valido (usa la virgola).",
        variant: "destructive",
      });
      return;
    }

    updateRetroMutation.mutate({ id: editingRetroId, costo_al_metro: value });
  };

  const handleCancelRetro = () => {
    setEditingRetroId(null);
    setEditRetroCost('');
  };

  const handleAddRetroSave = () => {
    const hNorm = newRetroHeight.trim().replace(',', '.');
    const cNorm = newRetroCost.trim().replace(',', '.');
    const hVal = parseFloat(hNorm);
    const cVal = parseFloat(cNorm);
    if (isNaN(hVal) || isNaN(cVal)) {
      toast({ title: 'Errore', description: 'Inserisci valori validi (usa la virgola per i decimali).', variant: 'destructive' });
      return;
    }
    addRetroMutation.mutate({ altezza: hVal, costo_al_metro: cVal });
  };

  const handleAddRetroCancel = () => {
    setShowAddRetro(false);
    setNewRetroHeight('');
    setNewRetroCost('');
  };

  const handleEditAccessorio = (accessorio: any) => {
    setEditingAccessorioId(accessorio.id);
    setEditAccessorioNome(accessorio.nome);
    setEditAccessorioCosto(accessorio.costo_unitario.toString().replace('.', ','));
  };

  const handleAccessorioSave = () => {
    const cNorm = editAccessorioCosto.trim().replace(',', '.');
    const cVal = parseFloat(cNorm);
    if (isNaN(cVal)) {
      toast({ title: 'Errore', description: 'Inserisci un costo valido (usa la virgola per i decimali).', variant: 'destructive' });
      return;
    }
    updateAccessorioMutation.mutate({ 
      id: editingAccessorioId!, 
      nome: editAccessorioNome.trim(), 
      costo_unitario: cVal 
    });
  };

  const handleAccessorioCancel = () => {
    setEditingAccessorioId(null);
    setEditAccessorioNome('');
    setEditAccessorioCosto('');
  };

  const handleAddAccessorioSave = () => {
    const cNorm = newAccessorioCosto.trim().replace(',', '.');
    const cVal = parseFloat(cNorm);
    if (isNaN(cVal) || !newAccessorioNome.trim()) {
      toast({ title: 'Errore', description: 'Inserisci nome e costo validi (usa la virgola per i decimali).', variant: 'destructive' });
      return;
    }
    addAccessorioMutation.mutate({ nome: newAccessorioNome.trim(), costo_unitario: cVal });
  };

  const handleAddAccessorioCancel = () => {
    setShowAddAccessorio(false);
    setNewAccessorioNome('');
    setNewAccessorioCosto('');
  };

  // Desk accessories handlers
  const handleAddAccessorioDeskSave = () => {
    const cNorm = newAccessorioDeskCosto.trim().replace(',', '.');
    const cVal = parseFloat(cNorm);
    if (isNaN(cVal) || !newAccessorioDeskNome.trim()) {
      toast({ title: 'Errore', description: 'Inserisci nome e costo validi.', variant: 'destructive' });
      return;
    }
    addAccessorioDeskMutation.mutate({ nome: newAccessorioDeskNome.trim(), costo_unitario: cVal });
  };

  const handleAddAccessorioDeskCancel = () => {
    setShowAddAccessorioDesk(false);
    setNewAccessorioDeskNome('');
    setNewAccessorioDeskCosto('');
  };

  // Desk structure costs handlers
  const handleAddCostoStrutturaDeskSave = () => {
    const cNorm = newCostoStrutturaDesk.trim().replace(',', '.');
    const cVal = parseFloat(cNorm);
    if (isNaN(cVal) || !newLayoutDesk.trim()) {
      toast({ title: 'Errore', description: 'Inserisci layout e costo validi.', variant: 'destructive' });
      return;
    }
    addCostoStrutturaDeskMutation.mutate({ layout_desk: newLayoutDesk.trim(), costo_unitario: cVal });
  };

  const handleAddCostoStrutturaEspositoreSave = () => {
    const cNorm = newCostoStrutturaEspositori.trim().replace(',', '.');
    const cVal = parseFloat(cNorm);
    if (isNaN(cVal) || !newLayoutEspositore.trim()) {
      toast({ title: 'Errore', description: 'Inserisci layout e costo validi.', variant: 'destructive' });
      return;
    }
    addCostoStrutturaEspositoreMutation.mutate({ layout_espositore: newLayoutEspositore.trim(), costo_unitario: cVal });
  };

  const handleAddCostoStrutturaDeskCancel = () => {
    setShowAddCostoStrutturaDesk(false);
    setNewLayoutDesk('');
    setNewCostoStrutturaDesk('');
  };

  const handleAddCostoStrutturaEspositoreCancel = () => {
    setShowAddCostoStrutturaEspositori(false);
    setNewLayoutEspositore('');
    setNewCostoStrutturaEspositori('');
  };

  // Espositori accessories mutations
  const addAccessorioEspositoriMutation = useMutation({
    mutationFn: async ({ nome, costo_unitario }: { nome: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('listino_accessori_espositori')
        .insert({ nome, costo_unitario });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-espositori'] });
      toast({ title: 'Accessorio Espositori aggiunto', description: 'Accessorio Espositori aggiunto con successo.' });
      setShowAddAccessorioEspositori(false);
      setNewAccessorioEspositoriNome('');
      setNewAccessorioEspositoriCosto('');
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiungere accessorio Espositori.', variant: 'destructive' });
    },
  });

  const updateAccessorioEspositoriMutation = useMutation({
    mutationFn: async ({ id, nome, costo_unitario }: { id: string; nome: string; costo_unitario: number }) => {
      const { error } = await supabase
        .from('listino_accessori_espositori')
        .update({ nome, costo_unitario })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-espositori'] });
      toast({ title: 'Accessorio Espositori aggiornato', description: 'Accessorio Espositori aggiornato con successo.' });
      setEditingAccessorioEspositori(null);
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile aggiornare accessorio Espositori.', variant: 'destructive' });
    },
  });

  const deleteAccessorioEspositoriMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listino_accessori_espositori')
        .update({ attivo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listino-accessori-espositori'] });
      toast({ title: 'Accessorio Espositori eliminato', description: 'Accessorio Espositori eliminato con successo.' });
    },
    onError: (error: any) => {
      toast({ title: 'Errore', description: error?.message || 'Impossibile eliminare accessorio Espositori.', variant: 'destructive' });
    },
  });

  // Espositori accessories handlers
  const handleAddAccessorioEspositoriSave = () => {
    const cNorm = newAccessorioEspositoriCosto.trim().replace(',', '.');
    const cVal = parseFloat(cNorm);
    if (isNaN(cVal) || !newAccessorioEspositoriNome.trim()) {
      toast({ title: 'Errore', description: 'Inserisci nome e costo validi.', variant: 'destructive' });
      return;
    }
    addAccessorioEspositoriMutation.mutate({ nome: newAccessorioEspositoriNome.trim(), costo_unitario: cVal });
  };

  const handleAddAccessorioEspositoriCancel = () => {
    setShowAddAccessorioEspositori(false);
    setNewAccessorioEspositoriNome('');
    setNewAccessorioEspositoriCosto('');
  };
  const profiliDistribuzione = parametri.filter(p => p.tipo === 'profili_distribuzione');
  const costoAltezza = parametri.filter(p => p.tipo === 'costo_altezza');

  const renderRetroilluminazioneRow = (costo: any) => {
    const altezzaNum = Number(costo.altezza);
    const altezzaStr = isNaN(altezzaNum)
      ? String(costo.altezza ?? '')
      : altezzaNum.toString().replace('.', ',');

    const costoNum = Number(costo.costo_al_metro);
    const costoStr = isNaN(costoNum)
      ? String(costo.costo_al_metro ?? '')
      : costoNum.toFixed(2).replace('.', ',');

    return (
      <TableRow key={costo.id}>
        <TableCell className="font-medium">{altezzaStr}m</TableCell>
        <TableCell>
          {editingRetroId === costo.id ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                inputMode="decimal"
                value={editRetroCost}
                onChange={(e) => setEditRetroCost(e.target.value)}
                className="w-24"
              />
              <Button 
                size="sm" 
                onClick={handleSaveRetro}
                disabled={updateRetroMutation.isPending}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancelRetro}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span>€{costoStr}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleEditRetro(costo)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const renderParameterRow = (parametro: Parametro, showDescription = false) => (
    <TableRow key={parametro.id}>
      <TableCell className="font-medium">
        {showDescription ? parametro.descrizione : parametro.nome}
      </TableCell>
      <TableCell>
        {editingParameter === parametro.id ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-24"
            />
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={updateParameterMutation.isPending}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span>
              {parametro.tipo === 'costo_stampa' || parametro.tipo === 'costo_premontaggio' || parametro.tipo === 'costo_altezza' 
                ? `€ ${parametro.valore?.toFixed(2)}` 
                : parametro.valore
              }
            </span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleEdit(parametro)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );

  if (isLoading) {
    return <div className="p-6">Caricamento...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Amministrazione</h1>
      
      <Tabs defaultValue="parametri" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="utenti">Gestione Utenti</TabsTrigger>
          <TabsTrigger value="parametri">Parametri Preventivatore</TabsTrigger>
        </TabsList>
        
        <TabsContent value="utenti" className="space-y-4">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="parametri" className="space-y-6">
          {/* Parametri a costo unitario */}
          <Card>
            <CardHeader>
              <CardTitle>Parametri a costo unitario</CardTitle>
              <CardDescription>Personalizzare i parametri elencati</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Parametro</TableHead>
                    <TableHead className="w-[100px] text-center">U.M.</TableHead>
                    <TableHead className="w-[150px] text-center">Valore</TableHead>
                    <TableHead className="w-[100px] text-center">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parametriCostiUnitari.map(parametro => (
                    <TableRow key={parametro.id}>
                      <TableCell className="font-medium">{parametro.parametro}</TableCell>
                      <TableCell className="text-center">{parametro.unita_misura}</TableCell>
                      <TableCell className="text-center">
                        {editingParameter === parametro.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          <div className="text-center">€ {parametro.valore?.toFixed(2)}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editingParameter === parametro.id ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const value = parseFloat(editValue);
                                if (!isNaN(value)) {
                                  updateParametriCostiUnitariMutation.mutate({ id: parametro.id, valore: value });
                                  setEditingParameter(null);
                                  setEditValue('');
                                }
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingParameter(null);
                                setEditValue('');
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingParameter(parametro.id);
                              setEditValue(parametro.valore?.toString() || '');
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Numero profili distribuzione */}
          <Card>
            <CardHeader>
              <CardTitle>Numero di Profili per Distribuzione</CardTitle>
              <CardDescription>Numero di profili m/l in funzione della distribuzione</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Distribuzione</TableHead>
                    <TableHead className="w-[200px]">Numero di Profili m/l</TableHead>
                    <TableHead className="w-[120px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiliDistribuzione.map(parametro => renderParameterRow(parametro))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Costo Retroilluminazione */}
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Costo Retroilluminazione</CardTitle>
                  <CardDescription>Costo retroilluminazione al metro lineare in funzione dell'altezza</CardDescription>
                </div>
                <div className="w-[120px] flex justify-end">
                  <Button size="sm" onClick={() => setShowAddRetro((v) => !v)}>
                    {showAddRetro ? 'Annulla' : 'Aggiungi riga'}
                  </Button>
                </div>
              </div>
            </CardHeader>
        <CardContent>
          {showAddRetro && (
            <div className="mb-4 flex items-end gap-2">
              <div className="space-y-2">
                <Label htmlFor="newRetroHeight">Altezza (m)</Label>
                <Input
                  id="newRetroHeight"
                  type="text"
                  inputMode="decimal"
                  placeholder="2,5"
                  value={newRetroHeight}
                  onChange={(e) => setNewRetroHeight(e.target.value)}
                  className="w-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newRetroCost">Costo per m/l</Label>
                <Input
                  id="newRetroCost"
                  type="text"
                  inputMode="decimal"
                  placeholder="270,00"
                  value={newRetroCost}
                  onChange={(e) => setNewRetroCost(e.target.value)}
                  className="w-32"
                />
              </div>
              <Button size="sm" onClick={handleAddRetroSave} disabled={addRetroMutation.isPending}>
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleAddRetroCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Altezza</TableHead>
                <TableHead className="w-[200px]">Costo per m/l</TableHead>
                <TableHead className="w-[120px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costiRetroilluminazione.map(costo => renderRetroilluminazioneRow(costo))}
            </TableBody>
          </Table>
        </CardContent>
          </Card>

          {/* Listino Accessori Stand */}
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Listino Accessori Stand</CardTitle>
                  <CardDescription>Gestione accessori stand con relativi costi</CardDescription>
                </div>
                <div className="w-[120px] flex justify-end">
                  <Button size="sm" onClick={() => setShowAddAccessorio((v) => !v)}>
                    {showAddAccessorio ? 'Annulla' : 'Aggiungi accessorio Stand'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAddAccessorio && (
                <div className="mb-4 flex items-end gap-2">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="newAccessorioNome">Nome accessorio</Label>
                    <Input
                      id="newAccessorioNome"
                      type="text"
                      placeholder="Nome accessorio"
                      value={newAccessorioNome}
                      onChange={(e) => setNewAccessorioNome(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccessorioCosto">Costo unitario (€)</Label>
                    <Input
                      id="newAccessorioCosto"
                      type="text"
                      inputMode="decimal"
                      placeholder="100,00"
                      value={newAccessorioCosto}
                      onChange={(e) => setNewAccessorioCosto(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <Button size="sm" onClick={handleAddAccessorioSave} disabled={addAccessorioMutation.isPending}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAddAccessorioCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nome</TableHead>
                    <TableHead className="w-[200px]">Costo unitario</TableHead>
                    <TableHead className="w-[120px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingAccessori ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">Caricamento...</TableCell>
                    </TableRow>
                  ) : accessoriStand.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">Nessun accessorio trovato</TableCell>
                    </TableRow>
                  ) : (
                    accessoriStand.map((accessorio) => (
                      <TableRow key={accessorio.id}>
                        <TableCell>
                          {editingAccessorioId === accessorio.id ? (
                            <Input
                              value={editAccessorioNome}
                              onChange={(e) => setEditAccessorioNome(e.target.value)}
                              className="w-full"
                            />
                          ) : (
                            accessorio.nome
                          )}
                        </TableCell>
                        <TableCell>
                          {editingAccessorioId === accessorio.id ? (
                            <div className="flex items-center gap-2">
                              <span>€</span>
                              <Input
                                value={editAccessorioCosto}
                                onChange={(e) => setEditAccessorioCosto(e.target.value)}
                                className="w-24"
                              />
                            </div>
                          ) : (
                            `€ ${accessorio.costo_unitario.toString().replace('.', ',')}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingAccessorioId === accessorio.id ? (
                            <div className="flex items-center gap-1">
                              <Button size="sm" onClick={handleAccessorioSave} disabled={updateAccessorioMutation.isPending}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleAccessorioCancel}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" onClick={() => handleEditAccessorio(accessorio)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => deleteAccessorioMutation.mutate(accessorio.id)}
                                disabled={deleteAccessorioMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Listino Accessori Desk */}
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Listino Accessori Desk</CardTitle>
                  <CardDescription>Gestione accessori desk con relativi costi</CardDescription>
                </div>
                <div className="w-[120px] flex justify-end">
                  <Button size="sm" onClick={() => setShowAddAccessorioDesk((v) => !v)}>
                    {showAddAccessorioDesk ? 'Annulla' : 'Aggiungi accessorio desk'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAddAccessorioDesk && (
                <div className="mb-4 flex items-end gap-2">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="newAccessorioDeskNome">Nome accessorio</Label>
                    <Input
                      id="newAccessorioDeskNome"
                      type="text"
                      placeholder="Nome accessorio"
                      value={newAccessorioDeskNome}
                      onChange={(e) => setNewAccessorioDeskNome(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccessorioDeskCosto">Costo unitario (€)</Label>
                    <Input
                      id="newAccessorioDeskCosto"
                      type="text"
                      inputMode="decimal"
                      placeholder="100,00"
                      value={newAccessorioDeskCosto}
                      onChange={(e) => setNewAccessorioDeskCosto(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <Button size="sm" onClick={handleAddAccessorioDeskSave} disabled={addAccessorioDeskMutation.isPending}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAddAccessorioDeskCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nome</TableHead>
                    <TableHead className="w-[200px]">Costo unitario</TableHead>
                    <TableHead className="w-[120px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessoriDesk && accessoriDesk.length > 0 ? (
                    accessoriDesk.map((accessorio) => (
                      <TableRow key={accessorio.id}>
                        <TableCell>
                          {editingAccessorioDesk?.id === accessorio.id ? (
                            <Input
                              value={editingAccessorioDesk.nome}
                              onChange={(e) => setEditingAccessorioDesk({...editingAccessorioDesk, nome: e.target.value})}
                              className="w-full"
                            />
                          ) : (
                            accessorio.nome
                          )}
                        </TableCell>
                        <TableCell>
                          {editingAccessorioDesk?.id === accessorio.id ? (
                            <div className="flex items-center gap-2">
                              <span>€</span>
                              <Input
                                value={editingAccessorioDesk.costo_unitario.toString().replace('.', ',')}
                                onChange={(e) => setEditingAccessorioDesk({...editingAccessorioDesk, costo_unitario: parseFloat(e.target.value.replace(',', '.')) || 0})}
                                className="w-24"
                              />
                            </div>
                          ) : (
                            `€ ${accessorio.costo_unitario.toString().replace('.', ',')}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingAccessorioDesk?.id === accessorio.id ? (
                            <div className="flex items-center gap-1">
                              <Button size="sm" onClick={() => updateAccessorioDeskMutation.mutate(editingAccessorioDesk)} disabled={updateAccessorioDeskMutation.isPending}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingAccessorioDesk(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" onClick={() => setEditingAccessorioDesk(accessorio)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => deleteAccessorioDeskMutation.mutate(accessorio.id)}
                                disabled={deleteAccessorioDeskMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">Nessun accessorio desk trovato</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Listino Accessori Espositori */}
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Listino Accessori Espositori</CardTitle>
                  <CardDescription>Gestione accessori espositori con relativi costi</CardDescription>
                </div>
                <div className="w-[120px] flex justify-end">
                  <Button size="sm" onClick={() => setShowAddAccessorioEspositori((v) => !v)}>
                    {showAddAccessorioEspositori ? 'Annulla' : 'Aggiungi accessorio Espositori'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAddAccessorioEspositori && (
                <div className="mb-4 flex items-end gap-2">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="newAccessorioEspositoriNome">Nome accessorio</Label>
                    <Input
                      id="newAccessorioEspositoriNome"
                      type="text"
                      placeholder="Nome accessorio"
                      value={newAccessorioEspositoriNome}
                      onChange={(e) => setNewAccessorioEspositoriNome(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccessorioEspositoriCosto">Costo unitario (€)</Label>
                    <Input
                      id="newAccessorioEspositoriCosto"
                      type="text"
                      inputMode="decimal"
                      placeholder="100,00"
                      value={newAccessorioEspositoriCosto}
                      onChange={(e) => setNewAccessorioEspositoriCosto(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <Button size="sm" onClick={handleAddAccessorioEspositoriSave} disabled={addAccessorioEspositoriMutation.isPending}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAddAccessorioEspositoriCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nome</TableHead>
                    <TableHead className="w-[200px]">Costo unitario</TableHead>
                    <TableHead className="w-[120px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessoriEspositori && accessoriEspositori.length > 0 ? (
                    accessoriEspositori.map((accessorio) => (
                      <TableRow key={accessorio.id}>
                        <TableCell>
                          {editingAccessorioEspositori?.id === accessorio.id ? (
                            <Input
                              value={editingAccessorioEspositori.nome}
                              onChange={(e) => setEditingAccessorioEspositori({...editingAccessorioEspositori, nome: e.target.value})}
                            />
                          ) : (
                            accessorio.nome
                          )}
                        </TableCell>
                        <TableCell>
                          {editingAccessorioEspositori?.id === accessorio.id ? (
                            <div className="flex items-center gap-2">
                              <span>€</span>
                              <Input
                                value={editingAccessorioEspositori.costo_unitario.toString().replace('.', ',')}
                                onChange={(e) => setEditingAccessorioEspositori({...editingAccessorioEspositori, costo_unitario: parseFloat(e.target.value.replace(',', '.')) || 0})}
                                className="w-24"
                              />
                            </div>
                          ) : (
                            `€ ${accessorio.costo_unitario.toString().replace('.', ',')}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingAccessorioEspositori?.id === accessorio.id ? (
                            <div className="flex items-center gap-1">
                              <Button size="sm" onClick={() => updateAccessorioEspositoriMutation.mutate(editingAccessorioEspositori)} disabled={updateAccessorioEspositoriMutation.isPending}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingAccessorioEspositori(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" onClick={() => setEditingAccessorioEspositori(accessorio)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => deleteAccessorioEspositoriMutation.mutate(accessorio.id)}
                                disabled={deleteAccessorioEspositoriMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">Nessun accessorio espositori trovato</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Costi Struttura Desk per Layout */}
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Costi Struttura Desk per Layout</CardTitle>
                  <CardDescription>Costo struttura desk in funzione del layout</CardDescription>
                </div>
                <div className="w-[120px] flex justify-end">
                  <Button size="sm" onClick={() => setShowAddCostoStrutturaDesk((v) => !v)}>
                    {showAddCostoStrutturaDesk ? 'Annulla' : 'Aggiungi layout Desk'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAddCostoStrutturaDesk && (
                <div className="mb-4 flex items-end gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="newLayoutDesk">Layout Desk</Label>
                    <Input
                      id="newLayoutDesk"
                      type="text"
                      placeholder="50"
                      value={newLayoutDesk}
                      onChange={(e) => setNewLayoutDesk(e.target.value)}
                      className="w-24"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newCostoStrutturaDesk">Costo unitario (€)</Label>
                    <Input
                      id="newCostoStrutturaDesk"
                      type="text"
                      inputMode="decimal"
                      placeholder="415,00"
                      value={newCostoStrutturaDesk}
                      onChange={(e) => setNewCostoStrutturaDesk(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <Button size="sm" onClick={handleAddCostoStrutturaDeskSave} disabled={addCostoStrutturaDeskMutation.isPending}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAddCostoStrutturaDeskCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Layout Desk</TableHead>
                    <TableHead className="w-[200px]">Costo unitario</TableHead>
                    <TableHead className="w-[120px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costiStrutturaDesk && costiStrutturaDesk.length > 0 ? (
                    costiStrutturaDesk.map((costo) => (
                      <TableRow key={costo.id}>
                        <TableCell>
                          {editingCostoStrutturaDesk?.id === costo.id ? (
                            <Input
                              value={editingCostoStrutturaDesk.layout_desk}
                              onChange={(e) => setEditingCostoStrutturaDesk({...editingCostoStrutturaDesk, layout_desk: e.target.value})}
                              className="w-24"
                            />
                          ) : (
                            costo.layout_desk
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCostoStrutturaDesk?.id === costo.id ? (
                            <div className="flex items-center gap-2">
                              <span>€</span>
                              <Input
                                value={editingCostoStrutturaDesk.costo_unitario.toString().replace('.', ',')}
                                onChange={(e) => setEditingCostoStrutturaDesk({...editingCostoStrutturaDesk, costo_unitario: parseFloat(e.target.value.replace(',', '.')) || 0})}
                                className="w-24"
                              />
                            </div>
                          ) : (
                            `€ ${costo.costo_unitario.toString().replace('.', ',')}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCostoStrutturaDesk?.id === costo.id ? (
                            <div className="flex items-center gap-1">
                              <Button size="sm" onClick={() => updateCostoStrutturaDeskMutation.mutate(editingCostoStrutturaDesk)} disabled={updateCostoStrutturaDeskMutation.isPending}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingCostoStrutturaDesk(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" onClick={() => setEditingCostoStrutturaDesk(costo)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => deleteCostoStrutturaDeskMutation.mutate(costo.id)}
                                disabled={deleteCostoStrutturaDeskMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">Nessun costo struttura desk trovato</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Costi Struttura Espositori per Layout */}
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Costi Struttura Espositori per Layout</CardTitle>
                  <CardDescription>Costo struttura espositori in funzione del layout</CardDescription>
                </div>
                <div className="w-[120px] flex justify-end">
                  <Button size="sm" onClick={() => setShowAddCostoStrutturaEspositori((v) => !v)}>
                    {showAddCostoStrutturaEspositori ? 'Annulla' : 'Aggiungi layout Espositore'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAddCostoStrutturaEspositori && (
                <div className="mb-4 flex items-end gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="newLayoutEspositore">Layout Espositore</Label>
                    <Input
                      id="newLayoutEspositore"
                      type="text"
                      placeholder="30"
                      value={newLayoutEspositore}
                      onChange={(e) => setNewLayoutEspositore(e.target.value)}
                      className="w-24"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newCostoStrutturaEspositori">Costo unitario (€)</Label>
                    <Input
                      id="newCostoStrutturaEspositori"
                      type="text"
                      inputMode="decimal"
                      placeholder="193,00"
                      value={newCostoStrutturaEspositori}
                      onChange={(e) => setNewCostoStrutturaEspositori(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <Button size="sm" onClick={handleAddCostoStrutturaEspositoreSave} disabled={addCostoStrutturaEspositoreMutation.isPending}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAddCostoStrutturaEspositoreCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Layout Espositore</TableHead>
                    <TableHead className="w-[200px]">Costo unitario</TableHead>
                    <TableHead className="w-[120px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costiStrutturaEspositori && costiStrutturaEspositori.length > 0 ? (
                    costiStrutturaEspositori.map((costo) => (
                      <TableRow key={costo.id}>
                        <TableCell>
                          {editingCostoStrutturaEspositori?.id === costo.id ? (
                            <Input
                              value={editingCostoStrutturaEspositori.layout_espositore}
                              onChange={(e) => setEditingCostoStrutturaEspositori({...editingCostoStrutturaEspositori, layout_espositore: e.target.value})}
                              className="w-24"
                            />
                          ) : (
                            costo.layout_espositore
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCostoStrutturaEspositori?.id === costo.id ? (
                            <div className="flex items-center gap-2">
                              <span>€</span>
                              <Input
                                value={editingCostoStrutturaEspositori.costo_unitario.toString().replace('.', ',')}
                                onChange={(e) => setEditingCostoStrutturaEspositori({...editingCostoStrutturaEspositori, costo_unitario: parseFloat(e.target.value.replace(',', '.')) || 0})}
                                className="w-24"
                              />
                            </div>
                          ) : (
                            `€ ${costo.costo_unitario.toString().replace('.', ',')}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCostoStrutturaEspositori?.id === costo.id ? (
                            <div className="flex items-center gap-1">
                              <Button size="sm" onClick={() => updateCostoStrutturaEspositoreMutation.mutate(editingCostoStrutturaEspositori)} disabled={updateCostoStrutturaEspositoreMutation.isPending}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingCostoStrutturaEspositori(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" onClick={() => setEditingCostoStrutturaEspositori(costo)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => deleteCostoStrutturaEspositoreMutation.mutate(costo.id)}
                                disabled={deleteCostoStrutturaEspositoreMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">Nessun costo struttura espositori trovato</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}