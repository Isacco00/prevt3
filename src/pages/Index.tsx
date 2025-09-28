import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  // Query per contare le anagrafiche
  const { data: prospectsCount = 0 } = useQuery({
    queryKey: ['prospects-count'],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from('prospects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      return count || 0;
    },
    enabled: !!user,
  });

  // Query per contare i preventivi totali
  const { data: preventiviCount = 0 } = useQuery({
    queryKey: ['preventivi-count'],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from('preventivi')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      return count || 0;
    },
    enabled: !!user,
  });

  // Query per contare i preventivi in corso
  const { data: preventiviInCorso = 0 } = useQuery({
    queryKey: ['preventivi-in-corso'],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from('preventivi')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['bozza', 'inviato', 'in_revisione']);
      return count || 0;
    },
    enabled: !!user,
  });

  // Query per il valore totale dei preventivi
  const { data: valoreTotale = 0 } = useQuery({
    queryKey: ['preventivi-valore'],
    queryFn: async () => {
      if (!user) return 0;
      const { data } = await supabase
        .from('preventivi')
        .select('totale_preventivo')
        .eq('user_id', user.id)
        .not('totale_preventivo', 'is', null);
      
      return data?.reduce((sum, preventivo) => sum + (preventivo.totale_preventivo || 0), 0) || 0;
    },
    enabled: !!user,
  });

  // Query per gli ultimi preventivi
  const { data: ultimiPreventivi = [] } = useQuery({
    queryKey: ['ultimi-preventivi'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: preventivi } = await supabase
        .from('preventivi')
        .select(`
          id,
          titolo,
          status,
          totale_preventivo,
          prospects:prospect_id (ragione_sociale)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      return preventivi || [];
    },
    enabled: !!user,
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Panoramica generale del sistema PrevT3
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totale Anagrafiche
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prospectsCount}</div>
            <p className="text-xs text-muted-foreground">
              prospect e clienti registrati
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Preventivi Totali
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preventiviCount}</div>
            <p className="text-xs text-muted-foreground">
              preventivi creati
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Preventivi in Corso
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preventiviInCorso}</div>
            <p className="text-xs text-muted-foreground">
              preventivi in lavorazione
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valore Preventivi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{valoreTotale.toLocaleString('it-IT')}</div>
            <p className="text-xs text-muted-foreground">
              valore totale preventivi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ultimi Preventivi</CardTitle>
            <CardDescription>
              I preventivi più recenti del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ultimiPreventivi.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                Nessun preventivo ancora creato
              </div>
            ) : (
              <div className="space-y-4">
                {ultimiPreventivi.map((preventivo) => (
                  <div key={preventivo.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{preventivo.titolo}</p>
                      <p className="text-xs text-muted-foreground">
                        {preventivo.prospects?.ragione_sociale || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">€{(preventivo.totale_preventivo || 0).toLocaleString('it-IT', { maximumFractionDigits: 2 })}</p>
                      <p className="text-xs text-muted-foreground capitalize">{preventivo.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Attività Recente</CardTitle>
            <CardDescription>
              Le ultime attività del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              Nessuna attività registrata
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
