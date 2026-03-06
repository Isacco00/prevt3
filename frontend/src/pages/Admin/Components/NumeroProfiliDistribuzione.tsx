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
import { ParametriBean } from '@/types/parametri';

/* =====================================================
   NumeroProfiliDistribuzioneTab
===================================================== */
export function NumeroProfiliDistribuzione() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    /* =========================
       STATE
    ========================= */
    const [editingParametro, setEditingParametro] =
        useState<ParametriBean | null>(null);

    const [editValue, setEditValue] = useState<number | null>(null);

    /* =========================
       QUERY
    ========================= */
    const { data: parametri = [] } = useQuery({
        queryKey: ['parametri'],
        queryFn: () =>
            ParametriAPI.getParametriList({
                sortFields: [
                    { field: 'PARAMETRI_NOME', desc: false },
                    { field: 'PARAMETRI_VALORE', desc: false },
                ],
            }),
    });

    // come nel tuo codice originale
    const profiliDistribuzione = parametri.filter(
        (p) => p.tipo === 'profili_distribuzione'
    );

    /* =========================
       MUTATION
    ========================= */
    const saveMutation = useMutation({
        mutationFn: ParametriAPI.saveParametro,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parametri'] });
            setEditingParametro(null);
            setEditValue(null);

            toast({
                title: 'Parametro aggiornato',
                description: 'Numero profili aggiornato correttamente.',
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
    const handleEdit = (parametro: ParametriBean) => {
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

        const updatedParametro: ParametriBean = {
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
                <CardTitle>Numero di Profili per Distribuzione</CardTitle>
                <CardDescription>
                    Numero di profili m/l in funzione della distribuzione
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">
                                Distribuzione
                            </TableHead>
                            <TableHead className="w-[200px]">
                                Numero di Profili m/l
                            </TableHead>
                            <TableHead className="w-[120px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {profiliDistribuzione.map((parametro) => (
                            <TableRow key={parametro.id}>
                                <TableCell className="font-medium">
                                    {parametro.nome}
                                </TableCell>

                                <TableCell>
                                    {editingParametro?.id === parametro.id ? (
                                        <Input
                                            type="number"
                                            step="1"
                                            value={editValue ?? ''}
                                            onChange={(e) =>
                                                setEditValue(Number(e.target.value))
                                            }
                                            className="w-32"
                                        />
                                    ) : (
                                        parametro.valore
                                    )}
                                </TableCell>

                                <TableCell>
                                    {editingParametro?.id === parametro.id ? (
                                        <div className="flex gap-2">
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
