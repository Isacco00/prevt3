import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {Edit, Save, X, Trash2} from 'lucide-react'

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
import {ListinoAccessoriEspositoriBean} from '@/types/parametri'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

/* =====================================================
   Helpers
===================================================== */

const parseDecimal = (v: string): number | null => {
  const n = Number(v.replace(',', '.'))
  return isNaN(n) ? null : n
}

/* =====================================================
   ListinoAccessoriEspositori
===================================================== */

export function ListinoAccessoriEspositori() {

  const queryClient = useQueryClient()
  const {toast} = useToast()

  /* =========================
     STATE
  ========================= */

  const [editingAccessorio, setEditingAccessorio] =
      useState<ListinoAccessoriEspositoriBean | null>(null)

  const [editNome, setEditNome] = useState('')
  const [editCosto, setEditCosto] = useState('')
  const [editRicarico, setEditRicarico] = useState('')
  const [editDescrizione, setEditDescrizione] = useState('')

  const [showAdd, setShowAdd] = useState(false)
  const [newNome, setNewNome] = useState('')
  const [newCosto, setNewCosto] = useState('')

  /* =========================
     QUERY
  ========================= */

  const {data: accessori = []} =
      useQuery<ListinoAccessoriEspositoriBean[]>({
        queryKey: ['listino-accessori-espositori'],
        queryFn: () =>
            ParametriAPI.getListinoAccessoriEspositori({
              attivo: true,
              sortFields: [{
                field: "LISTINO_ACCESSORI_ESPOSITORI_NOME",
                desc: false
              }]
            }),
      })

  /* =========================
     MUTATIONS
  ========================= */

  const saveMutation = useMutation({
    mutationFn: ParametriAPI.saveListinoAccessoriEspositori,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-espositori'],
      })

      resetEdit()

      toast({
        title: 'Accessorio aggiornato',
        description: 'Accessorio espositori aggiornato correttamente.',
      })
    },
  })

  const addMutation = useMutation({
    mutationFn: ParametriAPI.saveListinoAccessoriEspositori,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-espositori'],
      })

      setShowAdd(false)
      setNewNome('')
      setNewCosto('')

      toast({
        title: 'Accessorio aggiunto',
        description: 'Accessorio espositori aggiunto correttamente.',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ParametriAPI.deleteListinoAccessoriEspositori,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listino-accessori-espositori'],
      })

      toast({
        title: 'Accessorio eliminato',
        description: 'Accessorio espositori disattivato.',
      })
    },
  })

  /* =========================
     HELPERS
  ========================= */

  const resetEdit = () => {
    setEditingAccessorio(null)
    setEditNome('')
    setEditCosto('')
    setEditRicarico('')
    setEditDescrizione('')
  }

  /* =========================
     HANDLERS
  ========================= */

  const handleEdit = (a: ListinoAccessoriEspositoriBean) => {

    setEditingAccessorio(a)

    setEditNome(a.nome)
    setEditCosto(a.costoUnitario.toString().replace('.', ','))
    setEditRicarico((a.ricaricoPercentuale ?? 0).toString())
    setEditDescrizione(a.descrizione ?? '')
  }

  const handleSave = () => {

    if (!editingAccessorio) return

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

    saveMutation.mutate({
      ...editingAccessorio,
      nome: editNome.trim(),
      costoUnitario: costo,
      ricaricoPercentuale: ricarico,
      descrizione: editDescrizione,
    })
  }

  const handleAddSave = () => {

    const costo = parseDecimal(newCosto)

    if (!newNome.trim() || costo === null) {
      toast({
        title: 'Errore',
        description: 'Inserire nome e costo validi.',
        variant: 'destructive',
      })

      return
    }

    addMutation.mutate({
      nome: newNome.trim(),
      costoUnitario: costo,
      ricaricoPercentuale: 0,
      descrizione: '',
      attivo: true,
    } as ListinoAccessoriEspositoriBean)
  }

  /* =========================
     RENDER
  ========================= */

  return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listino Accessori Espositori</CardTitle>
              <CardDescription>
                Gestione accessori espositori con relativi costi
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAdd(v => !v)}>
              {showAdd ? 'Annulla' : 'Aggiungi accessorio'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAdd && (
              <div className="mb-4 flex items-end gap-2">
                <div className="space-y-2 flex-1">
                  <Label>Nome accessorio</Label>
                  <Input
                      value={newNome}
                      onChange={e => setNewNome(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Costo unitario (€)</Label>
                  <Input
                      value={newCosto}
                      onChange={e => setNewCosto(e.target.value)}
                      className="w-32" />
                </div>
                <Button size="sm" onClick={handleAddSave}>
                  <Save className="h-4 w-4"/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAdd(false)}
                >
                  <X className="h-4 w-4"/>
                </Button>
              </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nome</TableHead>
                <TableHead className="w-[100px]">Costo unitario</TableHead>
                <TableHead className="w-[100px]">Ricarico %</TableHead>
                <TableHead className="w-[100px]">Prezzo</TableHead>
                <TableHead className="w-[100px]">Descrizione</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessori.map(a => {
                const prezzo =
                    a.costoUnitario *
                    (1 + (a.ricaricoPercentuale ?? 0) / 100)
                return (
                    <TableRow key={a.id}>
                      <TableCell>
                        {editingAccessorio?.id === a.id
                            ? (
                                <Input
                                    value={editNome}
                                    onChange={e => setEditNome(e.target.value)}
                                />
                            )
                            : a.nome}
                      </TableCell>
                      <TableCell>
                        {editingAccessorio?.id === a.id
                            ? (
                                <Input
                                    value={editCosto}
                                    onChange={e => setEditCosto(e.target.value)}
                                    className="w-32"
                                />
                            )
                            : `€ ${a.costoUnitario.toFixed(2).replace('.', ',')}`}
                      </TableCell>
                      <TableCell>
                        {editingAccessorio?.id === a.id
                            ? (
                                <Input
                                    value={editRicarico}
                                    onChange={e => setEditRicarico(e.target.value)}
                                    className="w-24"
                                />
                            )
                            : `${a.ricaricoPercentuale ?? 0}%`}
                      </TableCell>
                      <TableCell>
                        {editingAccessorio?.id === a.id
                            ? (() => {

                              const costo = parseDecimal(editCosto)
                              const ricarico = parseDecimal(editRicarico)

                              if (costo === null || ricarico === null) return '-'

                              const prezzo = costo * (1 + ricarico / 100)

                              return `€ ${prezzo.toFixed(2).replace('.', ',')}`

                            })()
                            : `€ ${prezzo.toFixed(2).replace('.', ',')}`}
                      </TableCell>
                      <TableCell>
                        {editingAccessorio?.id === a.id
                            ? (
                                <Input
                                    value={editDescrizione}
                                    onChange={e => setEditDescrizione(e.target.value)}
                                />
                            )
                            : a.descrizione}
                      </TableCell>
                      <TableCell>
                        {editingAccessorio?.id === a.id
                            ? (
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={handleSave}>
                                    <Save className="h-4 w-4"/>
                                  </Button>
                                  <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={resetEdit}
                                  >
                                    <X className="h-4 w-4"/>
                                  </Button>
                                </div>
                            )
                            : (
                                <div className="flex gap-2">
                                  <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(a)}
                                  >
                                    <Edit className="h-4 w-4"/>
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <Trash2 className="h-4 w-4"/>
                                      </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Eliminare l’accessorio?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Stai per disattivare "{a.nome}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Annulla
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                deleteMutation.mutate(a.id)
                                            }>
                                          Conferma eliminazione
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                            )}
                      </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  )
}