import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CondizioniFornituraData {
  id?: string;
  voce: string;
  testo: string;
  selezionato: boolean;
  ordine: number;
}

interface CondizioniStandardData {
  id: string;
  voce: string;
  testo_standard: string;
  ordine: number;
}

interface CondizioniFornituraProps {
  preventivoId: string;
}

export function CondizioniFornituraSection({ preventivoId }: CondizioniFornituraProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localCondizioni, setLocalCondizioni] = useState<CondizioniFornituraData[]>([]);
  const queryClient = useQueryClient();

  // Fetch standard conditions
  const { data: standardCondizioni } = useQuery({
    queryKey: ['condizioni-standard-fornitura'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('condizioni_standard_fornitura')
        .select('*')
        .eq('attivo', true)
        .order('ordine');
      
      if (error) throw error;
      return data as CondizioniStandardData[];
    }
  });

  // Fetch preventivo conditions
  const { data: preventivoCondizioni } = useQuery({
    queryKey: ['condizioni-fornitura-preventivi', preventivoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('condizioni_fornitura_preventivi')
        .select('*')
        .eq('preventivo_id', preventivoId)
        .order('ordine');
      
      if (error) throw error;
      return data as CondizioniFornituraData[];
    },
    enabled: !!preventivoId
  });

  // Save conditions mutation
  const saveConditionsMutation = useMutation({
    mutationFn: async (condizioni: CondizioniFornituraData[]) => {
      // Delete existing conditions for this preventivo
      await supabase
        .from('condizioni_fornitura_preventivi')
        .delete()
        .eq('preventivo_id', preventivoId);

      // Insert new conditions
      const toInsert = condizioni.map(condizione => ({
        preventivo_id: preventivoId,
        voce: condizione.voce,
        testo: condizione.testo,
        selezionato: condizione.selezionato,
        ordine: condizione.ordine
      }));

      const { error } = await supabase
        .from('condizioni_fornitura_preventivi')
        .insert(toInsert);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Condizioni di fornitura aggiornate con successo");
      queryClient.invalidateQueries({ queryKey: ['condizioni-fornitura-preventivi', preventivoId] });
    },
    onError: (error) => {
      console.error('Error saving conditions:', error);
      toast.error("Errore nel salvare le condizioni di fornitura");
    }
  });

  // Initialize local state
  useEffect(() => {
    if (preventivoCondizioni && preventivoCondizioni.length > 0) {
      // Use saved conditions
      setLocalCondizioni(preventivoCondizioni);
    } else if (standardCondizioni && standardCondizioni.length > 0) {
      // Use standard conditions as default
      const defaultCondizioni = standardCondizioni.map(std => ({
        voce: std.voce,
        testo: std.testo_standard,
        selezionato: true,
        ordine: std.ordine
      }));
      setLocalCondizioni(defaultCondizioni);
    }
  }, [preventivoCondizioni, standardCondizioni]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const updated = [...localCondizioni];
    updated[index].selezionato = checked;
    setLocalCondizioni(updated);
  };

  const handleTextChange = (index: number, text: string) => {
    const updated = [...localCondizioni];
    updated[index].testo = text;
    setLocalCondizioni(updated);
  };

  const handleSave = () => {
    if (localCondizioni.length > 0) {
      saveConditionsMutation.mutate(localCondizioni);
    }
  };

  if (!localCondizioni.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {localCondizioni.map((condizione, index) => (
        <div key={`${condizione.voce}-${index}`} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`condizione-${index}`}
              checked={condizione.selezionato}
              onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
            />
            <Label htmlFor={`condizione-${index}`} className="text-sm font-medium cursor-pointer">
              {condizione.voce}
            </Label>
          </div>
  
          <Textarea
            value={condizione.testo}
            onChange={(e) => handleTextChange(index, e.target.value)}
            placeholder="Inserisci testo"
            className="min-h-[80px] resize-y"
            rows={3}
          />
        </div>
      ))}
  
      <div className="flex justify-end pt-4">
        <Button
          type="button"                 // evita submit del form esterno
          onClick={handleSave}
          disabled={saveConditionsMutation.isPending}
          className="px-4"
        >
          {saveConditionsMutation.isPending ? 'Salvataggio...' : 'Salva Condizioni'}
        </Button>
      </div>
    </div>
  );
}