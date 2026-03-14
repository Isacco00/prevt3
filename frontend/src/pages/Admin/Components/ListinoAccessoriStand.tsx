import {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Edit, Save, X, Trash2} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
import {ListinoAccessoriStandBean} from "@/types/parametri.ts";

/* =====================================================
   ListinoAccessoriStand
===================================================== */
export function ListinoAccessoriStand() {
  const queryClient = useQueryClient();
  const {toast} = useToast();

  /* =========================
     STATE
  ========================= */
  const [editingAccessorio, setEditingAccessorio] =
      useState<ListinoAccessoriStandBean | null>(null);

  const [editNome, setEditNome] = useState('');
  const [editCosto, setEditCosto] = useState('');
  const [editRicarico, setEditRicarico] = useState('');
  const [editDescrizione, setEditDescrizione] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newCosto, setNewCosto] = useState('');
  const [newRicarico, setNewRicarico] = useState('');
  const [newDescrizione, setNewDescrizione] = useState('');

  /* =========================
     QUERY
  ========================= */
  const {data: accessori = []} = useQuery({
    queryKey: ['listino-accessori-stand'],
    queryFn: () =>
        ParametriAPI.getListinoAccessoriStand({
          attivo: true, sortFields: [{
            field: "LISTINO_ACCESSORI_STAND_NAME",
            desc: false
          }]
        }),
  });

  /* =========================
     MUTATIONS
  ========================= */
  const saveMutation = useMutation({
    mutationFn: ParametriAPI.saveListinoAccessoriStand,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-stand'],
      });
      setEditingAccessorio(null);
      setEditNome('');
      setEditCosto('');
      toast({
        title: 'Accessorio aggiornato',
        description: 'Accessorio stand aggiornato correttamente.',
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: ParametriAPI.saveListinoAccessoriStand,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-stand'],
      });
      setShowAdd(false);
      setNewNome('');
      setNewCosto('');
      toast({
        title: 'Accessorio aggiunto',
        description: 'Accessorio stand aggiunto correttamente.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ParametriAPI.deleteListinoAccessoriStand,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-stand'],
      });
      toast({
        title: 'Accessorio eliminato',
        description: 'Accessorio stand disattivato.',
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
  const calcolaPrezzo = (costo: number, ricarico: number) => {
    return costo * (1 + ricarico / 100);
  };
  /* =========================
     HANDLERS
  ========================= */
  const handleEdit = (a: ListinoAccessoriStandBean) => {
    setEditingAccessorio(a);
    setEditNome(a.nome);
    setEditCosto(a.costoUnitario.toString().replace('.', ','));
    setEditRicarico((a.ricaricoPercentuale ?? 0).toString().replace('.', ','));
    setEditDescrizione(a.descrizione ?? '');
  };

  const handleSave = () => {
    if (!editingAccessorio) return;
    const costo = parseDecimal(editCosto);
    const ricarico = parseDecimal(editRicarico);
    if (!editNome.trim() || costo === null || ricarico === null) {
      toast({
        title: 'Errore',
        description: 'Inserire valori validi.',
        variant: 'destructive',
      });
      return;
    }

    const updated: ListinoAccessoriStandBean = {
      ...editingAccessorio,
      nome: editNome.trim(),
      costoUnitario: costo,
      ricaricoPercentuale: ricarico,
      prezzo: calcolaPrezzo(costo, ricarico),
      descrizione: editDescrizione
    };

    saveMutation.mutate(updated);
  };

  const handleAddSave = () => {
    const costo = parseDecimal(newCosto);
    const ricarico = parseDecimal(newRicarico);
    if (!newNome.trim() || costo === null || ricarico === null) {
      toast({
        title: 'Errore',
        description: 'Inserire valori validi.',
        variant: 'destructive',
      });
      return;
    }
    const newAccessorio: ListinoAccessoriStandBean = {
      id: null,
      nome: newNome.trim(),
      costoUnitario: costo,
      ricaricoPercentuale: ricarico,
      prezzo: calcolaPrezzo(costo, ricarico),
      descrizione: newDescrizione,
      attivo: true
    };

    addMutation.mutate(newAccessorio);
  };

  /* =========================
     RENDER
  ========================= */
  return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listino Accessori Stand</CardTitle>
              <CardDescription>
                Gestione accessori stand con relativi costi
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
              {showAdd ? 'Annulla' : 'Aggiungi accessorio'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAdd && (
              <div className="mb-4 grid grid-cols-5 gap-2 items-end">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                      value={newNome}
                      onChange={(e) => setNewNome(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label>Costo (€)</Label>
                  <Input
                      value={newCosto}
                      onChange={(e) => setNewCosto(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label>Ricarico %</Label>
                  <Input
                      value={newRicarico}
                      onChange={(e) => setNewRicarico(e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label>Descrizione</Label>
                  <Input
                      value={newDescrizione}
                      onChange={(e) => setNewDescrizione(e.target.value)}/>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddSave}>
                    <Save className="h-4 w-4"/>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                    <X className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nome</TableHead>
                <TableHead className="w-[100px]">Costo unitario</TableHead>
                <TableHead className="w-[100px]">Ricarico %</TableHead>
                <TableHead className="w-[100px]">Prezzo</TableHead>
                <TableHead className="w-[100px]">Descrizione</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {accessori.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          <Input
                              value={editNome}
                              onChange={(e) => setEditNome(e.target.value)}/>
                      ) : (a.nome)}
                    </TableCell>

                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          <Input
                              value={editCosto}
                              onChange={(e) => setEditCosto(e.target.value)}
                              className="w-32"/>
                      ) : (`€ ${a.costoUnitario.toFixed(2).replace('.', ',')}`)}
                    </TableCell>

                    {/* RICARICO */}
                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          <Input
                              value={editRicarico}
                              onChange={(e) => setEditRicarico(e.target.value)}
                              className="w-24"/>
                      ) : (
                          `${a.ricaricoPercentuale ?? 0}%`
                      )}
                    </TableCell>

                    {/* PREZZO */}
                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          (() => {
                            const costo = parseDecimal(editCosto);
                            const ricarico = parseDecimal(editRicarico);

                            if (costo === null || ricarico === null) return '-';

                            const prezzo = costo * (1 + ricarico / 100);
                            return `€ ${prezzo.toFixed(2).replace('.', ',')}`;
                          })()
                      ) : (
                          `€ ${(a.costoUnitario * (1 + (a.ricaricoPercentuale ?? 0) / 100))
                          .toFixed(2)
                          .replace('.', ',')}`
                      )}
                    </TableCell>

                    {/* DESCRIZIONE */}
                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          <Input
                              value={editDescrizione}
                              onChange={(e) => setEditDescrizione(e.target.value)}/>
                      ) : (
                          a.descrizione
                      )}
                    </TableCell>

                    <TableCell>
                      {editingAccessorio?.id === a.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave}>
                              <Save className="h-4 w-4"/>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingAccessorio(null)}>
                              <X className="h-4 w-4"/>
                            </Button>
                          </div>
                      ) : (
                          <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(a)}>
                              <Edit className="h-4 w-4"/>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={deleteMutation.isPending}>
                                  <Trash2 className="h-4 w-4"/>
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
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
