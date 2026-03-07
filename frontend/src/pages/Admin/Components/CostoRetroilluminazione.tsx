import {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Edit, Edit2, Save, X} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {useToast} from '@/hooks/use-toast';

import {ParametriAPI} from '@/api/parametri';
import {ListinoRetroilluminazioneBean} from "@/types/parametri.ts";

/* =====================================================
   CostoRetroilluminazione
===================================================== */
export function CostoRetroilluminazione() {
  const queryClient = useQueryClient();
  const {toast} = useToast();

  /* =========================
     STATE
  ========================= */
  const [editingCosto, setEditingCosto] =
      useState<ListinoRetroilluminazioneBean | null>(null);

  const [editCosto, setEditCosto] = useState<string>('');
  const [editRicarico, setEditRicarico] = useState<string>('');
  const [editDescrizione, setEditDescrizione] = useState<string>('');

  const [showAdd, setShowAdd] = useState(false);
  const [newHeight, setNewHeight] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newRicarico, setNewRicarico] = useState('');
  const [newDescrizione, setNewDescrizione] = useState('');

  /* =========================
     QUERY
  ========================= */
  const {data: costi = []} = useQuery({
    queryKey: ['costi-retroilluminazione'],
    queryFn: () =>
        ParametriAPI.getListinoRetroilluminazione({
          sortFields: [
            {
              field: 'PARAMETRI_COSTI_RETROILLUMINAZIONE_ALTEZZA',
              desc: false,
            },
          ],
        }),
  });

  /* =========================
     MUTATIONS
  ========================= */
  const saveMutation = useMutation({
    mutationFn: ParametriAPI.saveListinoRetroilluminazione,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['costi-retroilluminazione'],
      });
      setEditingCosto(null);
      setEditCosto('');
      setEditRicarico('');
      setEditDescrizione('');
      toast({
        title: 'Listino aggiornato',
        description: 'Listino di retroilluminazione aggiornato.',
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: ParametriAPI.saveListinoRetroilluminazione,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['costi-retroilluminazione'],
      });
      setShowAdd(false);
      setNewHeight('');
      setNewCost('');
      setNewRicarico('');
      setNewDescrizione('');
      toast({
        title: 'Riga aggiunta',
        description: 'Altezza e costo aggiunti con successo.',
      });
    },
  });

  /* =========================
     HELPERS
  ========================= */
  const parseDecimal = (v: string): number | null => {
    const n = Number(v.replace(',', '.'));
    return isNaN(n) ? null : n;
  };

  /* =========================
     HANDLERS
  ========================= */
  const handleEdit = (row: ListinoRetroilluminazioneBean) => {
    setEditingCosto(row);
    setEditCosto(row.costoAlMetro.toString().replace('.', ','));
    setEditRicarico(row.ricaricoPercentuale?.toString().replace('.', ',') ?? '');
    setEditDescrizione(row.descrizione ?? '');
  };
  const handleSave = () => {
    if (!editingCosto) return;
    const costo = parseDecimal(editCosto);
    const ricarico = parseDecimal(editRicarico);
    if (costo === null || ricarico === null) {
      toast({
        title: 'Errore',
        description: 'Inserire valori numerici validi.',
        variant: 'destructive',
      });
      return;
    }
    const prezzo = costo * (1 + ricarico / 100);
    const updatedCosto: ListinoRetroilluminazioneBean = {
      ...editingCosto,
      costoAlMetro: costo,
      ricaricoPercentuale: ricarico,
      prezzo: prezzo,
      descrizione: editDescrizione,
    };
    saveMutation.mutate(updatedCosto);
  };

  const handleAddSave = () => {
    const h = parseDecimal(newHeight);
    const c = parseDecimal(newCost);
    const r = parseDecimal(newRicarico);

    if (h === null || c === null || r === null) {
      toast({
        title: 'Errore',
        description: 'Inserire valori validi.',
        variant: 'destructive',
      });
      return;
    }

    const prezzo = c * (1 + r / 100);

    const newCosto: ListinoRetroilluminazioneBean = {
      id: null,
      altezza: h,
      costoAlMetro: c,
      ricaricoPercentuale: r,
      prezzo: prezzo,
      descrizione: newDescrizione
    };

    addMutation.mutate(newCosto);
  };

  /* =========================
     RENDER
  ========================= */
  return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listino Retroilluminazione</CardTitle>
              <CardDescription>
                Listino retroilluminazione al metro lineare in funzione
                dell&apos;altezza
              </CardDescription>
            </div>

            <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
              {showAdd ? 'Annulla' : 'Aggiungi riga'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showAdd && (
              <div className="mb-4 flex items-end gap-4 flex-wrap">
                <div className="space-y-2">
                  <Label>Altezza (m)</Label>
                  <Input
                      value={newHeight}
                      onChange={(e) => setNewHeight(e.target.value)}
                      placeholder="2,5"
                      className="w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Costo per m/l</Label>
                  <Input
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      placeholder="270,00"
                      className="w-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ricarico %</Label>
                  <Input
                      value={newRicarico}
                      onChange={(e) => setNewRicarico(e.target.value)}
                      placeholder="30"
                      className="w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prezzo</Label>
                  <div className="h-10 flex items-center text-sm font-medium">
                    {(() => {
                      const c = parseDecimal(newCost);
                      const r = parseDecimal(newRicarico);
                      if (c === null || r === null) return '-';

                      const prezzo = c * (1 + r / 100);
                      return `€ ${prezzo.toFixed(2).replace('.', ',')}`;
                    })()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrizione</Label>
                  <Input
                      value={newDescrizione}
                      onChange={(e) => setNewDescrizione(e.target.value)}
                      placeholder="Retroilluminazione standard"
                      className="w-60"
                  />
                </div>
                <Button size="sm" onClick={handleAddSave} disabled={addMutation.isPending}>
                  <Save className="h-4 w-4"/>
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                  <X className="h-4 w-4"/>
                </Button>
              </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Altezza</TableHead>
                <TableHead className="w-[100px]">Costo per m/l</TableHead>
                <TableHead className="w-[100px]">Ricarico %</TableHead>
                <TableHead className="w-[100px]">Prezzo</TableHead>
                <TableHead className="w-[200px]">Descrizione</TableHead>
                <TableHead className="w-[120px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {costi.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.altezza} m</TableCell>

                    <TableCell>
                      {editingCosto?.id === row.id ? (
                          <Input
                              value={editCosto}
                              onChange={(e) => setEditCosto(e.target.value)}
                              className="w-24"/>
                      ) : (
                          `€ ${row.costoAlMetro.toFixed(2).replace('.', ',')}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCosto?.id === row.id ? (
                          <Input
                              value={editRicarico}
                              onChange={(e) => setEditRicarico(e.target.value)}
                              className="w-20"/>
                      ) : (
                          `${row.ricaricoPercentuale ?? 0} %`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCosto?.id === row.id ? (
                          (() => {
                            const costo = parseDecimal(editCosto);
                            const ricarico = parseDecimal(editRicarico);

                            if (costo === null || ricarico === null) return '-';

                            const prezzo = costo * (1 + ricarico / 100);
                            return `€ ${prezzo.toFixed(2).replace('.', ',')}`;
                          })()
                      ) : (
                          `€ ${(row.costoAlMetro * (1 + (row.ricaricoPercentuale ?? 0) / 100))
                          .toFixed(2)
                          .replace('.', ',')}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCosto?.id === row.id ? (
                          <Input
                              value={editDescrizione}
                              onChange={(e) => setEditDescrizione(e.target.value)}/>
                      ) : (
                          row.descrizione
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCosto?.id === row.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave}>
                              <Save className="h-4 w-4"/>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingCosto(null)}>
                              <X className="h-4 w-4"/>
                            </Button>
                          </div>
                      ) : (
                          <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(row)}>
                            <Edit className="h-4 w-4"/>
                          </Button>
                      )}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
