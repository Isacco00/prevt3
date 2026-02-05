import React, {useState, useEffect, useRef} from 'react';
import {Input} from '@/components/ui/input.tsx';
import {Button} from '@/components/ui/button.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table.tsx';
import {Plus, Trash2} from 'lucide-react';
import {useQuery, useMutation} from '@tanstack/react-query';
import {toast} from '@/hooks/use-toast.ts';
import {AltriBeniServiziBean} from "@/types/parametri.ts";
import {ParametriAPI} from "@/api/parametri.ts";
import {useQueryClient} from '@tanstack/react-query';

interface AltriBeniServiziSectionProps {
  preventivoId: string;
}

export function AltriBeniServiziSection({preventivoId}: AltriBeniServiziSectionProps) {
  const queryClient = useQueryClient();

  const toNumber = (v: unknown): number => {
    if (v === null || v === undefined || v === '') return 0;
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const calculateDerivedValues = (item: AltriBeniServiziBean) => {
    const prezzoUnitario = item.costoUnitario * (1 + item.marginalita / 100);
    const totale = prezzoUnitario * item.quantita;
    return {prezzoUnitario, totale};
  };


  const [items, setItems] = useState<AltriBeniServiziBean[]>([]);
  const initializedRef = useRef(false);

  /* =======================
   * FETCH
   * ======================= */
  const {data: existingItems = [], isLoading} = useQuery({
    queryKey: ['altri-beni-servizi', preventivoId],
    queryFn: () =>
        ParametriAPI.getAltriBeniServiziByPreventivoId({
          preventivoId,
          sortFields: [{field: 'ALTRI_BENI_SERVIZI_CREATED_AT', desc: false}]
        })
  });

  useEffect(() => {
    if (initializedRef.current) return;
    setItems(existingItems);
    initializedRef.current = true;
  }, [existingItems]);

  /* =======================
   * MUTATIONS
   * ======================= */
  const saveMutation = useMutation({
    mutationFn: (item: AltriBeniServiziBean) =>
        ParametriAPI.saveAltriBeniServizi(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['altri-beni-servizi', preventivoId]
      });
    },
    onError: () =>
        toast({
          title: 'Errore',
          description: 'Errore nel salvataggio',
          variant: 'destructive'
        })
  });

  const deleteMutation = useMutation({
    mutationFn: (item: AltriBeniServiziBean) =>
        ParametriAPI.deleteAltriBeniServizi(item),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['altri-beni-servizi', preventivoId]
      });
    },
    onError: () =>
        toast({
          title: 'Errore',
          description: 'Errore nella cancellazione',
          variant: 'destructive'
        })
  });

  /* =======================
   * UPDATE LOCAL
   * ======================= */
  const updateLocalItem = <K extends keyof AltriBeniServiziBean>(
      index: number,
      field: K,
      value: AltriBeniServiziBean[K]
  ) => {
    setItems(prev => {
      const clone = [...prev];
      clone[index] = {...clone[index], [field]: value};

      const derived = calculateDerivedValues(clone[index]);
      clone[index].prezzoUnitario = derived.prezzoUnitario;
      clone[index].totale = derived.totale;

      return clone;
    });
  };

  const persistItem = (index: number) => {
    const item = items[index];
    if (!item) return;
    // evita insert di righe completamente vuote
    item.preventivoId = preventivoId;
    if (!item.id &&
        !item.descrizione &&
        item.quantita === 0 &&
        item.costoUnitario === 0
    ) {
      return;
    }
    saveMutation.mutate(item);
  };


  /* =======================
   * ADD / REMOVE
   * ======================= */
  const addItem = () => {
    setItems(prev => [...prev, {
      id: null,
      preventivoId: preventivoId,
      descrizione: '',
      costoUnitario: 0,
      marginalita: 0,
      prezzoUnitario: 0,
      quantita: 0,
      totale: 0
    }]);
  };

  const removeItem = (index: number) => {
    const item = items[index];
    if (item.id) deleteMutation.mutate(item);
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  /* =======================
   * TOTALI
   * ======================= */
  const totalGeneral = items.reduce((s, i) => s + i.totale, 0);

  if (isLoading) return <div className="p-4">Caricamento...</div>;

  return (
      <div className="w-full">
        <div className="flex justify-end p-2">
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1"/>
            Aggiungi Bene/Servizio
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Descrizione</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Margine %</TableHead>
              <TableHead>Prezzo</TableHead>
              <TableHead>QTA</TableHead>
              <TableHead>Totale</TableHead>
              <TableHead/>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Nessun bene o servizio aggiunto
                  </TableCell>
                </TableRow>
            )}
            {items.map((item, index) => (
                <TableRow key={item.id ?? `tmp-${index}`}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Input
                        value={item.descrizione}
                        onChange={e => updateLocalItem(index, 'descrizione', e.target.value)}
                        onBlur={() => persistItem(index)}
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                        type="number"
                        value={item.costoUnitario}
                        onChange={e => updateLocalItem(index, 'costoUnitario', toNumber(e.target.value))}
                        onBlur={() => persistItem(index)}
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                        type="number"
                        value={item.marginalita}
                        onChange={e => updateLocalItem(index, 'marginalita', toNumber(e.target.value))}
                        onBlur={() => persistItem(index)}
                    />
                  </TableCell>

                  <TableCell className="text-center">
                    €{item.prezzoUnitario.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <Input
                        type="number"
                        value={item.quantita}
                        onChange={e => updateLocalItem(index, 'quantita', toNumber(e.target.value))}
                        onBlur={() => persistItem(index)}
                    />
                  </TableCell>

                  <TableCell className="text-center font-semibold">
                    €{item.totale.toFixed(2)}
                  </TableCell>

                  <TableCell>
                      <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                      </Button>
                  </TableCell>
                </TableRow>
            ))}

            <TableRow className="font-bold">
              <TableCell colSpan={6} className="text-right">
                Totale:
              </TableCell>
              <TableCell>€{totalGeneral.toFixed(2)}</TableCell>
              <TableCell/>
            </TableRow>
          </TableBody>
        </Table>
      </div>
  );
}
