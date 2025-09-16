import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface StandSectionProps {
  formData: {
    profondita: string;
    larghezza: string;
    altezza: string;
    layout: string;
    distribuzione: string;
    complessita: string;
    bifaccialita: string;
    retroilluminazione: string;
    premontaggio: boolean;
    extra_perc_complex: string;
    // Accessori stand dinamici
    accessori_stand: Record<string, number>;
  };
  setFormData: (data: any) => void;
  physicalElements: {
    superficie_stampa: number;
    superficie_mq: number;
    sviluppo_lineare: number;
    numero_pezzi: number;
  };
  costs: {
    struttura_terra: number;
    grafica_cordino: number;
    premontaggio: number;
    retroilluminazione: number;
    extra_stand_complesso: number;
    costi_accessori: number;
    totale: number;
  };
}

export function StandSection({ formData, setFormData, physicalElements, costs }: StandSectionProps) {
  const { user } = useAuth();

  // Fetch accessori stand from database
  const { data: accessoriStand = [], isLoading } = useQuery({
    queryKey: ['listino-accessori-stand'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listino_accessori_stand')
        .select('*')
        .eq('attivo', true)
        .order('nome');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleAccessorioChange = (accessorioId: string, quantity: number) => {
    setFormData({
      ...formData,
      accessori_stand: {
        ...formData.accessori_stand,
        [accessorioId]: quantity
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Dati di Ingresso per Stand */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h4 className="text-md font-semibold">Dati di Ingresso per Stand</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profondita">Profondità (m) *</Label>
            <Input
              id="profondita"
              type="number"
              step="0.5"
              min="0"
              max="15"
              value={formData.profondita}
              onChange={(e) => setFormData({ ...formData, profondita: e.target.value })}
              placeholder="0.0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="larghezza">Larghezza (m) *</Label>
            <Input
              id="larghezza"
              type="number"
              step="0.5"
              min="0"
              max="15"
              value={formData.larghezza}
              onChange={(e) => setFormData({ ...formData, larghezza: e.target.value })}
              placeholder="0.0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="altezza">Altezza (m) *</Label>
            <Select value={formData.altezza} onValueChange={(value) => setFormData({ ...formData, altezza: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona altezza" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2.5">2.5 m</SelectItem>
                <SelectItem value="3">3 m</SelectItem>
                <SelectItem value="3.5">3.5 m</SelectItem>
                <SelectItem value="4">4 m</SelectItem>
              </SelectContent>
            </Select>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bifaccialita">Bifaccialità (m)</Label>
            <Input
              id="bifaccialita"
              type="number"
              step="0.5"
              min="0"
              max="15"
              value={formData.bifaccialita}
              onChange={(e) => setFormData({ ...formData, bifaccialita: e.target.value })}
              placeholder="0.0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="retroilluminazione">Retroilluminazione (m)</Label>
            <Input
              id="retroilluminazione"
              type="number"
              step="0.5"
              min="0"
              max="15"
              value={formData.retroilluminazione}
              onChange={(e) => setFormData({ ...formData, retroilluminazione: e.target.value })}
              placeholder="0.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="premontaggio">Premontaggio</Label>
            <Select 
              value={formData.premontaggio ? "SI" : "NO"} 
              onValueChange={(value) => setFormData({ ...formData, premontaggio: value === "SI" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SI">SI</SelectItem>
                <SelectItem value="NO">NO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Elementi Fisici Stand */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h4 className="text-md font-semibold">Elementi Fisici Stand</h4>
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

      {/* Accessori Stand */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h4 className="text-md font-semibold">Accessori Stand</h4>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">Caricamento accessori...</div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Accessorio</TableHead>
                    <TableHead className="text-center">Costo unitario</TableHead>
                    <TableHead className="text-center w-24">Quantità</TableHead>
                    <TableHead className="text-right">Costo totale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessoriStand.map((accessorio) => {
                    const quantity = formData.accessori_stand?.[accessorio.id] || 0;
                    const totalCost = quantity * accessorio.costo_unitario;
                    return (
                      <TableRow key={accessorio.id}>
                        <TableCell className="font-medium py-1">{accessorio.nome}</TableCell>
                        <TableCell className="text-center py-1">
                          € {accessorio.costo_unitario.toString().replace('.', ',')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max="99"
                            value={quantity}
                            onChange={(e) => handleAccessorioChange(accessorio.id, parseInt(e.target.value) || 0)}
                            className="w-14 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          € {totalCost.toFixed(2).replace('.', ',')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Calcolo Costi Stand */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h4 className="text-md font-semibold">Calcolo Costi Stand</h4>
        </div>
        
        {/* Prima riga - 4 cards principali */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="h-24 flex flex-col overflow-hidden">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium leading-tight">Struttura a terra</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto pb-3 px-3">
              <div className="text-xl font-bold leading-none tabular-nums truncate">€{costs.struttura_terra.toFixed(2)}</div>
            </CardContent>
          </Card>

         <Card className="h-24 flex flex-col overflow-hidden">
    <CardHeader className="pb-1 pt-3 px-3">
      <CardTitle className="text-xs font-medium leading-tight">
        Grafica con cordino cucito
      </CardTitle>
    </CardHeader>
    <CardContent className="mt-auto pb-3 px-3">
      <div className="text-xl font-bold leading-none tabular-nums truncate">
        €{costs.grafica_cordino.toFixed(2)}
      </div>
    </CardContent>
  </Card>

  <Card className="h-24 flex flex-col overflow-hidden">
    <CardHeader className="pb-1 pt-3 px-3">
      <CardTitle className="text-xs font-medium leading-tight">
        Retroilluminazione
      </CardTitle>
    </CardHeader>
    <CardContent className="mt-auto pb-3 px-3">
      <div className="text-xl font-bold leading-none tabular-nums truncate">
        €{costs.retroilluminazione.toFixed(2)}
      </div>
    </CardContent>
  </Card>

  <Card className="h-24 flex flex-col overflow-hidden">
    <CardHeader className="pb-1 pt-3 px-3">
      <CardTitle className="text-xs font-medium leading-tight">
        Costo Accessori
      </CardTitle>
    </CardHeader>
    <CardContent className="mt-auto pb-3 px-3">
      <div className="text-xl font-bold leading-none tabular-nums truncate">
        €{costs.costi_accessori.toFixed(2)}
      </div>
    </CardContent>
  </Card>
</div>


  {/* Seconda riga - Premontaggio, Extra (%), Extra per struttura complessa */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
       <Card className="h-24 flex flex-col overflow-hidden">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium leading-tight">Premontaggio</CardTitle>
          </CardHeader>
        <CardContent className="mt-auto pb-3 px-3">
            <div className="text-xl font-bold leading-none tabular-nums truncate">
            €{costs.premontaggio.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="h-24 flex flex-col overflow-hidden">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium leading-tight">
                Extra (%)
            </CardTitle>
          </CardHeader>
        <CardContent className="mt-auto pb-3 px-3">
          <Input
            id="extra_perc_complex"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.extra_perc_complex}
            onChange={(e) =>
            setFormData({ ...formData, extra_perc_complex: e.target.value })}
            placeholder="0.0"
            className="h-8 text-right font-bold"
          />
        </CardContent>
      </Card>

      <Card className="h-24 flex flex-col overflow-hidden">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium leading-tight">
            Extra per struttura complessa
            </CardTitle>
          </CardHeader>
        <CardContent className="mt-auto pb-3 px-3">
      <div className="text-xl font-bold leading-none tabular-nums truncate">
        €{costs.extra_stand_complesso.toFixed(2)}
      </div>
    </CardContent>
  </Card>
</div>

        <Card className="border-2 border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Totale Stand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">€{costs.totale.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}