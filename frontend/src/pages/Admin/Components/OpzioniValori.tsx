import {useMemo, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Plus, Save, Trash2, X} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {useToast} from "@/hooks/use-toast";

import {ParametriAPI} from "@/api/parametri";
import {ParametriBean} from "@/types/parametri";

interface Props {
  tipo: string;
  title: string;
  description: string;
  valueLabel: string;
  step?: string;
}

export function OpzioniValori({tipo, title, description, valueLabel, step = "0.01"}: Props) {
  const queryClient = useQueryClient();
  const {toast} = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [newValue, setNewValue] = useState("");

  const {data: parametri = []} = useQuery({
    queryKey: ["parametri"],
    queryFn: () =>
        ParametriAPI.getParametriList({
          sortFields: [
            {field: "PARAMETRI_VALORE", desc: false},
          ],
        }),
  });

  const items = useMemo(
      () => parametri.filter((p) => p.tipo === tipo && p.attivo !== false),
      [parametri, tipo]
  );

  const saveMutation = useMutation({
    mutationFn: ParametriAPI.saveParametro,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["parametri"]});
      setShowAdd(false);
      setNewValue("");
      toast({
        title: "Valore aggiunto",
        description: "Lista aggiornata correttamente.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ParametriAPI.deleteParametro,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["parametri"]});
      toast({title: "Valore rimosso"});
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione.",
        variant: "destructive",
      });
    },
  });

  const handleAdd = () => {
    const n = Number(newValue.replace(",", "."));
    if (isNaN(n) || n < 0) {
      toast({
        title: "Errore",
        description: "Inserire un valore numerico >= 0.",
        variant: "destructive",
      });
      return;
    }
    if (items.some((p) => Number(p.valore) === n)) {
      toast({
        title: "Errore",
        description: "Valore già presente in lista.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate({
      tipo,
      nome: String(n),
      valore: n,
      attivo: true,
    } as ParametriBean);
  };

  return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
              {showAdd ? "Annulla" : <><Plus className="h-4 w-4 mr-1"/>Aggiungi</>}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showAdd && (
              <div className="mb-4 flex items-end gap-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">{valueLabel}</label>
                  <Input
                      type="number"
                      step={step}
                      min={0}
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="w-32"/>
                </div>
                <Button size="sm" onClick={handleAdd} disabled={saveMutation.isPending}>
                  <Save className="h-4 w-4"/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAdd(false);
                      setNewValue("");
                    }}>
                  <X className="h-4 w-4"/>
                </Button>
              </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{valueLabel}</TableHead>
                <TableHead className="w-[120px] text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.valore}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminare il valore?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Stai per disattivare il valore {String(p.valore)}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteMutation.mutate(p)}
                                className="bg-destructive text-destructive-foreground">
                              Conferma eliminazione
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
