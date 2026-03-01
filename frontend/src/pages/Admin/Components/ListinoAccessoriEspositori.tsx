import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Save, X, Trash2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';

import { ParametriAPI } from '@/api/parametri';
import { ListinoAccessoriEspositoriBean } from '@/types/parametri';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

/* =====================================================
   ListinoAccessoriEspositori
===================================================== */
export function ListinoAccessoriEspositori() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /* =========================
     STATE
  ========================= */
  const [editingAccessorio, setEditingAccessorio] =
      useState<ListinoAccessoriEspositoriBean | null>(null);

  const [editNome, setEditNome] = useState('');
  const [editCosto, setEditCosto] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newCosto, setNewCosto] = useState('');

  /* =========================
     QUERY
  ========================= */
  const { data: accessori = [] } = useQuery<ListinoAccessoriEspositoriBean[]>({
    queryKey: ['listino-accessori-espositori'],
    queryFn: () =>
        ParametriAPI.getListinoAccessoriEspositori({
          attivo: true,
        }),
  });

  /* =========================
     MUTATIONS
  ========================= */
  const saveMutation = useMutation<
      ListinoAccessoriEspositoriBean,
      unknown,
      ListinoAccessoriEspositoriBean
  >({
    mutationFn: ParametriAPI.saveListinoAccessoriEspositori,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-espositori'],
      });
      setEditingAccessorio(null);
      setEditNome('');
      setEditCosto('');
      toast({
        title: 'Accessorio aggiornato',
        description: 'Accessorio espositori aggiornato correttamente.',
      });
    },
  });

  const addMutation = useMutation<
      ListinoAccessoriEspositoriBean,
      unknown,
      ListinoAccessoriEspositoriBean
  >({
    mutationFn: ParametriAPI.saveListinoAccessoriEspositori,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-espositori'],
      });
      setShowAdd(false);
      setNewNome('');
      setNewCosto('');
      toast({
        title: 'Accessorio aggiunto',
        description: 'Accessorio espositori aggiunto correttamente.',
      });
    },
  });

  const deleteMutation = useMutation<void, unknown, string>({
    mutationFn: ParametriAPI.deleteListinoAccessoriEspositori,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-espositori'],
      });
      toast({
        title: 'Accessorio eliminato',
        description: 'Accessorio espositori disattivato.',
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
  const handleEdit = (a: ListinoAccessoriEspositoriBean) => {
    setEditingAccessorio(a);
    setEditNome(a.nome);
    setEditCosto(a.costoUnitario.toString().replace('.', ','));
  };

  const handleSave = () => {
    if (!editingAccessorio) return;

    const costo = parseDecimal(editCosto);
    if (!editNome.trim() || costo === null) {
      toast({
        title: 'Errore',
        description: 'Inserire nome e costo validi.',
        variant: 'destructive',
      });
      return;
    }

    saveMutation.mutate({
      ...editingAccessorio,
      nome: editNome.trim(),
      costoUnitario: costo,
    });
  };

  const handleAddSave = () => {
    const costo = parseDecimal(newCosto);
    if (!newNome.trim() || costo === null) {
      toast({
        title: 'Errore',
        description: 'Inserire nome e costo validi.',
        variant: 'destructive',
      });
      return;
    }

    addMutation.mutate({
      nome: newNome.trim(),
      costoUnitario: costo,
      attivo: true,
    } as ListinoAccessoriEspositoriBean);
  };

  /* =========================
     RENDER
  ========================= */
  return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listino Accessori Espositori</CardTitle>
              <CardDescription>
                Gestione accessori espositori con relativi costi
              </CardDescription>
            </div>

            <Button size="sm" onClick={() => setShowAdd(v => !v)}>
              {showAdd ? 'Annulla' : 'Aggiungi accessorio'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showAdd && (
              <div className="mb-4 flex items-end gap-2">
                <div className="space-y-2 flex-1">
                  <Label>Nome accessorio</Label>
                  <Input
                      value={newNome}
                      onChange={e => setNewNome(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Costo unitario (€)</Label>
                  <Input
                      value={newCosto}
                      onChange={e => setNewCosto(e.target.value)}
                      placeholder="100,00"
                      className="w-32"
                  />
                </div>

                <Button
                    size="sm"
                    onClick={handleAddSave}
                    disabled={addMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAdd(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Costo unitario</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {accessori.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          <Input
                              value={editNome}
                              onChange={e => setEditNome(e.target.value)}
                          />
                      ) : (
                          a.nome
                      )}
                    </TableCell>

                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          <Input
                              value={editCosto}
                              onChange={e => setEditCosto(e.target.value)}
                              className="w-32"
                          />
                      ) : (
                          `€ ${a.costoUnitario
                          .toFixed(2)
                          .replace('.', ',')}`
                      )}
                    </TableCell>

                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingAccessorio(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                      ) : (
                          <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(a)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Eliminare l’accessorio?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Stai per disattivare l’accessorio "{a.nome}".
                                    L’operazione non può essere annullata.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annulla</AlertDialogCancel>

                                  <AlertDialogAction
                                      onClick={() => deleteMutation.mutate(a.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Conferma eliminazione
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
