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
import { CostiRetroilluminazioneBean } from '@/types/preventivo';

/* =====================================================
   CostoRetroilluminazione
===================================================== */
export function CostoRetroilluminazione() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    /* =========================
       STATE
    ========================= */
    const [editingCosto, setEditingCosto] =
        useState<CostiRetroilluminazioneBean | null>(null);

    const [editValue, setEditValue] = useState<string>('');

    const [showAdd, setShowAdd] = useState(false);
    const [newHeight, setNewHeight] = useState('');
    const [newCost, setNewCost] = useState('');

    /* =========================
       QUERY
    ========================= */
    const { data: costi = [] } = useQuery({
        queryKey: ['costi-retroilluminazione'],
        queryFn: () =>
            ParametriAPI.getCostiRetroilluminazione({
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
        mutationFn: ParametriAPI.saveCostiRetroilluminazione,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['costi-retroilluminazione'],
            });
            setEditingCosto(null);
            setEditValue('');
            toast({
                title: 'Costo aggiornato',
                description: 'Costo di retroilluminazione aggiornato.',
            });
        },
    });

    const addMutation = useMutation({
        mutationFn: ParametriAPI.saveCostiRetroilluminazione,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['costi-retroilluminazione'],
            });
            setShowAdd(false);
            setNewHeight('');
            setNewCost('');
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
    const handleEdit = (row: CostiRetroilluminazioneBean) => {
        setEditingCosto(row);
        setEditValue(row.costoAlMetro.toString().replace('.', ','));
    };

    const handleSave = () => {
        if (!editingCosto) return;

        const value = parseDecimal(editValue);
        if (value === null) {
            toast({
                title: 'Errore',
                description: 'Inserire un valore numerico valido.',
                variant: 'destructive',
            });
            return;
        }

        const updatedCosto: CostiRetroilluminazioneBean = {
            ...editingCosto,
            costoAlMetro: value,
        };

        saveMutation.mutate(updatedCosto);
    };

    const handleAddSave = () => {
        const h = parseDecimal(newHeight);
        const c = parseDecimal(newCost);

        if (h === null || c === null) {
            toast({
                title: 'Errore',
                description: 'Inserire valori validi (usa la virgola).',
                variant: 'destructive',
            });
            return;
        }

        const newCosto: CostiRetroilluminazioneBean = {
            id: null,
            altezza: h,
            costoAlMetro: c,
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
                        <CardTitle>Costo Retroilluminazione</CardTitle>
                        <CardDescription>
                            Costo retroilluminazione al metro lineare in funzione
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
                    <div className="mb-4 flex items-end gap-2">
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

                        <Button size="sm" onClick={handleAddSave} disabled={addMutation.isPending}>
                            <Save className="h-4 w-4" />
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Altezza</TableHead>
                            <TableHead>Costo per m/l</TableHead>
                            <TableHead>Azioni</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {costi.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.altezza} m</TableCell>

                                <TableCell>
                                    {editingCosto?.id === row.id ? (
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-32"
                                        />
                                    ) : (
                                        `€ ${row.costoAlMetro.toFixed(2).replace('.', ',')}`
                                    )}
                                </TableCell>

                                <TableCell>
                                    {editingCosto?.id === row.id ? (
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={handleSave}>
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditingCosto(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(row)}
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
