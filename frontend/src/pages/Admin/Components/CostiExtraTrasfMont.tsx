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
import {CostoExtraTrasfMontBean} from "@/types/parametri";

const livelloOrder: Record<string, number> = {Basso: 1, Medio: 2, Alto: 3};

const formatEuro = (v: number) => `€ ${v.toFixed(2).replace(".", ",")}`;

const parseDecimal = (s: string): number | null => {
  const n = Number(s.replace(",", "."));
  return isNaN(n) ? null : n;
};

export function CostiExtraTrasfMont() {
  const queryClient = useQueryClient();
  const {toast} = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMont, setEditMont] = useState("");
  const [editSmont, setEditSmont] = useState("");

  const {data: costi = []} = useQuery<CostoExtraTrasfMontBean[]>({
    queryKey: ["costi-extra-trasf-mont"],
    queryFn: () => ParametriAPI.getCostiExtraTrasfMont({attivo: true}),
  });

  const sorted = [...costi].sort(
      (a, b) => (livelloOrder[a.livello] ?? 99) - (livelloOrder[b.livello] ?? 99)
  );

  const saveMutation = useMutation({
    mutationFn: ParametriAPI.saveCostoExtraTrasfMont,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["costi-extra-trasf-mont"]});
      setEditingId(null);
      setEditMont("");
      setEditSmont("");
      toast({
        title: "Costo aggiornato",
        description: "Costi extra trasferta salvati correttamente.",
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

  const handleEdit = (c: CostoExtraTrasfMontBean) => {
    setEditingId(c.id);
    setEditMont(String(c.costoExtraMont ?? 0));
    setEditSmont(String(c.costoExtraSmont ?? 0));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditMont("");
    setEditSmont("");
  };

  const handleSave = (c: CostoExtraTrasfMontBean) => {
    const mont = parseDecimal(editMont);
    const smont = parseDecimal(editSmont);
    if (mont === null || smont === null || mont < 0 || smont < 0) {
      toast({
        title: "Errore",
        description: "Inserire valori numerici validi (>= 0).",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate({
      ...c,
      costoExtraMont: mont,
      costoExtraSmont: smont,
    });
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle>Costi extra per trasferta (montaggio / smontaggio)</CardTitle>
          <CardDescription>
            Costi extra per persona per giorno di servizio (parking, metro, taxi,
            materiali di consumo) — usati per valorizzare TOTCosti_extra_trasf_mont
            e TOTCosti_extra_trasf_smont.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Livello</TableHead>
                <TableHead className="w-[200px]">Montaggio (€/persona/giorno)</TableHead>
                <TableHead className="w-[200px]">Smontaggio (€/persona/giorno)</TableHead>
                <TableHead className="w-[120px] text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sorted.map((c) => {
                const editing = editingId === c.id;
                return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium uppercase">
                        {c.livello}
                      </TableCell>

                      <TableCell>
                        {editing ? (
                            <Input
                                type="number"
                                step="0.01"
                                min={0}
                                value={editMont}
                                onChange={(e) => setEditMont(e.target.value)}
                                className="w-32"/>
                        ) : (
                            formatEuro(c.costoExtraMont ?? 0)
                        )}
                      </TableCell>

                      <TableCell>
                        {editing ? (
                            <Input
                                type="number"
                                step="0.01"
                                min={0}
                                value={editSmont}
                                onChange={(e) => setEditSmont(e.target.value)}
                                className="w-32"/>
                        ) : (
                            formatEuro(c.costoExtraSmont ?? 0)
                        )}
                      </TableCell>

                      <TableCell>
                        {editing ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                  size="sm"
                                  onClick={() => handleSave(c)}
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
                            <div className="flex justify-end gap-2">
                              <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(c)}>
                                <Edit className="h-4 w-4"/>
                              </Button>
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
