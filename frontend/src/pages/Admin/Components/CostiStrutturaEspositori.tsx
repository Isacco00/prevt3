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
import { CostiStrutturaEspositoriLayoutBean } from '@/types/parametri';

/* =====================================================
   CostiStrutturaEspositori
===================================================== */
export function CostiStrutturaEspositori() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    /* =========================
       STATE
    ========================= */
    const [editingCosto, setEditingCosto] =
        useState<CostiStrutturaEspositoriLayoutBean | null>(null);

    const [editLayout, setEditLayout] = useState('');
    const [editCosto, setEditCosto] = useState('');

    const [showAdd, setShowAdd] = useState(false);
    const [newLayout, setNewLayout] = useState('');
    const [newCosto, setNewCosto] = useState('');

    /* =========================
       QUERY
    ========================= */
    const { data: costi = [] } = useQuery<CostiStrutturaEspositoriLayoutBean[]>({
        queryKey: ['costi-struttura-espositori'],
        queryFn: () =>
            ParametriAPI.getCostiStrutturaEspositoriLayout({
                attivo: true,
            }),
    });

    /* =========================
       MUTATIONS
    ========================= */
    const saveMutation = useMutation<
        CostiStrutturaEspositoriLayoutBean,
        unknown,
        CostiStrutturaEspositoriLayoutBean
    >({
        mutationFn: ParametriAPI.saveCostiStrutturaEspositoriLayout,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['costi-struttura-espositori'],
            });
            setEditingCosto(null);
            setEditLayout('');
            setEditCosto('');
            toast({
                title: 'Costo aggiornato',
                description: 'Costo struttura espositori aggiornato correttamente.',
            });
        },
    });

    const addMutation = useMutation<
        CostiStrutturaEspositoriLayoutBean,
        unknown,
        CostiStrutturaEspositoriLayoutBean
    >({
        mutationFn: ParametriAPI.saveCostiStrutturaEspositoriLayout,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['costi-struttura-espositori'],
            });
            setShowAdd(false);
            setNewLayout('');
            setNewCosto('');
            toast({
                title: 'Costo aggiunto',
                description: 'Costo struttura espositori aggiunto correttamente.',
            });
        },
    });

    const deleteMutation = useMutation<void, unknown, string>({
        mutationFn: ParametriAPI.deleteCostiStrutturaEspositoriLayout,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['costi-struttura-espositori'],
            });
            toast({
                title: 'Costo eliminato',
                description: 'Costo struttura espositori disattivato.',
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
    const handleEdit = (c: CostiStrutturaEspositoriLayoutBean) => {
        setEditingCosto(c);
        setEditLayout(c.layoutEspositore);
        setEditCosto(c.costoUnitario.toString().replace('.', ','));
    };

    const handleSave = () => {
        if (!editingCosto) return;

        const costo = parseDecimal(editCosto);
        if (!editLayout.trim() || costo === null) {
            toast({
                title: 'Errore',
                description: 'Inserire layout e costo validi.',
                variant: 'destructive',
            });
            return;
        }

        saveMutation.mutate({
            ...editingCosto,
            layoutEspositore: editLayout.trim(),
            costoUnitario: costo,
        });
    };

    const handleAddSave = () => {
        const costo = parseDecimal(newCosto);
        if (!newLayout.trim() || costo === null) {
            toast({
                title: 'Errore',
                description: 'Inserire layout e costo validi.',
                variant: 'destructive',
            });
            return;
        }

        addMutation.mutate({
            layoutEspositore: newLayout.trim(),
            costoUnitario: costo,
            attivo: true,
        } as CostiStrutturaEspositoriLayoutBean);
    };

    /* =========================
       RENDER
    ========================= */
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Costi Struttura Espositori</CardTitle>
                        <CardDescription>
                            Costo struttura espositori in funzione del layout
                        </CardDescription>
                    </div>

                    <Button size="sm" onClick={() => setShowAdd(v => !v)}>
                        {showAdd ? 'Annulla' : 'Aggiungi layout'}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {showAdd && (
                    <div className="mb-4 flex items-end gap-2">
                        <div className="space-y-2">
                            <Label>Layout Espositore</Label>
                            <Input
                                value={newLayout}
                                onChange={e => setNewLayout(e.target.value)}
                                className="w-32"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Costo unitario (€)</Label>
                            <Input
                                value={newCosto}
                                onChange={e => setNewCosto(e.target.value)}
                                placeholder="193,00"
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
                            <TableHead>Layout Espositore</TableHead>
                            <TableHead>Costo unitario</TableHead>
                            <TableHead>Azioni</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {costi.map(c => (
                            <TableRow key={c.id}>
                                <TableCell>
                                    {editingCosto?.id === c.id ? (
                                        <Input
                                            value={editLayout}
                                            onChange={e => setEditLayout(e.target.value)}
                                        />
                                    ) : (
                                        c.layoutEspositore
                                    )}
                                </TableCell>

                                <TableCell>
                                    {editingCosto?.id === c.id ? (
                                        <Input
                                            value={editCosto}
                                            onChange={e => setEditCosto(e.target.value)}
                                            className="w-32"
                                        />
                                    ) : (
                                        `€ ${c.costoUnitario
                                            .toFixed(2)
                                            .replace('.', ',')}`
                                    )}
                                </TableCell>

                                <TableCell>
                                    {editingCosto?.id === c.id ? (
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
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(c)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => deleteMutation.mutate(c.id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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
