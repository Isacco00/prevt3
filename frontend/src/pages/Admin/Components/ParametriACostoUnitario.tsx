import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {Edit, Edit2, Save, X} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useToast } from "@/hooks/use-toast";

import { ParametriAPI } from "@/api/parametri";
import { ParametriACostiUnitariBean } from "@/types/parametri";

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

export function ParametriACostoUnitario() {

    const queryClient = useQueryClient();
    const { toast } = useToast();

    /* =========================
       STATE
    ========================= */

    const [editingParametro, setEditingParametro] =
        useState<ParametriACostiUnitariBean | null>(null);

    const [editCosto, setEditCosto] = useState("");
    const [editRicarico, setEditRicarico] = useState("");

    /* =========================
       QUERY
    ========================= */

    const { data: parametriCostiUnitari = [] } = useQuery({
        queryKey: ["parametri-costi-unitari"],
        queryFn: () =>
            ParametriAPI.getParametriACostiUnitari({
                attivo: true,
            }),
    });

    /* =========================
       MUTATION
    ========================= */

    const saveMutation = useMutation({
        mutationFn: ParametriAPI.saveParametriCostiUnitari,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["parametri-costi-unitari"],
            });
            setEditingParametro(null);
            setEditCosto("");
            setEditRicarico("");
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

    const handleEdit = (parametro: ParametriACostiUnitariBean) => {
        setEditingParametro(parametro);
        setEditCosto(String(parametro.valore));
        setEditRicarico(String(parametro.ricaricoPercentuale ?? 0));
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
        const updatedParametro: ParametriACostiUnitariBean = {
            ...editingParametro,
            valore: costo,
            ricaricoPercentuale: ricarico,
        };

        saveMutation.mutate(updatedParametro);
    };

    /* =========================
       RENDER
    ========================= */

    return (
        <Card>
            <CardHeader>
                <CardTitle>Parametri a costo unitario</CardTitle>
                <CardDescription>
                    Personalizzare i parametri elencati
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
                            <TableHead className="w-[200px]">Prezzo</TableHead>
                            <TableHead className="w-[100px]">Azioni</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {parametriCostiUnitari.map((p) => {
                            const isEditing = editingParametro?.id === p.id;
                            const prezzo =
                                p.valore * (1 + (p.ricaricoPercentuale ?? 0) / 100);
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
                                            />
                                        ) : (
                                            formatEuro(p.valore)
                                        )}
                                    </TableCell>

                                    {/* RICARICO */}

                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                value={editRicarico}
                                                onChange={(e) => setEditRicarico(e.target.value)}/>
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

                                    {/* AZIONI */}
                                    <TableCell>
                                        {isEditing ? (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={handleSave}
                                                    disabled={saveMutation.isPending}>
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancel}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(p)}>
                                                <Edit className="h-4 w-4" />
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