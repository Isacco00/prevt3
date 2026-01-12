import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2, Save, X } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ParametriACostiUnitariBean } from '@/types/parametri';

/* =====================================================
   ParametriTab — SOLO Parametri a Costo Unitario
===================================================== */
export function ParametriACostoUnitario() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    /* =========================
       STATE
    ========================= */
    const [editingParametro, setEditingParametro] =
        useState<ParametriACostiUnitariBean | null>(null);

    const [editValue, setEditValue] = useState<number | null>(null);

    /* =========================
       QUERY
    ========================= */
    const { data: parametriCostiUnitari = [] } = useQuery({
        queryKey: ['parametri-costi-unitari'],
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
            queryClient.invalidateQueries({ queryKey: ['parametri-costi-unitari'] });
            setEditingParametro(null);
            setEditValue(null);

            toast({
                title: 'Parametro aggiornato',
                description: 'Il valore è stato aggiornato correttamente.',
            });
        },
        onError: () => {
            toast({
                title: 'Errore',
                description: 'Errore durante il salvataggio del parametro.',
                variant: 'destructive',
            });
        },
    });

    /* =========================
       HANDLERS
    ========================= */
    const handleEdit = (parametro: ParametriACostiUnitariBean) => {
        setEditingParametro(parametro);
        setEditValue(parametro.valore);
    };

    const handleCancel = () => {
        setEditingParametro(null);
        setEditValue(null);
    };

    const handleSave = () => {
        if (!editingParametro || editValue === null || isNaN(editValue)) {
            toast({
                title: 'Errore',
                description: 'Inserire un valore numerico valido.',
                variant: 'destructive',
            });
            return;
        }
        const updatedParametro: ParametriACostiUnitariBean = {
            ...editingParametro,
            valore: editValue,
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
                            <TableHead className="w-[300px]">Parametro</TableHead>
                            <TableHead className="w-[100px] text-center">U.M.</TableHead>
                            <TableHead className="w-[150px] text-center">Valore</TableHead>
                            <TableHead className="w-[100px] text-center">Azioni</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {parametriCostiUnitari.map((parametro) => (
                            <TableRow key={parametro.id}>
                                <TableCell className="font-medium">
                                    {parametro.parametro}
                                </TableCell>

                                <TableCell className="text-center">
                                    {parametro.unitaMisura}
                                </TableCell>

                                <TableCell className="text-center">
                                    {editingParametro?.id === parametro.id ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={editValue ?? ''}
                                            onChange={(e) =>
                                                setEditValue(Number(e.target.value))
                                            }
                                            className="w-24 mx-auto"
                                        />
                                    ) : (
                                        `€ ${parametro.valore.toFixed(2)}`
                                    )}
                                </TableCell>

                                <TableCell className="text-center">
                                    {editingParametro?.id === parametro.id ? (
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                onClick={handleSave}
                                                disabled={saveMutation.isPending}
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancel}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(parametro)}
                                        >
                                            <Edit2 className="h-4 w-4" />
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
