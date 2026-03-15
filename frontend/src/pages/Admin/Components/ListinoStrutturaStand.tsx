import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {Edit, Save, X, Trash2} from 'lucide-react'

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
} from "@/components/ui/alert-dialog"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import {useToast} from '@/hooks/use-toast'

import {ParametriAPI} from '@/api/parametri'
import {ParametriBean} from '@/types/parametri'

/* =====================================================
   CostoStrutturaStandMetroLineareAltezza
===================================================== */

export function ListinoStrutturaStand() {

    const queryClient = useQueryClient()
    const {toast} = useToast()

    /* =========================
       STATE
    ========================= */

    const [editing, setEditing] =
        useState<ParametriBean | null>(null)

    const [editNome, setEditNome] = useState('')
    const [editCosto, setEditCosto] = useState('')
    const [editRicarico, setEditRicarico] = useState('')
    const [editDescrizione, setEditDescrizione] = useState('')

    const [showAdd, setShowAdd] = useState(false)

    const [newNome, setNewNome] = useState('')
    const [newCosto, setNewCosto] = useState('')
    const [newRicarico, setNewRicarico] = useState('')
    const [newDescrizione, setNewDescrizione] = useState('')

    /* =========================
       QUERY
    ========================= */

    const {data: listino = []} = useQuery({
        queryKey: ['listino-struttura-stand-altezza'],
        queryFn: () =>
            ParametriAPI.getParametriList({
                tipo: 'costo_altezza',
                attivo: true,
                sortFields: [
                    { field: 'PARAMETRI_NOME', desc: false },
                    { field: 'PARAMETRI_VALORE', desc: false },
                ],
            }),
    })

    /* =========================
       MUTATIONS
    ========================= */

    const saveMutation = useMutation({
        mutationFn: ParametriAPI.saveParametro,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['listino-struttura-stand-altezza'],
            })
            setEditing(null)
            toast({
                title: 'Voce aggiornata',
                description: 'Costo struttura aggiornato correttamente.',
            })
        },
    })

    const addMutation = useMutation({
        mutationFn: ParametriAPI.saveParametro,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['listino-struttura-stand-altezza'],
            })
            setShowAdd(false)
            toast({
                title: 'Voce aggiunta',
                description: 'Nuova altezza stand aggiunta.',
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: ParametriAPI.saveParametro,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['listino-struttura-stand-altezza'],
            })
            toast({
                title: 'Voce eliminata',
                description: 'Altezza stand disattivata.',
            })
        },
    })

    const handleDelete = (v: ParametriBean) => {
        const updated = {
            ...v,
            attivo: false
        }
        deleteMutation.mutate(updated)
    }

    /* =========================
       HELPERS
    ========================= */

    const parseDecimal = (v: string): number | null => {
        const n = Number(v.replace(',', '.'))
        return isNaN(n) ? null : n
    }

    const calcolaPrezzo = (costo: number, ricarico: number) => {
        return costo * (1 + ricarico / 100)
    }

    /* =========================
       HANDLERS
    ========================= */

    const handleEdit = (v: ParametriBean) => {
        setEditing(v)
        setEditNome(v.nome)
        setEditCosto(v.valore.toString().replace('.', ','))
        setEditRicarico((v.ricaricoPercentuale ?? 0).toString().replace('.', ','))
        setEditDescrizione(v.descrizione ?? '')
    }

    const handleSave = () => {
        if (!editing) return
        const costo = parseDecimal(editCosto)
        const ricarico = parseDecimal(editRicarico)

        if (!editNome.trim() || costo === null || ricarico === null) {
            toast({
                title: 'Errore',
                description: 'Inserire valori validi.',
                variant: 'destructive',
            })
            return
        }

        const updated: ParametriBean = {
            ...editing,
            nome: editNome.trim(),
            valore: costo,
            ricaricoPercentuale: ricarico,
            prezzo: calcolaPrezzo(costo, ricarico),
            descrizione: editDescrizione
        }
        saveMutation.mutate(updated)
    }

    const handleAddSave = () => {
        const costo = parseDecimal(newCosto)
        const ricarico = parseDecimal(newRicarico)
        if (!newNome.trim() || costo === null || ricarico === null) {
            toast({
                title: 'Errore',
                description: 'Inserire valori validi.',
                variant: 'destructive',
            })
            return
        }

        const newRow: ParametriBean = {
            id: null,
            tipo: "costo_altezza",
            nome: newNome.trim(),
            valore: costo,
            ricaricoPercentuale: ricarico,
            prezzo: calcolaPrezzo(costo, ricarico),
            descrizione: newDescrizione,
            attivo: true,
            valoreChiave: ""
        }
        addMutation.mutate(newRow)
    }

    /* =========================
       RENDER
    ========================= */

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>
                            Listino struttura Stand per altezza
                        </CardTitle>
                        <CardDescription>
                            Costo per metro lineare in funzione dell'altezza stand
                        </CardDescription>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setShowAdd(v => !v)}>
                        {showAdd ? 'Annulla' : 'Aggiungi voce'}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {showAdd && (
                    <div className="mb-4 grid grid-cols-5 gap-2 items-end">
                        <div className="space-y-2">
                            <Label>Nome</Label>
                            <Input
                                value={newNome}
                                onChange={(e) => setNewNome(e.target.value)}/>
                        </div>

                        <div className="space-y-2">
                            <Label>Costo (€)</Label>
                            <Input
                                value={newCosto}
                                onChange={(e) => setNewCosto(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Ricarico %</Label>
                            <Input
                                value={newRicarico}
                                onChange={(e) => setNewRicarico(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Descrizione</Label>
                            <Input
                                value={newDescrizione}
                                onChange={(e) => setNewDescrizione(e.target.value)}/>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleAddSave}>
                                <Save className="h-4 w-4"/>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowAdd(false)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Costo</TableHead>
                            <TableHead>Ricarico %</TableHead>
                            <TableHead>Prezzo</TableHead>
                            <TableHead>Descrizione</TableHead>
                            <TableHead>Azioni</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listino.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell>
                                    {editing?.id === v.id
                                        ? <Input value={editNome} onChange={(e) => setEditNome(e.target.value)}/>
                                        : v.nome}
                                </TableCell>
                                <TableCell>
                                    {editing?.id === v.id
                                        ? <Input value={editCosto} onChange={(e) => setEditCosto(e.target.value)} className="w-32"/>
                                        : `€ ${v.valore.toFixed(2).replace('.', ',')}`}
                                </TableCell>
                                <TableCell>
                                    {editing?.id === v.id
                                        ? <Input value={editRicarico} onChange={(e) => setEditRicarico(e.target.value)} className="w-24"/>
                                        : `${v.ricaricoPercentuale ?? 0}%`}
                                </TableCell>
                                <TableCell>
                                    {editing?.id === v.id
                                        ? (() => {
                                            const costo = parseDecimal(editCosto)
                                            const ricarico = parseDecimal(editRicarico)
                                            if (costo === null || ricarico === null) return '-'
                                            const prezzo = calcolaPrezzo(costo, ricarico)
                                            return `€ ${prezzo.toFixed(2).replace('.', ',')}`

                                        })()
                                        : `€ ${(v.valore * (1 + (v.ricaricoPercentuale ?? 0) / 100))
                                        .toFixed(2)
                                        .replace('.', ',')}`}
                                </TableCell>
                                <TableCell>
                                    {editing?.id === v.id
                                        ? <Input value={editDescrizione} onChange={(e) => setEditDescrizione(e.target.value)}/>
                                        : v.descrizione}
                                </TableCell>
                                <TableCell>
                                    {editing?.id === v.id ? (
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={handleSave}>
                                                <Save className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditing(null)}>
                                                <X className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(v)}>
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={deleteMutation.isPending}>
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Eliminare la voce?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Stai per disattivare "{v.nome}".
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(v)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Conferma
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}