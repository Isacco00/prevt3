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
        .select('totale')
        .eq('user_id', user.id)
        .not('totale', 'is', null);
      
      return data?.reduce((sum, preventivo) => sum + (preventivo.totale || 0), 0) || 0;
    },
    enabled: !!user,
  });

  // Helper function to calculate preventivo total with all components
  const calculatePreventivoTotal = async (preventivoId: string) => {
    try {
      // Fetch all related data
      const [servizi, altriBeni] = await Promise.all([
        supabase
          .from('preventivi_servizi')
          .select('*')
          .eq('preventivo_id', preventivoId)
          .maybeSingle(),
        supabase
          .from('altri_beni_servizi')
          .select('*')
          .eq('preventivo_id', preventivoId)
      ]);

      let servicesTotal = 0;
      if (servizi.data) {
        servicesTotal = (servizi.data.preventivo_montaggio || 0) + (servizi.data.preventivo_smontaggio || 0);
      }

      let altriBeniTotal = 0;
      if (altriBeni.data && altriBeni.data.length > 0) {
        altriBeniTotal = altriBeni.data.reduce((sum: number, item: any) => {
          const costoUnitario = item.costo_unitario || 0;
          const quantita = item.quantita || 0;
          const marginalita = item.marginalita || 0;
          const costoTotale = costoUnitario * quantita;
          return sum + costoTotale * (1 + marginalita / 100);
        }, 0);
      }

      return servicesTotal + altriBeniTotal;
    } catch (error) {
      console.error('Error calculating totals:', error);
      return 0;
    }
  };

  // Query per gli ultimi preventivi
  const { data: ultimiPreventivi = [] } = useQuery({
    queryKey: ['ultimi-preventivi'],
    queryFn: async () => {
      if (!user) return [];
      
      // First get the preventivi
      const { data: preventivi } = await supabase
        .from('preventivi')
        .select(`
          *,
          prospects:prospect_id (ragione_sociale)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!preventivi) return [];

      // Calculate totals for each preventivo
      const preventiviWithTotals = await Promise.all(
        preventivi.map(async (preventivo) => {
          // Calculate the preventivo total using the same logic as TotalePreventivoSection
          const calculatePreventivoWithMargin = (cost: number, margin: number) => {
            return cost * (1 + margin / 100);
          };

          // Stand costs calculations
          const standStruttura = calculatePreventivoWithMargin(preventivo.costo_struttura || 0, preventivo.marginalita_struttura || 50);
          const standGrafica = calculatePreventivoWithMargin(preventivo.costo_grafica || 0, preventivo.marginalita_grafica || 50);
          const standRetroilluminazione = calculatePreventivoWithMargin(preventivo.costo_retroilluminazione || 0, preventivo.marginalita_retroilluminazione || 50);
          const standExtraComplessa = calculatePreventivoWithMargin(preventivo.extra_stand_complesso || 0, preventivo.marginalita_struttura || 50);
          const standPremontaggio = calculatePreventivoWithMargin(preventivo.costo_premontaggio || 0, preventivo.marginalita_premontaggio || 50);

          // Additional costs from external data
          const additionalTotal = await calculatePreventivoTotal(preventivo.id);

          const preventivoTotale = standStruttura + standGrafica + standRetroilluminazione + standExtraComplessa + standPremontaggio + additionalTotal;

          return {
            ...preventivo,
            calculated_total: preventivoTotale
          };
        })
      );

      return preventiviWithTotals;
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
                      <p className="text-sm font-medium">€{preventivo.calculated_total?.toLocaleString('it-IT', { maximumFractionDigits: 2 }) || '0'}</p>
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
