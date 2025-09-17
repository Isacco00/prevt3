import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface DeskLayoutConfig {
  layout: string;
  quantity: number;
}

interface DeskData {
  desk_layouts: DeskLayoutConfig[];
  // Accessori desk individuali
  porta_scorrevole: number;
  ripiano_superiore: number;
  ripiano_inferiore: number;
  teca_plexiglass: number;
  fronte_luminoso: number;
  borsa: number;
  // Marginalità
  marginalita_struttura_desk?: number;
  marginalita_grafica_desk?: number;
  marginalita_premontaggio_desk?: number;
  marginalita_accessori_desk?: number;
}

interface DeskSectionProps {
  data: DeskData;
  onChange: (field: keyof DeskData, value: any) => void;
  parametri: any[];
  costiAccessori?: number;
  costiDesk?: {
    struttura_terra: number;
    grafica_cordino: number;
    premontaggio: number;
    totale: number;
  };
  prospect?: { tipo_prospect?: string };
}

export function DeskSection({ data, onChange, parametri, costiAccessori = 0, costiDesk, prospect }: DeskSectionProps) {
  const { user } = useAuth();

  // Fetch marginality data
  const { data: marginalitaData = [] } = useQuery({
    queryKey: ['marginalita-per-prospect'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marginalita_per_prospect')
        .select('*')
        .eq('attivo', true);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Note: Default margins are set in the parent component when creating new preventivo

  // Fetch desk accessories
  const { data: accessoriDesk = [], isLoading: isLoadingAccessori } = useQuery({
    queryKey: ["listino-accessori-desk"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listino_accessori_desk")
        .select("*")
        .eq("attivo", true)
        .order("nome");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch desk structure costs by layout
  const { data: costiStrutturaDesk } = useQuery({
    queryKey: ["costi-struttura-desk-layout"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("costi_struttura_desk_layout")
        .select("*")
        .eq("attivo", true);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleAccessorioChange = (accessorioNome: string, quantity: number) => {
    // Mappa i nomi degli accessori ai campi del formData
    const fieldMap: Record<string, keyof DeskData> = {
      'Porta scorrevole con chiave': 'porta_scorrevole',
      'Ripiano Superiore L 100': 'ripiano_superiore',
      'Ripiano Inferiore L 100': 'ripiano_inferiore',
      'Teca in plexiglass': 'teca_plexiglass',
      'Fronte luminoso dim. 100x100': 'fronte_luminoso',
      'Borsa': 'borsa'
    };
    
    const field = fieldMap[accessorioNome];
    if (field) {
      onChange(field, quantity);
    }
  };
  const handleLayoutChange = (layoutIndex: number, field: 'layout' | 'quantity', value: string | number) => {
    const updatedLayouts = [...(data.desk_layouts || [])];
    if (!updatedLayouts[layoutIndex]) {
      updatedLayouts[layoutIndex] = { layout: '', quantity: 0 };
    }
    updatedLayouts[layoutIndex] = {
      ...updatedLayouts[layoutIndex],
      [field]: value
    };
    onChange('desk_layouts' as any, updatedLayouts);
  };

  const getLayoutCost = (layout: string) => {
    if (!costiStrutturaDesk) return 0;
    const costo = costiStrutturaDesk.find(c => c.layout_desk === layout);
    return costo ? Number(costo.costo_unitario) : 0;
  };

  const calculateLayoutTotal = (layout: string, quantity: number) => {
    return getLayoutCost(layout) * quantity;
  };

  const calculateTotalStructureCost = () => {
    if (!data.desk_layouts || !Array.isArray(data.desk_layouts)) return 0;
    return data.desk_layouts.reduce((total, config) => {
      return total + calculateLayoutTotal(config.layout, config.quantity);
    }, 0);
  };

  const calculateSuperficieStampa = () => {
    if (!data.desk_layouts || !Array.isArray(data.desk_layouts)) return 0;
    
    return data.desk_layouts.reduce((total, config) => {
      const { layout, quantity } = config;
      if (!layout || !quantity) return total;
      
      switch (layout) {
        case "50":
          return total + (1.5 * quantity);
        case "100":
          return total + (2 * quantity);
        case "150":
          return total + (2.5 * quantity);
        case "200":
          return total + (3 * quantity);
        default:
          return total;
      }
    }, 0);
  };

  const calculateNumeroPezzi = () => {
    if (!data.desk_layouts || !Array.isArray(data.desk_layouts)) return 0;
    
    return data.desk_layouts.reduce((total, config) => {
      const { layout, quantity } = config;
      if (!layout || !quantity) return total;
      
      switch (layout) {
        case "50":
        case "100":
        case "150":
          return total + (12 * quantity);
        case "200":
          return total + (20 * quantity);
        default:
          return total;
      }
    }, 0);
  };

  // Initialize desk_layouts safely as an array if not already
  const safeLayouts = Array.isArray(data.desk_layouts) ? data.desk_layouts : [];

  return (
    <div className="space-y-6">
      {/* Dati di ingresso */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold mb-4 text-desk">Dati di ingresso per Desk</h4>
          
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Layout</TableHead>
                  <TableHead className="text-center">Quantità</TableHead>
                  <TableHead className="text-right">Prezzo unitario</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {['50', '100', '150', '200'].map((layout, index) => {
                  const layoutConfig = safeLayouts.find(l => l.layout === layout) || { layout, quantity: 0 };
                  const layoutIndex = safeLayouts.findIndex(l => l.layout === layout);
                  const unitCost = getLayoutCost(layout);
                  const totalCost = calculateLayoutTotal(layout, layoutConfig.quantity);
                  
                  return (
                    <TableRow key={layout}>
                      <TableCell className="font-medium">Layout {layout}</TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={layoutConfig.quantity || 0}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 0;
                            const newLayouts = [...safeLayouts];
                            
                            if (layoutIndex >= 0) {
                              // Update existing layout
                              newLayouts[layoutIndex] = { layout, quantity };
                            } else {
                              // Add new layout
                              newLayouts.push({ layout, quantity });
                            }
                            
                            onChange('desk_layouts' as any, newLayouts);
                          }}
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right">€ {unitCost.toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell className="text-right font-medium">€ {totalCost.toFixed(2).replace('.', ',')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Totale Struttura Desk:</span>
                <span className="text-xl font-bold text-desk">€ {calculateTotalStructureCost().toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elementi fisici calcolati */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold mb-4 text-desk">Elementi fisici Desk</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Superficie di stampa Desk (m²)</Label>
              <div className="p-3 bg-desk/10 rounded-md border border-desk/20">
                <span className="text-lg font-medium text-desk">
                  {calculateSuperficieStampa().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Numero di pezzi Desk</Label>
              <div className="p-3 bg-desk/10 rounded-md border border-desk/20">
                <span className="text-lg font-medium text-desk">
                  {calculateNumeroPezzi()}
                </span>
              </div>
            </div>
          </div>

          {/* Accessori Desk */}
          <div className="mt-6">
            <h5 className="text-lg font-semibold mb-4 text-desk">Accessori Desk</h5>
            {isLoadingAccessori ? (
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
                      {accessoriDesk.map((accessorio: any) => {
                        // Mappa i nomi degli accessori ai campi del formData
                        const fieldMap: Record<string, keyof DeskData> = {
                          'Porta scorrevole con chiave': 'porta_scorrevole',
                          'Ripiano Superiore L 100': 'ripiano_superiore',
                          'Ripiano Inferiore L 100': 'ripiano_inferiore',
                          'Teca in plexiglass': 'teca_plexiglass',
                          'Fronte luminoso dim. 100x100': 'fronte_luminoso',
                          'Borsa': 'borsa'
                        };
                        
                        const field = fieldMap[accessorio.nome];
                        const quantity = field ? (data[field] || 0) : 0;
                        const total = Number(quantity) * Number(accessorio.costo_unitario);
                        return (
                          <TableRow key={accessorio.id}>
                            <TableCell className="font-medium">{accessorio.nome}</TableCell>
                            <TableCell className="text-center">€ {Number(accessorio.costo_unitario).toFixed(2).replace('.', ',')}</TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="0"
                                max="99"
                                value={quantity.toString()}
                                onChange={(e) => handleAccessorioChange(accessorio.nome, parseInt(e.target.value) || 0)}
                                className="w-16 text-center"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">€ {total.toFixed(2).replace('.', ',')}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

     {/* Calcolo Costi Desk */}
<Card>
  <CardContent className="pt-6">
    <h4 className="text-lg font-semibold mb-4 text-desk">Calcolo Preventivo Desk</h4>

    {/* Cost cards in 3x2 layout (4 items in 2 rows) */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Struttura desk */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium">Struttura desk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-right text-lg font-bold">
            €{(costiDesk?.struttura_terra ?? 0).toFixed(2)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ricarico</span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="200"
                step="1"
                value={data.marginalita_struttura_desk ?? 50}
                onChange={(e) => setData({...formData,marginalita_struttura_desk: parseFloat(e.target.value) || 0})}
                className="w-16 h-6 text-xs text-center"
              />
              <span className="text-xs">%</span>
            </div>
          </div>
          <div className="text-right text-lg font-bold text-primary">
            €{((costiDesk?.struttura_terra ?? 0) * (1 + (data.marginalita_struttura_desk ?? 50) / 100)).toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Grafica desk */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium">Grafica desk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-right text-lg font-bold">
            €{(costiDesk?.grafica_cordino ?? 0).toFixed(2)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ricarico</span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="200"
                step="1"
                value={data.marginalita_grafica_desk || 50}
                onChange={(e) => onChange('marginalita_grafica_desk' as any, parseFloat(e.target.value) || 0)}
                className="w-16 h-6 text-xs text-center"
              />
              <span className="text-xs">%</span>
            </div>
          </div>
          <div className="text-right text-lg font-bold text-primary">
            €{((costiDesk?.grafica_cordino ?? 0) * (1 + (data.marginalita_grafica_desk || 50) / 100)).toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Premontaggio desk */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium">Premontaggio desk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-right text-lg font-bold">
            €{(costiDesk?.premontaggio ?? 0).toFixed(2)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ricarico</span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="200"
                step="1"
                value={data.marginalita_premontaggio_desk || 50}
                onChange={(e) => onChange('marginalita_premontaggio_desk' as any, parseFloat(e.target.value) || 0)}
                className="w-16 h-6 text-xs text-center"
              />
              <span className="text-xs">%</span>
            </div>
          </div>
          <div className="text-right text-lg font-bold text-primary">
            €{((costiDesk?.premontaggio ?? 0) * (1 + (data.marginalita_premontaggio_desk || 50) / 100)).toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Accessori desk */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium">Accessori desk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-right text-lg font-bold">
            €{(costiAccessori ?? 0).toFixed(2)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ricarico</span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="200"
                step="1"
                value={data.marginalita_accessori_desk || 50}
                onChange={(e) => onChange('marginalita_accessori_desk' as any, parseFloat(e.target.value) || 0)}
                className="w-16 h-6 text-xs text-center"
              />
              <span className="text-xs">%</span>
            </div>
          </div>
          <div className="text-right text-lg font-bold text-primary">
            €{((costiAccessori ?? 0) * (1 + (data.marginalita_accessori_desk || 50) / 100)).toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Summary */}
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Totale preventivo desk</div>
            <div className="text-2xl font-bold text-primary">
              €{(() => {
                const totalePreventivo = 
                  (costiDesk?.struttura_terra ?? 0) * (1 + (data.marginalita_struttura_desk || 50) / 100) +
                  (costiDesk?.grafica_cordino ?? 0) * (1 + (data.marginalita_grafica_desk || 50) / 100) +
                  (costiDesk?.premontaggio ?? 0) * (1 + (data.marginalita_premontaggio_desk || 50) / 100) +
                  (costiAccessori ?? 0) * (1 + (data.marginalita_accessori_desk || 50) / 100);
                return totalePreventivo.toFixed(2);
              })()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Totale costi desk</div>
            <div className="text-2xl font-bold">
              €{((costiDesk?.struttura_terra ?? 0) + (costiDesk?.grafica_cordino ?? 0) + (costiDesk?.premontaggio ?? 0) + (costiAccessori ?? 0)).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Marginalità Media (%)</div>
            <div className="text-2xl font-bold text-green-600">
              {(() => {
                const totaleCosti = (costiDesk?.struttura_terra ?? 0) + (costiDesk?.grafica_cordino ?? 0) + (costiDesk?.premontaggio ?? 0) + (costiAccessori ?? 0);
                if (totaleCosti === 0) return '0.0%';
                const totalePreventivo = 
                  (costiDesk?.struttura_terra ?? 0) * (1 + (data.marginalita_struttura_desk || 50) / 100) +
                  (costiDesk?.grafica_cordino ?? 0) * (1 + (data.marginalita_grafica_desk || 50) / 100) +
                  (costiDesk?.premontaggio ?? 0) * (1 + (data.marginalita_premontaggio_desk || 50) / 100) +
                  (costiAccessori ?? 0) * (1 + (data.marginalita_accessori_desk || 50) / 100);
                const marginalitaMedia = ((totalePreventivo - totaleCosti) / totaleCosti * 100);
                return marginalitaMedia.toFixed(1) + '%';
              })()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </CardContent>
</Card>
    </div>
  );
}