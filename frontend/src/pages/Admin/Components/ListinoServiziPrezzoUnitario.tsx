import {useState} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Edit, Save, X} from "lucide-react";

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

import {useToast} from "@/hooks/use-toast";

import {ParametriAPI} from "@/api/parametri";
import {ListinoServiziPrezzoUnitarioBean} from "@/types/parametri";

/* =====================================================
   Helpers
===================================================== */

const parseDecimal = (value: string): number | null => {
  const n = Number(value);
  return isNaN(n) ? null : n;
};

const formatEuro = (value: number) => `€ ${value.toFixed(2)}`;

/* =====================================================
   Component
===================================================== */

export function ListinoServiziPrezzoUnitario() {

  const queryClient = useQueryClient();
  const {toast} = useToast();

  /* =========================
     STATE
  ========================= */

  const [editingParametro, setEditingParametro] =
      useState<ListinoServiziPrezzoUnitarioBean | null>(null);

  const [editCosto, setEditCosto] = useState("");
  const [editRicarico, setEditRicarico] = useState("");
  const [editDescrizione, setEditDescrizione] = useState("");

  /* =========================
     QUERY
  ========================= */

  const {data: parametri = []} = useQuery({
    queryKey: ["listino-servizi-prezzo-unitario"],
    queryFn: () =>
        ParametriAPI.getListinoServiziPrezzoUnitario({
          attivo: true,
          sortFields: [
            {field: "LISTINO_SERVIZI_PREZZO_UNITARIO_PARAMETRO", desc: false},
          ],
        }),
  });

  /* =========================
     MUTATION
  ========================= */

  const saveMutation = useMutation({
    mutationFn: ParametriAPI.saveListinoServiziPrezzoUnitario,
    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["listino-servizi-prezzo-unitario"],
      });

      setEditingParametro(null);
      setEditCosto("");
      setEditRicarico("");
      setEditDescrizione("");

      toast({
        title: "Parametro aggiornato",
        description: "Il valore è stato aggiornato correttamente.",
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

  /* =========================
     HANDLERS
  ========================= */

  const handleEdit = (parametro: ListinoServiziPrezzoUnitarioBean) => {
    setEditingParametro(parametro);
    setEditCosto(String(parametro.costo));
    setEditRicarico(String(parametro.ricaricoPercentuale ?? 0));
    setEditDescrizione(parametro.descrizione ?? "");
  };

  const handleCancel = () => {
    setEditingParametro(null);
  };

  const handleSave = () => {
    if (!editingParametro) return;
    const costo = parseDecimal(editCosto);
    const ricarico = parseDecimal(editRicarico);
    if (costo === null || ricarico === null) {
      toast({
        title: "Errore",
        description: "Inserire valori numerici validi.",
        variant: "destructive",
      });
      return;
    }

    const updated: ListinoServiziPrezzoUnitarioBean = {
      ...editingParametro,
      costo,
      ricaricoPercentuale: ricarico,
      descrizione: editDescrizione,
    };
    saveMutation.mutate(updated);
  };

  /* =========================
     RENDER
  ========================= */

  return (
      <Card>
        <CardHeader>
          <CardTitle>Listino servizi a prezzo unitario</CardTitle>
          <CardDescription>
            Personalizza il costo unitario dei servizi disponibili
          </CardDescription>
        </CardHeader>
        <CardContent>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Parametro</TableHead>
                <TableHead className="w-[100px]">U.M.</TableHead>
                <TableHead className="w-[100px]">Costo</TableHead>
                <TableHead className="w-[100px]">Ricarico %</TableHead>
                <TableHead className="w-[100px]">Prezzo</TableHead>
                <TableHead className="w-[100px]">Descrizione</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {parametri.map((p) => {
                const isEditing = editingParametro?.id === p.id;
                const prezzo =
                    p.costo * (1 + (p.ricaricoPercentuale ?? 0) / 100);
                return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {p.parametro}
                      </TableCell>
                      <TableCell>
                        {p.unitaMisura}
                      </TableCell>

                      {/* COSTO */}

                      <TableCell>
                        {isEditing ? (
                            <Input
                                value={editCosto}
                                onChange={(e) => setEditCosto(e.target.value)}
                                className="w-24"/>
                        ) : (
                            formatEuro(p.costo)
                        )}
                      </TableCell>

                      {/* RICARICO */}
                      <TableCell>
                        {isEditing ? (
                            <Input
                                value={editRicarico}
                                onChange={(e) => setEditRicarico(e.target.value)}
                                className="w-20"/>
                        ) : (
                            `${p.ricaricoPercentuale ?? 0}%`
                        )}
                      </TableCell>

                      {/* PREZZO */}
                      <TableCell>
                        {isEditing ? (() => {
                          const costo = parseDecimal(editCosto);
                          const ricarico = parseDecimal(editRicarico);
                          if (costo === null || ricarico === null) return "-";
                          const prezzo = costo * (1 + ricarico / 100);
                          return formatEuro(prezzo);
                        })() : formatEuro(prezzo)}
                      </TableCell>

                      {/* DESCRIZIONE */}
                      <TableCell>
                        {isEditing ? (
                            <Input
                                value={editDescrizione}
                                onChange={(e) => setEditDescrizione(e.target.value)}/>
                        ) : (
                            p.descrizione
                        )}
                      </TableCell>

                      {/* AZIONI */}
                      <TableCell>
                        {isEditing ? (
                            <div className="flex gap-2">
                              <Button
                                  size="sm"
                                  onClick={handleSave}
                                  disabled={saveMutation.isPending}>
                                <Save className="h-4 w-4"/>
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancel}>
                                <X className="h-4 w-4"/>
                              </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(p)}>
                              <Edit className="h-4 w-4"/>
                            </Button>
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