import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2, Save, X } from 'lucide-react';
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

  // Fetch parameters
  const { data: parametri = [], isLoading } = useQuery({
    queryKey: ['parametri', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('parametri')
        .select('*')
        .eq('user_id', user.id)
        .order('tipo', { ascending: true })
        .order('ordine', { ascending: true });

      if (error) throw error;
      return data as Parametro[];
    },
    enabled: !!user?.id,
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

  // Group parameters by type
  const costoStampa = parametri.filter(p => p.tipo === 'costo_stampa');
  const costoPremontaggio = parametri.filter(p => p.tipo === 'costo_premontaggio');
  const profiliDistribuzione = parametri.filter(p => p.tipo === 'profili_distribuzione');
  const costoAltezza = parametri.filter(p => p.tipo === 'costo_altezza');

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
          {/* Costo stampa grafica */}
          <Card>
            <CardHeader>
              <CardTitle>Costo Stampa Grafica</CardTitle>
              <CardDescription>Costo per la stampa grafica al metro quadro</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parametro</TableHead>
                    <TableHead>Valore</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costoStampa.map(parametro => renderParameterRow(parametro))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Costo premontaggio */}
          <Card>
            <CardHeader>
              <CardTitle>Costo Premontaggio</CardTitle>
              <CardDescription>Costo per il premontaggio al pezzo</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parametro</TableHead>
                    <TableHead>Valore</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costoPremontaggio.map(parametro => renderParameterRow(parametro))}
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
                    <TableHead>Distribuzione</TableHead>
                    <TableHead>Numero di Profili m/l</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiliDistribuzione.map(parametro => renderParameterRow(parametro))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Costo per altezza */}
          <Card>
            <CardHeader>
              <CardTitle>Costo per Altezza</CardTitle>
              <CardDescription>Costo per m/l in funzione dell'altezza</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Altezza</TableHead>
                    <TableHead>Costo per m/l</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costoAltezza.map(parametro => renderParameterRow(parametro))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}