import {useState} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Edit, Save, X, Trash2} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {useToast} from "@/hooks/use-toast";

import {ParametriAPI} from "@/api/parametri";
import {ListinoStrutturaDeskBean} from "@/types/parametri";

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

/* =====================================================
   Helpers
===================================================== */

const formatEuro = (v: number) =>
    v.toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR",
    });

const calculatePrezzo = (costo: number, ricarico: number): number => {
  return costo * (1 + ricarico / 100);
};

/* =====================================================
   Component
===================================================== */

export function ListinoStrutturaDesk() {
  const queryClient = useQueryClient();
  const {toast} = useToast();

  /* =========================
     STATE
  ========================= */

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    layout: 0,
    superficie: 0,
    numeroPezzi: 0,
    descrizione: "",
    costo: 0,
    ricarico: 0,
  });

  const [showAdd, setShowAdd] = useState(false);

  const [newForm, setNewForm] = useState({
    layout: 0,
    superficie: 0,
    numeroPezzi: 0,
    descrizione: "",
    costo: 0,
    ricarico: 0,
  });

  const updateEdit = (field: string, value: number | string) => {
    setEditForm((prev) => ({...prev, [field]: value}));
  };

  const updateNew = (field: string, value: number | string) => {
    setNewForm((prev) => ({...prev, [field]: value}));
  };

  /* =========================
     QUERY
  ========================= */

  const {data: costi = []} = useQuery<ListinoStrutturaDeskBean[]>({
    queryKey: ["costi-struttura-desk"],
    queryFn: () =>
        ParametriAPI.getListinoStrutturaDesk({
          attivo: true, sortFields: [{
            field: "LISTINO_STRUTTURA_DESK_LAYOUT",
            desc: false
          }]
        }),
  });

  /* =========================
     MUTATIONS
  ========================= */

  const saveMutation = useMutation({
    mutationFn: ParametriAPI.saveListinoStrutturaDesk,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["costi-struttura-desk"]});
      queryClient.invalidateQueries({queryKey: ["costi-struttura-desk-layout"]});

      setEditingId(null);
      setShowAdd(false);

      setNewForm({
        layout: 0,
        superficie: 0,
        numeroPezzi: 0,
        descrizione: "",
        costo: 0,
        ricarico: 0,
      });

      toast({
        title: "Operazione completata",
        description: "Listino aggiornato correttamente.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ParametriAPI.deleteListinoStrutturaDesk,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["costi-struttura-desk"]});
      queryClient.invalidateQueries({queryKey: ["costi-struttura-desk-layout"]});

      toast({
        title: "Costo eliminato",
        description: "Costo listino desk disattivato.",
      });
    },
  });

  /* =========================
     HANDLERS
  ========================= */

  const handleEdit = (c: ListinoStrutturaDeskBean) => {
    setEditingId(c.id);

    setEditForm({
      layout: c.layoutDesk,
      superficie: c.superficie ?? 0,
      numeroPezzi: c.numeroPezzi ?? 0,
      descrizione: c.descrizione ?? "",
      costo: c.costoUnitario,
      ricarico: c.ricaricoPercentuale ?? 0,
    });
  };

  const handleSave = (existing?: ListinoStrutturaDeskBean) => {

    const form = existing ? editForm : newForm;

    const costo = form.costo;
    const ricarico = form.ricarico;

    if (!form.layout || costo === null) {
      toast({
        title: "Errore",
        description: "Inserire layout e costo validi.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      ...(existing ?? {}),
      layoutDesk: form.layout,
      superficie: form.superficie,
      numeroPezzi: Math.trunc(form.numeroPezzi),
      descrizione: form.descrizione,
      costoUnitario: costo,
      ricaricoPercentuale: ricarico,
      attivo: true,
    });
  };

  /* =========================
     RENDER
  ========================= */

  return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listino Struttura Desk</CardTitle>
              <CardDescription>
                Listino struttura desk in funzione del layout
              </CardDescription>
            </div>

            <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
              {showAdd ? "Annulla" : "Aggiungi layout"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>

          {/* ADD FORM */}

          {showAdd && (
              <div className="mb-4 flex flex-wrap items-end gap-2">

                <div className="space-y-2">
                  <Label>Layout</Label>
                  <Input
                      type="number"
                      value={newForm.layout}
                      onChange={(e) => updateNew("layout", e.target.value)}
                      className="w-32"/>
                </div>

                <div className="space-y-2">
                  <Label>Superficie (mq)</Label>
                  <Input
                      type="number"
                      step="0.01"
                      value={newForm.superficie}
                      onChange={(e) => updateNew("superficie", e.target.value)}
                      className="w-28"/>
                </div>

                <div className="space-y-2">
                  <Label>Nr. pezzi</Label>
                  <Input
                      type="number"
                      step="1"
                      value={newForm.numeroPezzi}
                      onChange={(e) => updateNew("numeroPezzi", e.target.value)}
                      className="w-24"/>
                </div>

                <div className="space-y-2">
                  <Label>Costo</Label>
                  <Input
                      type="number"
                      value={newForm.costo}
                      onChange={(e) => updateNew("costo", e.target.value)}
                      className="w-24"/>
                </div>

                <div className="space-y-2">
                  <Label>Ricarico %</Label>
                  <Input
                      type="number"
                      value={newForm.ricarico}
                      onChange={(e) => updateNew("ricarico", e.target.value)}
                      className="w-24"/>
                </div>

                <div className="space-y-2 grow min-w-[200px]">
                  <Label>Descrizione</Label>
                  <Input
                      value={newForm.descrizione}
                      onChange={(e) => updateNew("descrizione", e.target.value)}/>
                </div>

                <Button size="sm" onClick={() => handleSave()}>
                  <Save className="h-4 w-4"/>
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAdd(false)}>
                  <X className="h-4 w-4"/>
                </Button>
              </div>
          )}

          {/* TABLE */}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Layout</TableHead>
                <TableHead className="w-[120px]">Superficie</TableHead>
                <TableHead className="w-[100px]">Nr. pezzi</TableHead>
                <TableHead className="w-[100px]">Costo</TableHead>
                <TableHead className="w-[100px]">Ricarico %</TableHead>
                <TableHead className="w-[100px]">Prezzo</TableHead>
                <TableHead className="w-[200px]">Descrizione</TableHead>
                <TableHead className="w-[100px] text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {costi.map((c) => {
                const editing = editingId === c.id;

                const costo = editForm.costo;
                const ricarico = editForm.ricarico;

                const prezzoEdit = calculatePrezzo(costo, ricarico);
                const prezzoNormal = calculatePrezzo(
                    c.costoUnitario,
                    c.ricaricoPercentuale ?? 0
                );

                return (
                    <TableRow key={c.id}>

                      {/* LAYOUT */}

                      <TableCell>
                        {editing ? (
                            <Input
                                value={editForm.layout}
                                onChange={(e) =>
                                    updateEdit("layout", e.target.value)
                                }/>
                        ) : (c.layoutDesk)}
                      </TableCell>

                      {/* SUPERFICIE */}
                      <TableCell>
                        {editing ? (
                            <Input
                                type="number"
                                step="0.01"
                                value={editForm.superficie}
                                onChange={(e) =>
                                    updateEdit("superficie", e.target.value)
                                }
                                className="w-24"/>
                        ) : (c.superficie ?? 0)}
                      </TableCell>

                      {/* NUMERO PEZZI */}
                      <TableCell>
                        {editing ? (
                            <Input
                                type="number"
                                step="1"
                                value={editForm.numeroPezzi}
                                onChange={(e) =>
                                    updateEdit("numeroPezzi", e.target.value)
                                }
                                className="w-20"/>
                        ) : (c.numeroPezzi ?? 0)}
                      </TableCell>

                      {/* COSTO */}
                      <TableCell>
                        {editing ? (
                            <Input
                                value={editForm.costo}
                                onChange={(e) =>
                                    updateEdit("costo", e.target.value)
                                }
                                className="w-24"/>
                        ) : (formatEuro(c.costoUnitario))}
                      </TableCell>

                      {/* RICARICO */}
                      <TableCell>
                        {editing ? (
                            <Input
                                value={editForm.ricarico}
                                onChange={(e) =>
                                    updateEdit("ricarico", e.target.value)
                                }
                                className="w-20"/>
                        ) : (`${c.ricaricoPercentuale ?? 0} %`)}
                      </TableCell>

                      {/* PREZZO */}
                      <TableCell>
                        {editing
                            ? prezzoEdit
                                ? `€ ${prezzoEdit.toFixed(2).replace(".", ",")}`
                                : "-"
                            : prezzoNormal
                                ? `€ ${prezzoNormal.toFixed(2).replace(".", ",")}`
                                : "-"}
                      </TableCell>

                      {/* DESCRIZIONE */}
                      <TableCell>
                        {editing ? (
                            <Input
                                value={editForm.descrizione}
                                onChange={(e) =>
                                    updateEdit("descrizione", e.target.value)
                                }/>
                        ) : (c.descrizione)}
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell>
                        {editing ? (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleSave(c)}>
                                <Save className="h-4 w-4"/>
                              </Button>

                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}>
                                <X className="h-4 w-4"/>
                              </Button>
                            </div>
                        ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(c)}>
                                <Edit className="h-4 w-4"/>
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Trash2 className="h-4 w-4"/>
                                  </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Eliminare l’elemento?
                                    </AlertDialogTitle>

                                    <AlertDialogDescription>
                                      Stai per disattivare l’elemento.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Annulla
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={() => deleteMutation.mutate(c.id)}
                                        className="bg-destructive text-destructive-foreground">
                                      Conferma eliminazione
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                        )}
                      </TableCell>
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}