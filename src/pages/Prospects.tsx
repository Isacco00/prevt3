import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Search } from 'lucide-react';

interface Prospect {
  id: string;
  user_id: string;
  ragione_sociale: string;
  partita_iva: string;
  codice_fiscale?: string;
  indirizzo: string;
  citta: string;
  cap: string;
  provincia: string;
  telefono?: string;
  email?: string;
  tipo: 'prospect' | 'cliente';
  created_at: string;
  updated_at: string;
}

const Prospects = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'prospect' | 'cliente'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    ragione_sociale: '',
    partita_iva: '',
    codice_fiscale: '',
    indirizzo: '',
    citta: '',
    cap: '',
    provincia: '',
    telefono: '',
    email: '',
    tipo: 'prospect' as 'prospect' | 'cliente'
  });

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProspects((data || []) as Prospect[]);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Errore nel caricamento delle anagrafiche: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePartitaIva = (partitaIva: string): boolean => {
    // Rimuovi spazi e caratteri non numerici
    const cleaned = partitaIva.replace(/\s/g, '');
    
    // Controlla se è una P.IVA italiana (11 cifre)
    if (!/^\d{11}$/.test(cleaned)) {
      return false;
    }

    // Algoritmo di controllo P.IVA italiana
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      let digit = parseInt(cleaned[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) {
          digit = Math.floor(digit / 10) + (digit % 10);
        }
      }
      sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(cleaned[10]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePartitaIva(formData.partita_iva)) {
      toast({
        title: "Errore",
        description: "Partita IVA non valida",
        variant: "destructive",
      });
      return;
    }

    try {
      // Controlla duplicati
      const { data: existing } = await supabase
        .from('prospects')
        .select('id')
        .eq('partita_iva', formData.partita_iva)
        .neq('id', editingProspect?.id || '');

      if (existing && existing.length > 0) {
        toast({
          title: "Errore",
          description: "Partita IVA già esistente",
          variant: "destructive",
        });
        return;
      }

      if (editingProspect) {
        const { error } = await supabase
          .from('prospects')
          .update(formData)
          .eq('id', editingProspect.id);
        
        if (error) throw error;
        
        toast({
          title: "Successo",
          description: "Anagrafica aggiornata con successo",
        });
      } else {
        const { error } = await supabase
          .from('prospects')
          .insert([{ ...formData, user_id: (await supabase.auth.getUser()).data.user?.id }]);
        
        if (error) throw error;
        
        toast({
          title: "Successo",
          description: "Anagrafica creata con successo",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchProspects();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      ragione_sociale: '',
      partita_iva: '',
      codice_fiscale: '',
      indirizzo: '',
      citta: '',
      cap: '',
      provincia: '',
      telefono: '',
      email: '',
      tipo: 'prospect'
    });
    setEditingProspect(null);
  };

  const handleEdit = (prospect: Prospect) => {
    setFormData({
      ragione_sociale: prospect.ragione_sociale,
      partita_iva: prospect.partita_iva,
      codice_fiscale: prospect.codice_fiscale || '',
      indirizzo: prospect.indirizzo,
      citta: prospect.citta,
      cap: prospect.cap,
      provincia: prospect.provincia,
      telefono: prospect.telefono || '',
      email: prospect.email || '',
      tipo: prospect.tipo
    });
    setEditingProspect(prospect);
    setIsDialogOpen(true);
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.ragione_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.partita_iva.includes(searchTerm) ||
                         prospect.citta.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || prospect.tipo === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="p-6">Caricamento...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestione Anagrafiche</h1>
          <p className="text-muted-foreground">Gestisci prospect e clienti</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuova Anagrafica
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProspect ? 'Modifica Anagrafica' : 'Nuova Anagrafica'}
              </DialogTitle>
              <DialogDescription>
                Inserisci i dati dell'anagrafica
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="ragione_sociale">Ragione Sociale *</Label>
                  <Input
                    id="ragione_sociale"
                    value={formData.ragione_sociale}
                    onChange={(e) => setFormData({...formData, ragione_sociale: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="partita_iva">Partita IVA *</Label>
                  <Input
                    id="partita_iva"
                    value={formData.partita_iva}
                    onChange={(e) => setFormData({...formData, partita_iva: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="codice_fiscale">Codice Fiscale</Label>
                  <Input
                    id="codice_fiscale"
                    value={formData.codice_fiscale}
                    onChange={(e) => setFormData({...formData, codice_fiscale: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="indirizzo">Indirizzo *</Label>
                  <Input
                    id="indirizzo"
                    value={formData.indirizzo}
                    onChange={(e) => setFormData({...formData, indirizzo: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="citta">Città *</Label>
                  <Input
                    id="citta"
                    value={formData.citta}
                    onChange={(e) => setFormData({...formData, citta: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cap">CAP *</Label>
                  <Input
                    id="cap"
                    value={formData.cap}
                    onChange={(e) => setFormData({...formData, cap: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Input
                    id="provincia"
                    value={formData.provincia}
                    onChange={(e) => setFormData({...formData, provincia: e.target.value})}
                    required
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value: 'prospect' | 'cliente') => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit">
                  {editingProspect ? 'Aggiorna' : 'Crea'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anagrafiche</CardTitle>
          <CardDescription>
            Lista di tutti i prospect e clienti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per ragione sociale, P.IVA o città..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: 'all' | 'prospect' | 'cliente') => setFilterType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="cliente">Clienti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ragione Sociale</TableHead>
                <TableHead>P.IVA</TableHead>
                <TableHead>Città</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProspects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="font-medium">{prospect.ragione_sociale}</TableCell>
                  <TableCell>{prospect.partita_iva}</TableCell>
                  <TableCell>{prospect.citta} ({prospect.provincia})</TableCell>
                  <TableCell>{prospect.telefono || '-'}</TableCell>
                  <TableCell>{prospect.email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={prospect.tipo === 'cliente' ? 'default' : 'secondary'}>
                      {prospect.tipo === 'cliente' ? 'Cliente' : 'Prospect'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(prospect)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredProspects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Nessuna anagrafica trovata
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prospects;