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
import {Card, CardContent} from '@/components/ui/card.tsx';
import {Plus, Trash2} from 'lucide-react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from '@/hooks/use-toast.ts';
import {AltriBeniServiziBean} from "@/types/parametri.ts";
import {ParametriAPI} from "@/api/parametri.ts";
import {PreventivoBean} from "@/types/preventivo.ts";

interface AltriBeniServiziSectionProps {
  preventivoId: string;
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}

export function AltriBeniServiziSection({preventivoId, formData, setFormData}: AltriBeniServiziSectionProps) {
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

  const {data: existingItems = [], isLoading} = useQuery({
    queryKey: ['altri-beni-servizi', preventivoId],
    queryFn: () =>
        ParametriAPI.getAltriBeniServiziByPreventivoId({
          preventivoId,
          sortFields: [{field: 'ALTRI_BENI_SERVIZI_CREATED_AT', desc: false}]
        })
  });

  useEffect(() => {
    setItems(existingItems);
    if (existingItems.length > 0) initializedRef.current = true;
  }, [existingItems]);

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

  const firstRowFilled = items.length > 0 &&
      (!!items[0].descrizione || (items[0].costoUnitario || 0) > 0);
  const showAddButton = items.length === 0 || firstRowFilled;

  const totaleListino = items.reduce((s, i) => s + (i.totale || 0), 0);
  const totaleCosti = items.reduce((s, i) => s + ((i.costoUnitario || 0) * (i.quantita || 0)), 0);
  const scontoCliente = (formData.scontoAltriBeniGlobale as number) || 0;
  const totaleNetto = totaleListino * (1 - scontoCliente / 100);
  const margine = totaleNetto - totaleCosti;
  const marginalita = totaleNetto === 0 ? 0 : (margine / totaleNetto) * 100;

  if (isLoading) return <div className="p-4">Caricamento...</div>;

  return (
      <div className="w-full space-y-4">
        <div className="flex justify-end px-2 min-h-[2rem]">
          {showAddButton && (
              <Button type="button" size="sm" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1"/>
                Aggiungi Bene/Servizio
              </Button>
          )}
        </div>

        <div className="w-full [&>div]:overflow-hidden">
        <Table className="table-fixed w-full">
          <colgroup>
            <col style={{width: '3rem'}}/>
            <col/>
            <col style={{width: '7rem'}}/>
            <col style={{width: '6rem'}}/>
            <col style={{width: '7rem'}}/>
            <col style={{width: '5rem'}}/>
            <col style={{width: '7rem'}}/>
            <col style={{width: '3rem'}}/>
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descrizione</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Ricarico %</TableHead>
              <TableHead>Prezzo Unitario</TableHead>
              <TableHead>QTA</TableHead>
              <TableHead className="text-right">Totale</TableHead>
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
                        className="w-full"
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                        type="number"
                        value={item.costoUnitario}
                        onChange={e => updateLocalItem(index, 'costoUnitario', toNumber(e.target.value))}
                        onBlur={() => persistItem(index)}
                        className="w-full"
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                          type="number"
                          maxLength={3}
                          value={item.marginalita}
                          onChange={e => updateLocalItem(index, 'marginalita', toNumber(e.target.value))}
                          onBlur={() => persistItem(index)}
                          className="w-14 px-1 text-right"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    €{(item.prezzoUnitario || 0).toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <Input
                        type="number"
                        maxLength={4}
                        value={item.quantita}
                        onChange={e => updateLocalItem(index, 'quantita', toNumber(e.target.value))}
                        onBlur={() => persistItem(index)}
                        className="w-16 px-1"
                    />
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    €{(item.totale || 0).toFixed(2)}
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
              <TableCell colSpan={6} className="text-right">Totale:</TableCell>
              <TableCell className="text-right">€{totaleListino.toFixed(2)}</TableCell>
              <TableCell/>
            </TableRow>
          </TableBody>
        </Table>
        </div>

        <div className="flex items-center gap-2 px-2">
          <span className="text-sm font-medium">Sconto Cliente:</span>
          <Input
              type="number"
              min="0"
              max="100"
              step="1"
              value={scontoCliente}
              onChange={e => setFormData({
                ...formData,
                scontoAltriBeniGlobale: toNumber(e.target.value)
              })}
              className="w-16 h-7 text-xs text-center"
          />
          <span className="text-xs">%</span>
        </div>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="text-lg font-semibold text-primary mb-2">Vendita</div>
            <div className="grid grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground">Totale Prezzo Listino</div>
                <div className="text-[10px] invisible">-</div>
                <div className="text-lg font-bold">€{totaleListino.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Totale Prezzo Netto</div>
                <div className="text-[10px] text-muted-foreground">(Prezzo scontato)</div>
                <div className="text-lg font-bold text-primary">€{totaleNetto.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Totale Costi</div>
                <div className="text-[10px] invisible">-</div>
                <div className="text-lg font-bold">€{totaleCosti.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Margine</div>
                <div className="text-[10px] invisible">-</div>
                <div className={`text-lg font-bold ${margine < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  €{margine.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Marginalità di vendita</div>
                <div className="text-[10px] invisible">-</div>
                <div className={`text-lg font-bold ${marginalita < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {marginalita.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
