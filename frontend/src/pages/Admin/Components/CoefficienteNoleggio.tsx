import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Save, X, Trash2, Plus } from 'lucide-react';

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
   CoefficientiNoleggio
===================================================== */
export function CoefficientiNoleggio() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    /* =========================
       STATE
    ========================= */
    const [editing, setEditing] = useState<ParametriBean | null>(null);

    const [form, setForm] = useState({
        nome: '',
        valore: '',
    });

    const [isCreating, setIsCreating] = useState(false);

    const buildParametro = (
        data: Partial<ParametriBean>
    ): ParametriBean => {
        return {
            id: data.id ?? '',
            tipo: data.tipo ?? '',
            nome: data.nome ?? '',
            valore: data.valore ?? 0,
            // opzionali ma gestiti
            valoreTesto: data.valoreTesto ?? undefined,
            valoreChiave: data.valoreChiave ?? undefined,
            ordine: data.ordine ?? 0,
            ricaricoPercentuale: data.ricaricoPercentuale ?? 0,
            prezzo: data.prezzo ?? 0,
            descrizione: data.descrizione ?? '',

            attivo: data.attivo ?? true,
        };
    };
    /* =========================
       QUERY
    ========================= */
    const { data: parametri = [] } = useQuery({
        queryKey: ['parametri'],
        queryFn: () => ParametriAPI.getParametriList({}),
    });

    const coefficienti = parametri.filter(
        (p) => p.tipo === 'coefficiente_noleggio' && p.attivo !== false
    );

    /* =========================
       MUTATIONS
    ========================= */
    const saveMutation = useMutation({
        mutationFn: ParametriAPI.saveParametro,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parametri'] });
            resetForm();

            toast({
                title: 'Salvato',
                description: 'Operazione completata con successo',
            });
        },
    });

    /* =========================
       HELPERS
    ========================= */
    const resetForm = () => {
        setEditing(null);
        setIsCreating(false);
        setForm({ nome: '', valore: '' });
    };

    const handleSave = () => {
        const valore = parseFloat(form.valore.replace(',', '.'));

        if (!form.nome || isNaN(valore)) {
            toast({
                title: 'Errore',
                description: 'Inserire dati validi',
                variant: 'destructive',
            });
            return;
        }

        const payload = buildParametro({
            ...editing,
            tipo: 'coefficiente_noleggio',
            nome: form.nome,
            valore,
            valoreTesto: form.nome, // utile per dropdown

            attivo: true,
        });

        saveMutation.mutate(payload);
    };

    const handleDelete = (p: ParametriBean) => {
        saveMutation.mutate({
            ...p,
            attivo: false,
        });
    };

    const startEdit = (p: ParametriBean) => {
        setEditing(p);
        setForm({
            nome: p.nome,
            valore: String(p.valore),
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
                        <CardTitle>Coefficienti Noleggio</CardTitle>
                        <CardDescription>
                            Gestione coefficienti (es. 1/2 → 0.5)
                        </CardDescription>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            resetForm();
                            setIsCreating(true);
                        }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuovo coefficiente
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Etichetta</TableHead>
                            <TableHead>Valore</TableHead>
                            <TableHead className="w-[120px] text-right">Azioni</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {/* CREATE ROW */}
                        {isCreating && (
                            <TableRow>
                                <TableCell>
                                    <Input
                                        placeholder="Es. 1/2"
                                        value={form.nome}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, nome: e.target.value }))
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        placeholder="0.5"
                                        value={form.valore}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, valore: e.target.value }))
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" onClick={handleSave}>
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={resetForm}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* DATA */}
                        {coefficienti.map((p) => {
                            const isEditing = editing?.id === p.id;

                            return (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                value={form.nome}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, nome: e.target.value }))
                                                }
                                            />
                                        ) : (
                                            p.nome
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                value={form.valore}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, valore: e.target.value }))
                                                }
                                            />
                                        ) : (
                                            p.valore
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" onClick={handleSave}>
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={resetForm}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => startEdit(p)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(p)}>
                                                    <Trash2 className="h-4 w-4" />
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