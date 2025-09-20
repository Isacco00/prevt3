import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
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

export const AltriBeniServiziSection: React.FC<AltriBeniServiziSectionProps> = ({ preventivoId }) => {
  const [items, setItems] = useState<AltriBeniServiziItem[]>([]);
  const queryClient = useQueryClient();
  const initializedRef = useRef(false); // inizializza da DB una sola volta

  // --- FETCH ---
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

  // --- INIT SOLO LA PRIMA VOLTA ---
  useEffect(() => {
    if (isLoading) return;
    if (initializedRef.current) return;

    if (existingItems && existingItems.length > 0) {
      setItems(
        existingItems.map((item: any) => ({
          id: item.id,
          descrizione: item.descrizione,
          costo_unitario: item.costo_unitario,
          marginalita: item.marginalita,
          prezzo_unitario: item.prezzo_unitario,
          quantita: item.quantita,
          totale: item.totale,
        }))
      );
    } else {
      // se non c'è nulla, parti con una riga vuota (ma NB: la versione robusta aggiunge su DB con il bottone)
      setItems([
        {
          descrizione: '',
          costo_unitario: 0,
          marginalita: 0,
          prezzo_unitario: 0,
          quantita: 0,
          totale: 0,
        },
      ]);
    }

    initializedRef.current = true;
  }, [existingItems, isLoading]);

  // --- MUTATION SAVE ---
  const saveItemMutation = useMutation({
    mutationFn: async (item: AltriBeniServiziItem) => {
      if (item.id) {
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
        return { id: item.id };
      } else {
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
        return data; // con id
      }
    },
    onSuccess: (data) => {
      // opzionale: potresti evitare invalidate per non avere flicker
      queryClient.invalidateQueries({ queryKey: ['altri-beni-servizi', preventivoId] });

      // Se è un insert, data contiene l'id nuovo → assicuriamoci di averlo nello stato
      if (data && (data as any).id) {
        const newId = (data as any).id;
        setItems((prev) => {
          // se l'ultima riga non ha id, assegnalo
          const clone = [...prev];
          if (clone.length > 0 && !clone[clone.length - 1].id) {
            clone[clone.length - 1] = { ...clone[clone.length - 1], id: newId };
          }
          return clone;
        });
      }
    },
    onError: () => {
      toast({
        title: 'Errore',
        description: 'Errore nel salvataggio del bene/servizio',
        variant: 'destructive',
      });
    },
  });

  // --- MUTATION DELETE ---
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('altri_beni_servizi').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['altri-beni-servizi', preventivoId] });
    },
    onError: () => {
      toast({
        title: 'Errore',
        description: 'Errore nella cancellazione del bene/servizio',
        variant: 'destructive',
      });
    },
  });

  // --- DERIVATE ---
  const calculateDerivedValues = (item: AltriBeniServiziItem) => {
    const prezzo_unitario = item.costo_unitario * (1 + item.marginalita / 100);
    const totale = prezzo_unitario * item.quantita;
    return { prezzo_unitario, totale };
  };

  // --- UPDATE (salva a ogni modifica) ---
  const updateItem = (index: number, field: keyof AltriBeniServiziItem, value: any) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };

      const derived = calculateDerivedValues(newItems[index]);
      newItems[index].prezzo_unitario = derived.prezzo_unitario;
      newItems[index].totale = derived.totale;

      saveItemMutation.mutate(newItems[index]);
      return newItems;
    });
  };

  // --- ADD: crea SUBITO su DB e poi aggiungi in stato con id ---
  const addItem = async () => {
    const nuovo: AltriBeniServiziItem = {
      descrizione: '',
      costo_unitario: 0,
      marginalita: 0,
      prezzo_unitario: 0,
      quantita: 0,
      totale: 0,
    };

    const { data, error } = await supabase
      .from('altri_beni_servizi')
      .insert({
        preventivo_id: preventivoId,
        ...nuovo,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Errore',
        description: 'Impossibile aggiungere il bene/servizio.',
        variant: 'destructive',
      });
      return;
    }

    setItems((prev) => [...prev, { ...nuovo, id: data.id }]);
    // NB: niente invalidate qui per evitare flicker; i prossimi salvataggi aggiorneranno DB
  };

  // --- REMOVE ---
  const removeItem = (index: number) => {
    const item = items[index];
    if (item?.id) {
      deleteItemMutation.mutate(item.id);
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // --- TOTALI ---
  const totalGeneral = items.reduce((sum, item) => sum + (item.totale || 0), 0);

  // bottone sempre visibile (più semplice)
  const showAddButton = true;

  if (isLoading && !initializedRef.current) {
    return <div className="p-4">Caricamento...</div>;
  }

  return (
    <div className="w-full">
      {showAddButton && (
        <div className="flex justify-end p-4 border rounded-t-lg">
          <Button onClick={addItem} size="sm" className="flex items-center gap-1" variant="outline">
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
              <TableRow key={item.id ?? `tmp-${index}`} className="hover:bg-hsl(var(--section-services))/20">
                <TableCell className="text-center text-sm text-muted-foreground">{index + 1}</TableCell>

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
                    onChange={(e) => {
                      const val = e.target.value;
                      updateItem(index, 'costo_unitario', val === '' ? 0 : parseFloat(val));
                    }}
                    className="border-0 bg-transparent focus:bg-white/50 text-center"
                    step="0.01"
                    min="0"
                  />
                </TableCell>

                <TableCell>
                  <Input
                    type="number"
                    value={item.marginalita}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateItem(index, 'marginalita', val === '' ? 0 : parseFloat(val));
                    }}
                    className="border-0 bg-transparent focus:bg-white/50 text-center"
                    step="1"
                    min="0"
                    max="200"
                  />
                </TableCell>

                <TableCell className="text-center font-medium">€{item.prezzo_unitario.toFixed(2)}</TableCell>

                <TableCell>
                  <Input
                    type="number"
                    value={item.quantita}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateItem(index, 'quantita', val === '' ? 0 : parseFloat(val));
                    }}
                    className="border-0 bg-transparent focus:bg-white/50 text-center"
                    step="1"
                    min="0"
                  />
                </TableCell>

                <TableCell className="text-center font-semibold">€{item.totale.toFixed(2)}</TableCell>

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

            {/* Riga Totale */}
            <TableRow className="bg-hsl(var(--section-services))/40 border-t-2 border-hsl(var(--section-services-border))">
              <TableCell colSpan={6} className="text-right font-semibold">
                Totale Altri Beni/Servizi:
              </TableCell>
              <TableCell className="text-center font-bold text-lg">€{totalGeneral.toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
