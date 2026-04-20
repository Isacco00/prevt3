import React, {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Edit, Trash2, Search, FileText, Plus, Copy } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {PreventiviAPI} from "@/api/preventivi.ts";
import {PreventivoModal} from "@/components/preventivi/PreventivoModal.tsx";
import {PreventivoBean, PreventivoSectionKey} from "@/types/preventivo.ts";
import {useLocation} from 'react-router-dom';
import {useMutation, useQueryClient} from "@tanstack/react-query";

const Preventivi = () => {
  const location = useLocation();
  // Query per recuperare i preventivi (REST, pattern standard)
  const {
    data: preventivi = [],
  } = useQuery({
    queryKey: ["preventivi"],
    queryFn: PreventiviAPI.getPreventiviList,
  });
  const [focusSection, setFocusSection] = useState<PreventivoSectionKey | null>(null);
  useEffect(() => {
    const state = location.state as {
      openPreventivoId?: string;
      focusSection?: PreventivoSectionKey;
    } | null;

    if (state?.openPreventivoId && preventivi.length > 0) {
      const preventivo = preventivi.find(
          p => p.id === state.openPreventivoId
      );
      if (state?.focusSection) {
        setFocusSection(state.focusSection);
      }
      if (preventivo) {
        setEditingPreventivo(preventivo);
        setForm(preventivo);
        setIsDialogOpen(true);
      }
    }
  }, [location.state, preventivi]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletePreventivo, setDeletePreventivo] = useState<PreventivoBean | null>(null);
  const [editingPreventivo, setEditingPreventivo] = useState<PreventivoBean | null>(null);
  const getEmptyPreventivo = (): PreventivoBean => ({
    accessoriStandConfig: "",
    altezza: 0,
    altezzaStorage: 0,
    bauleTrolley: 0,
    bifaccialita: 0,
    borsa: 0,
    borsaEspositori: 0,
    borsaStandard: 0,
    complementiConfig: "",
    complessita: "",
    costoFisso: 0,
    costoGrafica: 0,
    costoMc: 0,
    costoMq: 0,
    costoPremontaggio: 0,
    costoRetroilluminazione: 0,
    costoStruttura: 0,
    costoTotale: 0,
    createdAt: "",
    dataScadenza: "",
    descrizione: "",
    deskQta: 0,
    distribuzione: 0,
    espositoriConfig: "",
    extraPercComplex: 0,
    extraStandComplesso: 0,
    fronteLuminoso: 0,
    id: null,
    kitFaro100w: 0,
    kitFaro50w: 0,
    larghezza: 0,
    larghezzaStorage: 0,
    layout: "",
    layoutDesk: [],
    layoutStorage: "",
    marginalitaAccessori: 0,
    marginalitaAccessoriDesk: 0,
    marginalitaAccessoriEspositori: 0,
    marginalitaGrafica: 0,
    marginalitaGraficaDesk: 0,
    marginalitaGraficaEspositori: 0,
    marginalitaGraficaStorage: 0,
    marginalitaPremontaggio: 0,
    marginalitaPremontaggioDesk: 0,
    marginalitaPremontaggioEspositori: 0,
    marginalitaPremontaggioStorage: 0,
    marginalitaRetroilluminazione: 0,
    marginalitaStruttura: 0,
    marginalitaStrutturaDesk: 0,
    marginalitaStrutturaEspositori: 0,
    marginalitaStrutturaStorage: 0,
    mensola: 0,
    nicchia: 0,
    note: "",
    numeroPezzi: 0,
    numeroPezziDesk: 0,
    numeroPezziEspositori: 0,
    numeroPezziStorage: 0,
    numeroPorte: "",
    numeroPreventivo: "",
    pedana: 0,
    portaScorrevole: 0,
    premontaggio: true,
    premontaggioStorage: true,
    premontaggioDesk: true,
    premontaggioEspositori: true,
    graficaCordinoAttiva: true,
    graficaStorageAttiva: true,
    graficaDeskAttiva: true,
    graficaEspositoriAttiva: true,
    profondita: 0,
    profonditaStorage: 0,
    prospect: undefined,
    qtaTipo100: 0,
    qtaTipo30: 0,
    qtaTipo50: 0,
    quadroElettrico16a: 0,
    retroilluminazione: 0,
    retroilluminazione100x50x100h: 0,
    retroilluminazione30x30x100h: 0,
    retroilluminazione50x50x100h: 0,
    ripiano100x50: 0,
    ripiano30x30: 0,
    ripiano50x50: 0,
    ripianoInferiore: 0,
    ripianoSuperiore: 0,
    servizioCertificazioni: false,
    servizioIstruzioniAssistenza: false,
    servizioMontaggioSmontaggio: false,
    spotLight: 0,
    staffaMonitor: 0,
    status: "",
    superficieStampa: 0,
    superficieStampaDesk: 0,
    superficieStampaEspositori: 0,
    superficieStampaStorage: 0,
    sviluppoLineare: 0,
    sviluppoMetriLineariStorage: 0,
    tecaPlexiglass: 0,
    tecaPlexiglass100x50x30: 0,
    tecaPlexiglass30x30x30: 0,
    tecaPlexiglass50x50x50: 0,
    titolo: "",
    totale: 0,
    totaleCosti: 0,
    totalePreventivo: 0,
    updatedAt: ""
  });

  const [form, setForm] = useState<PreventivoBean>(getEmptyPreventivo());

  // Filtri
  const filteredPreventivi = preventivi.filter(preventivo => {
    const matchesSearch = preventivo.numeroPreventivo.toLowerCase().includes(searchTerm.toLowerCase()) || preventivo.titolo.toLowerCase().includes(searchTerm.toLowerCase()) || preventivo.prospect?.ragioneSociale?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || preventivo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      bozza: {
        label: 'Bozza',
        variant: 'secondary' as const
      },
      inviato: {
        label: 'Inviato',
        variant: 'default' as const
      },
      accettato: {
        label: 'Accettato',
        variant: 'default' as const
      },
      rifiutato: {
        label: 'Rifiutato',
        variant: 'destructive' as const
      },
      in_revisione: {
        label: 'In Revisione',
        variant: 'outline' as const
      }
    };
    const config = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'secondary' as const
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const openNewDialog = () => {
    setEditingPreventivo(null);
    setForm(getEmptyPreventivo());
    setIsDialogOpen(true);
  };

  const openEditDialog = (preventivo: PreventivoBean) => {
    setEditingPreventivo(preventivo);
    setForm(preventivo);
    setIsDialogOpen(true);
  };

  const queryClient = useQueryClient();
  const deletePreventivoMutation = useMutation({
    mutationFn: (id: string) =>
        PreventiviAPI.deletePreventivo(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preventivi"] });
      setDeletePreventivo(null);
    }
  });
  
  const openCloneDialog = (preventivo: PreventivoBean) => {
    const clonedPreventivo: PreventivoBean = {
      ...preventivo,
      id: null,                 // 🔥 fondamentale
      numeroPreventivo: "",
      status: "bozza",
      createdAt: "",
      updatedAt: ""
    };

    setEditingPreventivo(null);
    setForm(clonedPreventivo);
    setIsDialogOpen(true);
  };

  return <div className="flex-1 space-y-6 p-6">
    <PreventivoModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={form}
        setFormData={setForm}
        isEditing={!!editingPreventivo}
        focusSection={focusSection}
    />

    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Preventivi</h2>
        <p className="text-muted-foreground">
          Gestisci tutti i tuoi preventivi
        </p>
      </div>
      <Button onClick={openNewDialog}>
        <Plus className="mr-2 h-4 w-4"/>
        Nuovo Preventivo
      </Button>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5"/>
          Elenco Preventivi
        </CardTitle>
        <CardDescription>
          Gestisci e visualizza tutti i tuoi preventivi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Cerca per numero, titolo o cliente..." value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)} className="pl-8"/>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtra per stato"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="bozza">Bozza</SelectItem>
              <SelectItem value="inviato">Inviato</SelectItem>
              <SelectItem value="in_revisione">In Revisione</SelectItem>
              <SelectItem value="accettato">Accettato</SelectItem>
              <SelectItem value="rifiutato">Rifiutato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredPreventivi.length === 0 ?
            <div className="text-center py-6 text-muted-foreground">
              Nessun preventivo trovato
            </div> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numero</TableHead>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Dimensioni</TableHead>
                  <TableHead>Elementi Fisici</TableHead>
                  <TableHead>Totale</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Data Creazione</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPreventivi.map(preventivo => <TableRow key={preventivo.id}>
                  <TableCell className="font-medium">
                    {preventivo.numeroPreventivo}
                  </TableCell>
                  <TableCell>{preventivo.titolo}</TableCell>
                  <TableCell>
                    {preventivo.prospect?.ragioneSociale || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{preventivo.profondita}×{preventivo.larghezza}×{preventivo.altezza}m</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Stampa: {preventivo.superficieStampa?.toFixed(2)}m²</div>
                      <div className="text-muted-foreground">
                        {preventivo.sviluppoLineare?.toFixed(2)}m
                        • {preventivo.numeroPezzi?.toFixed(0)}pz
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      €{preventivo.totalePreventivo?.toLocaleString('it-IT', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }) || '0'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(preventivo.status)}
                  </TableCell>
                  <TableCell>
                    {new Date(preventivo.createdAt).toLocaleDateString('it-IT')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(preventivo)}>
                        <Edit className="h-4 w-4"/>
                      </Button>
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openCloneDialog(preventivo)}>
                        <Copy className="h-4 w-4"/>
                      </Button>
                      <Button variant="ghost" size="sm"
                              onClick={() => setDeletePreventivo(preventivo)}
                              className="text-destructive hover:text-destructive/90">
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
              </TableBody>
            </Table>}
      </CardContent>
    </Card>

    {/* Alert Dialog per conferma cancellazione */}
    <AlertDialog open={!!deletePreventivo} onOpenChange={() => setDeletePreventivo(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sei sicuro di cancellare il preventivo?</AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione non può essere annullata. Il preventivo "{deletePreventivo?.titolo}" verrà
            eliminato definitivamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction
              onClick={() => deletePreventivo && deletePreventivoMutation.mutate(deletePreventivo.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Elimina
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
};
export default Preventivi;
