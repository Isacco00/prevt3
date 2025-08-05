import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, FileText, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface Preventivo {
  id: string;
  numero_preventivo: string;
  titolo: string;
  descrizione?: string;
  prospect_id?: string;
  profondita: number;
  larghezza: number;
  altezza: number;
  layout: string;
  distribuzione: number;
  complessita: string;
  superficie?: number;
  volume?: number;
  superficie_stampa?: number;
  sviluppo_lineare?: number;
  numero_pezzi?: number;
  costo_mq: number;
  costo_mc: number;
  costo_fisso: number;
  totale?: number;
  status: string;
  data_scadenza?: string;
  note?: string;
  created_at: string;
  prospects?: {
    ragione_sociale: string;
  };
}

interface Prospect {
  id: string;
  ragione_sociale: string;
}

const Preventivi = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    numero_preventivo: '',
    titolo: '',
    descrizione: '',
    prospect_id: '',
    profondita: '',
    larghezza: '',
    altezza: '',
    layout: '',
    distribuzione: '',
    complessita: 'normale',
    costo_mq: '',
    costo_mc: '',
    costo_fisso: '',
    status: 'bozza',
    data_scadenza: '',
    note: '',
  });

  // Calcoli automatici degli elementi fisici
  const calculatePhysicalElements = () => {
    if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione) {
      return {
        superficie_stampa: 0,
        superficie_mq: 0,
        sviluppo_lineare: 0,
        numero_pezzi: 0
      };
    }

    const profondita = parseFloat(formData.profondita);
    const larghezza = parseFloat(formData.larghezza);
    const altezza = parseFloat(formData.altezza);
    const distribuzione = parseInt(formData.distribuzione);

    // Superficie di stampa
    let superficie_stampa = 0;
    switch (formData.layout) {
      case '4_lati':
        superficie_stampa = (2 * larghezza + 2 * profondita) * altezza + altezza;
        break;
      case '3_lati':
        superficie_stampa = (larghezza + 2 * profondita) * altezza + altezza;
        break;
      case '2_lati':
        superficie_stampa = (larghezza + profondita) * altezza + altezza;
        break;
      case '1_lato':
        superficie_stampa = larghezza * altezza + altezza;
        break;
      case '0_lati':
        superficie_stampa = 0;
        break;
    }

    // Superficie metri quadri
    const superficie_mq = larghezza * profondita;

    // Sviluppo lineare
    let sviluppo_lineare = 0;
    switch (formData.layout) {
      case '4_lati':
        sviluppo_lineare = 2 * larghezza + 2 * profondita;
        break;
      case '3_lati':
        sviluppo_lineare = larghezza + 2 * profondita;
        break;
      case '2_lati':
        sviluppo_lineare = larghezza + profondita;
        break;
      case '1_lato':
        sviluppo_lineare = larghezza;
        break;
      case '0_lati':
        sviluppo_lineare = 0;
        break;
    }

    // Numero di pezzi
    const profiliPerDistribuzione = {
      1: 6,
      2: 10,
      3: 14,
      4: 18
    };
    const numero_pezzi = sviluppo_lineare * (profiliPerDistribuzione[distribuzione as keyof typeof profiliPerDistribuzione] || 0);

    return {
      superficie_stampa,
      superficie_mq,
      sviluppo_lineare,
      numero_pezzi
    };
  };

  const physicalElements = calculatePhysicalElements();

  // Query per recuperare i preventivi
  const { data: preventivi = [], isLoading } = useQuery({
    queryKey: ['preventivi'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('preventivi')
        .select(`
          *,
          prospects:prospect_id (ragione_sociale)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Preventivo[];
    },
    enabled: !!user,
  });

  // Query per recuperare le anagrafiche
  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects-for-preventivi'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('prospects')
        .select('id, ragione_sociale')
        .eq('user_id', user.id)
        .order('ragione_sociale');
      
      if (error) throw error;
      return data as Prospect[];
    },
    enabled: !!user,
  });

  // Mutation per creare un nuovo preventivo
  const createPreventivoMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('User not authenticated');
      
      // Calcoli automatici
      const profondita = parseFloat(data.profondita);
      const larghezza = parseFloat(data.larghezza);
      const altezza = parseFloat(data.altezza);
      const distribuzione = parseInt(data.distribuzione);
      
      // Calcolo elementi fisici
      const elements = calculatePhysicalElements();
      
      const superficie = larghezza * profondita;
      const volume = superficie * altezza;
      const costoMq = parseFloat(data.costo_mq) || 0;
      const costoMc = parseFloat(data.costo_mc) || 0;
      const costoFisso = parseFloat(data.costo_fisso) || 0;
      const totale = (superficie * costoMq) + (volume * costoMc) + costoFisso;

      const { error } = await supabase.from('preventivi').insert({
        ...data,
        user_id: user.id,
        profondita,
        larghezza,
        altezza,
        distribuzione,
        superficie,
        volume,
        superficie_stampa: elements.superficie_stampa,
        sviluppo_lineare: elements.sviluppo_lineare,
        numero_pezzi: elements.numero_pezzi,
        costo_mq: costoMq,
        costo_mc: costoMc,
        costo_fisso: costoFisso,
        totale,
        prospect_id: data.prospect_id || null,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventivi'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-count'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-in-corso'] });
      queryClient.invalidateQueries({ queryKey: ['preventivi-valore'] });
      queryClient.invalidateQueries({ queryKey: ['ultimi-preventivi'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('Preventivo creato con successo');
    },
    onError: (error) => {
      toast.error('Errore nella creazione del preventivo');
      console.error('Error creating preventivo:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      numero_preventivo: '',
      titolo: '',
      descrizione: '',
      prospect_id: '',
      profondita: '',
      larghezza: '',
      altezza: '',
      layout: '',
      distribuzione: '',
      complessita: 'normale',
      costo_mq: '',
      costo_mc: '',
      costo_fisso: '',
      status: 'bozza',
      data_scadenza: '',
      note: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione base
    if (!formData.numero_preventivo || !formData.titolo || !formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }

    createPreventivoMutation.mutate(formData);
  };

  // Filtri
  const filteredPreventivi = preventivi.filter((preventivo) => {
    const matchesSearch = 
      preventivo.numero_preventivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preventivo.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preventivo.prospects?.ragione_sociale?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || preventivo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      bozza: { label: 'Bozza', variant: 'secondary' as const },
      inviato: { label: 'Inviato', variant: 'default' as const },
      accettato: { label: 'Accettato', variant: 'default' as const },
      rifiutato: { label: 'Rifiutato', variant: 'destructive' as const },
      in_revisione: { label: 'In Revisione', variant: 'outline' as const },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Preventivi</h2>
          <p className="text-muted-foreground">
            Gestisci tutti i tuoi preventivi
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Preventivo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuovo Preventivo</DialogTitle>
              <DialogDescription>
                Crea un nuovo preventivo compilando le 4 sezioni seguenti.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sezione 1: Anagrafica Preventivo */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">1. Anagrafica Preventivo</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero_preventivo">Numero Preventivo *</Label>
                    <Input
                      id="numero_preventivo"
                      value={formData.numero_preventivo}
                      onChange={(e) => setFormData({ ...formData, numero_preventivo: e.target.value })}
                      placeholder="es. PREV-2024-001"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="titolo">Titolo *</Label>
                    <Input
                      id="titolo"
                      value={formData.titolo}
                      onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                      placeholder="Titolo del preventivo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prospect_id">Cliente</Label>
                    <Select value={formData.prospect_id} onValueChange={(value) => setFormData({ ...formData, prospect_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {prospects.map((prospect) => (
                          <SelectItem key={prospect.id} value={prospect.id}>
                            {prospect.ragione_sociale}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Stato</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bozza">Bozza</SelectItem>
                        <SelectItem value="inviato">Inviato</SelectItem>
                        <SelectItem value="in_revisione">In Revisione</SelectItem>
                        <SelectItem value="accettato">Accettato</SelectItem>
                        <SelectItem value="rifiutato">Rifiutato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descrizione">Descrizione</Label>
                  <Textarea
                    id="descrizione"
                    value={formData.descrizione}
                    onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                    placeholder="Descrizione dettagliata del preventivo"
                  />
                </div>
              </div>

              <Separator />

              {/* Sezione 2: Dati di Ingresso */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">2. Dati di Ingresso per il Preventivo</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profondita">Profondità (m) *</Label>
                    <Input
                      id="profondita"
                      type="number"
                      step="0.01"
                      value={formData.profondita}
                      onChange={(e) => setFormData({ ...formData, profondita: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="larghezza">Larghezza (m) *</Label>
                    <Input
                      id="larghezza"
                      type="number"
                      step="0.01"
                      value={formData.larghezza}
                      onChange={(e) => setFormData({ ...formData, larghezza: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="altezza">Altezza (m) *</Label>
                    <Input
                      id="altezza"
                      type="number"
                      step="0.01"
                      value={formData.altezza}
                      onChange={(e) => setFormData({ ...formData, altezza: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="layout">Layout *</Label>
                    <Select value={formData.layout} onValueChange={(value) => setFormData({ ...formData, layout: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4_lati">4 lati</SelectItem>
                        <SelectItem value="3_lati">3 lati</SelectItem>
                        <SelectItem value="2_lati">2 lati</SelectItem>
                        <SelectItem value="1_lato">1 lato</SelectItem>
                        <SelectItem value="0_lati">0 lati</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distribuzione">Distribuzione *</Label>
                    <Select value={formData.distribuzione} onValueChange={(value) => setFormData({ ...formData, distribuzione: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona distribuzione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complessita">Complessità</Label>
                    <Select value={formData.complessita} onValueChange={(value) => setFormData({ ...formData, complessita: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normale">Normale</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sezione 3: Elementi Fisici da Calcolare */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">3. Elementi Fisici da Calcolare</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Superficie di stampa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{physicalElements.superficie_stampa.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">m²</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Superficie metri quadri</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{physicalElements.superficie_mq.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">m²</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Sviluppo lineare</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{physicalElements.sviluppo_lineare.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">m</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Numero di pezzi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{physicalElements.numero_pezzi.toFixed(0)}</div>
                      <p className="text-xs text-muted-foreground">N</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Sezione 4: Preventivo (costi) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">4. Preventivo</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costo_mq">Costo al m² (€)</Label>
                    <Input
                      id="costo_mq"
                      type="number"
                      step="0.01"
                      value={formData.costo_mq}
                      onChange={(e) => setFormData({ ...formData, costo_mq: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="costo_mc">Costo al m³ (€)</Label>
                    <Input
                      id="costo_mc"
                      type="number"
                      step="0.01"
                      value={formData.costo_mc}
                      onChange={(e) => setFormData({ ...formData, costo_mc: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="costo_fisso">Costo Fisso (€)</Label>
                    <Input
                      id="costo_fisso"
                      type="number"
                      step="0.01"
                      value={formData.costo_fisso}
                      onChange={(e) => setFormData({ ...formData, costo_fisso: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data_scadenza">Data Scadenza</Label>
                    <Input
                      id="data_scadenza"
                      type="date"
                      value={formData.data_scadenza}
                      onChange={(e) => setFormData({ ...formData, data_scadenza: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Note aggiuntive"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={createPreventivoMutation.isPending}>
                  {createPreventivoMutation.isPending ? 'Creazione...' : 'Crea Preventivo'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Elenco Preventivi
          </CardTitle>
          <CardDescription>
            Gestisci e visualizza tutti i tuoi preventivi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per numero, titolo o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtra per stato" />
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

          {isLoading ? (
            <div className="text-center py-6">Caricamento...</div>
          ) : filteredPreventivi.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nessun preventivo trovato
            </div>
          ) : (
            <Table>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPreventivi.map((preventivo) => (
                  <TableRow key={preventivo.id}>
                    <TableCell className="font-medium">
                      {preventivo.numero_preventivo}
                    </TableCell>
                    <TableCell>{preventivo.titolo}</TableCell>
                    <TableCell>
                      {preventivo.prospects?.ragione_sociale || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{preventivo.profondita}×{preventivo.larghezza}×{preventivo.altezza}m</div>
                        <div className="text-muted-foreground">
                          {preventivo.superficie?.toFixed(2)}m² • {preventivo.volume?.toFixed(2)}m³
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Stampa: {preventivo.superficie_stampa?.toFixed(2)}m²</div>
                        <div className="text-muted-foreground">
                          {preventivo.sviluppo_lineare?.toFixed(2)}m • {preventivo.numero_pezzi?.toFixed(0)}pz
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        €{preventivo.totale?.toLocaleString('it-IT') || '0'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(preventivo.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(preventivo.created_at).toLocaleDateString('it-IT')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Preventivi;