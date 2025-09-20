import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AltriBeniServiziItem {
  id?: string;
  descrizione: string;
  costo_unitario: number;
  marginalita: number;
  prezzo_unitario: number;
  quantita: number;
  totale: number;
}

interface AltriBeniServiziSectionProps {
  preventivoId: string;
}

export const AltriBeniServiziSection: React.FC<AltriBeniServiziSectionProps> = ({ 
  preventivoId 
}) => {
  const [items, setItems] = useState<AltriBeniServiziItem[]>([]);
  const queryClient = useQueryClient();

  // Fetch existing items
  const { data: existingItems, isLoading } = useQuery({
    queryKey: ['altri-beni-servizi', preventivoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('altri_beni_servizi')
        .select('*')
        .eq('preventivo_id', preventivoId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!preventivoId,
  });

  // Initialize items when data is loaded
  useEffect(() => {
    if (existingItems && existingItems.length > 0) {
      setItems(existingItems.map(item => ({
        id: item.id,
        descrizione: item.descrizione,
        costo_unitario: item.costo_unitario,
        marginalita: item.marginalita,
        prezzo_unitario: item.prezzo_unitario,
        quantita: item.quantita,
        totale: item.totale,
      })));
    } else if (!isLoading) {
      // Always start with one empty row
      setItems([{
        descrizione: '',
        costo_unitario: 0,
        marginalita: 0,
        prezzo_unitario: 0,
        quantita: 0,
        totale: 0,
      }]);
    }
  }, [existingItems, isLoading]);

  // Save item mutation
  const saveItemMutation = useMutation({
    mutationFn: async (item: AltriBeniServiziItem) => {
      if (item.id) {
        // Update existing
        const { error } = await supabase
          .from('altri_beni_servizi')
          .update({
            descrizione: item.descrizione,
            costo_unitario: item.costo_unitario,
            marginalita: item.marginalita,
            prezzo_unitario: item.prezzo_unitario,
            quantita: item.quantita,
            totale: item.totale,
          })
          .eq('id', item.id);
        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('altri_beni_servizi')
          .insert({
            preventivo_id: preventivoId,
            descrizione: item.descrizione,
            costo_unitario: item.costo_unitario,
            marginalita: item.marginalita,
            prezzo_unitario: item.prezzo_unitario,
            quantita: item.quantita,
            totale: item.totale,
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['altri-beni-servizi', preventivoId] });
      if (data) {
        // Update the local state with the new ID
        setItems(prev => prev.map((item, idx) => 
          !item.id && idx === prev.length - 1 ? { ...item, id: data.id } : item
        ));
      }
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nel salvataggio del bene/servizio",
        variant: "destructive",
      });
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('altri_beni_servizi')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['altri-beni-servizi', preventivoId] });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nella cancellazione del bene/servizio",
        variant: "destructive",
      });
    },
  });

  // Calculate derived values
  const calculateDerivedValues = (item: AltriBeniServiziItem) => {
    const prezzo_unitario = item.costo_unitario * (1 + item.marginalita / 100);
    const totale = prezzo_unitario * item.quantita;
    return { prezzo_unitario, totale };
  };

  // Update item
  const updateItem = (index: number, field: keyof AltriBeniServiziItem, value: any) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Recalculate derived values
      const derived = calculateDerivedValues(newItems[index]);
      newItems[index].prezzo_unitario = derived.prezzo_unitario;
      newItems[index].totale = derived.totale;
      
      // Save to database
      saveItemMutation.mutate(newItems[index]);
      
      return newItems;
    });
  };

  // Add new item
  const addItem = () => {
    setItems(prev => [...prev, {
      descrizione: '',
      costo_unitario: 0,
      marginalita: 0,
      prezzo_unitario: 0,
      quantita: 0,
      totale: 0,
    }]);
  };

  // Remove item
  const removeItem = (index: number) => {
    const item = items[index];
    if (item.id) {
      deleteItemMutation.mutate(item.id);
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate total
  const totalGeneral = items.reduce((sum, item) => sum + item.totale, 0);

  // Show add button only if the first row has content
  const showAddButton = items.length > 0 && (
    items[0].descrizione.trim() !== '' || 
    items[0].costo_unitario > 0 || 
    items[0].quantita > 0
  );

  if (isLoading) {
    return <div className="p-4">Caricamento...</div>;
  }

  return (

          <div className="w-full">
            {showAddButton && (
              <div className="flex justify-end p-4 border rounded-t-lg">
                <Button
                  onClick={addItem}
                  size="sm"
                  className="flex items-center gap-1"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi Bene/Servizio
                </Button>
              </div>
            )}
          
            <div className="w-full border rounded-b-lg overflow-hidden">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-hsl(var(--section-services))/30">
                    <TableHead className="w-12 text-center">ID</TableHead>
                    <TableHead className="min-w-80">Descrizione</TableHead>
                    <TableHead className="w-28 text-center">Costo UM (€)</TableHead>
                    <TableHead className="w-28 text-center">Marginalità (%)</TableHead>
                    <TableHead className="w-32 text-center">Prezzo Unitario (€)</TableHead>
                    <TableHead className="w-20 text-center">QTA</TableHead>
                    <TableHead className="w-32 text-center">Totale (€)</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
          
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index} className="hover:bg-hsl(var(--section-services))/20">
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.descrizione}
                          onChange={(e) => updateItem(index, 'descrizione', e.target.value)}
                          placeholder="Descrizione del bene/servizio"
                          className="border-0 bg-transparent focus:bg-white/50 resize-none min-h-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.costo_unitario}
                          onChange={(e) => updateItem(index, 'costo_unitario', parseFloat(e.target.value) || 0)}
                          className="border-0 bg-transparent focus:bg-white/50 text-center"
                          step="0.01"
                          min="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.marginalita}
                          onChange={(e) => updateItem(index, 'marginalita', parseFloat(e.target.value) || 0)}
                          className="border-0 bg-transparent focus:bg-white/50 text-center"
                          step="1"
                          min="0"
                          max="200"
                        />
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        €{item.prezzo_unitario.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantita}
                          onChange={(e) => updateItem(index, 'quantita', parseFloat(e.target.value) || 0)}
                          className="border-0 bg-transparent focus:bg-white/50 text-center"
                          step="1"
                          min="0"
                        />
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        €{item.totale.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {items.length > 1 && (
                          <Button
                            onClick={() => removeItem(index)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
          
                  /* Riga Totale */
                  <TableRow className="bg-hsl(var(--section-services))/40 border-t-2 border-hsl(var(--section-services-border))">
                    <TableCell colSpan={6} className="text-right font-semibold">
                      Totale Altri Beni/Servizi:
                    </TableCell>
                    <TableCell className="text-center font-bold text-lg">
                      €{totalGeneral.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

    
/* INIZIO ROUTINE OLD
    
    <Card className="w-full bg-gradient-to-br from-hsl(var(--section-services)) to-hsl(var(--section-services))/80 border-hsl(var(--section-services-border))">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-hsl(var(--section-services-foreground)) flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Altri Beni/Servizi
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="border rounded-lg overflow-hidden">
          {showAddButton && (
            <div className="flex justify-end p-4 bg-hsl(var(--section-services))/20 border-b">
              <Button
                onClick={addItem}
                size="sm"
                className="flex items-center gap-1"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Aggiungi Bene/Servizio
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="bg-hsl(var(--section-services))/30">
                <TableHead className="w-12 text-center">ID</TableHead>
                <TableHead className="min-w-80">Descrizione</TableHead>
                <TableHead className="w-28 text-center">Costo UM (€)</TableHead>
                <TableHead className="w-28 text-center">Marginalità (%)</TableHead>
                <TableHead className="w-32 text-center">Prezzo Unitario (€)</TableHead>
                <TableHead className="w-20 text-center">QTA</TableHead>
                <TableHead className="w-32 text-center">Totale (€)</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} className="hover:bg-hsl(var(--section-services))/20">
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.descrizione}
                      onChange={(e) => updateItem(index, 'descrizione', e.target.value)}
                      placeholder="Descrizione del bene/servizio"
                      className="border-0 bg-transparent focus:bg-white/50 resize-none min-h-[60px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.costo_unitario}
                      onChange={(e) => updateItem(index, 'costo_unitario', parseFloat(e.target.value) || 0)}
                      className="border-0 bg-transparent focus:bg-white/50 text-center"
                      step="0.01"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.marginalita}
                      onChange={(e) => updateItem(index, 'marginalita', parseFloat(e.target.value) || 0)}
                      className="border-0 bg-transparent focus:bg-white/50 text-center"
                      step="1"
                      min="0"
                      max="200"
                    />
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    €{item.prezzo_unitario.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantita}
                      onChange={(e) => updateItem(index, 'quantita', parseFloat(e.target.value) || 0)}
                      className="border-0 bg-transparent focus:bg-white/50 text-center"
                      step="1"
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    €{item.totale.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {items.length > 1 && (
                      <Button
                        onClick={() => removeItem(index)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
             // Total row
              <TableRow className="bg-hsl(var(--section-services))/40 border-t-2 border-hsl(var(--section-services-border))">
                <TableCell colSpan={6} className="text-right font-semibold">
                  Totale Altri Beni/Servizi:
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  €{totalGeneral.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

FINE ROUTINE OLD */
    
  );
};