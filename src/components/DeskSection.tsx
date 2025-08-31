import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
}

export function DeskSection({ data, onChange, parametri, costiAccessori = 0, costiDesk }: DeskSectionProps) {
  const { user } = useAuth();

  // Fetch desk accessories
  const { data: accessoriDesk = [], isLoading: isLoadingAccessori } = useQuery({
    queryKey: ["listino-accessori-desk", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("listino_accessori_desk")
        .select("*")
        .eq("user_id", user.id)
        .eq("attivo", true)
        .order("nome");
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch desk structure costs by layout
  const { data: costiStrutturaDesk } = useQuery({
    queryKey: ["costi-struttura-desk-layout", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("costi_struttura_desk_layout")
        .select("*")
        .eq("user_id", user.id)
        .eq("attivo", true);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
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
            <h5 className="text-md font-medium mb-3 text-desk">Accessori Desk</h5>
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
    <h4 className="text-lg font-semibold mb-4 text-desk">Calcolo Costi Desk</h4>

    {/* 4 cards principali */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <Card className="h-24 flex flex-col overflow-hidden">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium leading-tight">
            Struttura a terra Desk
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto pb-3 px-3">
          <div className="text-xl font-bold leading-none tabular-nums truncate">
            €{(costiDesk?.struttura_terra ?? 0).toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="h-24 flex flex-col overflow-hidden">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium leading-tight">
            Grafica con cordino cucito Desk
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto pb-3 px-3">
          <div className="text-xl font-bold leading-none tabular-nums truncate">
            €{(costiDesk?.grafica_cordino ?? 0).toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="h-24 flex flex-col overflow-hidden">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium leading-tight">
            Premontaggio Desk
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto pb-3 px-3">
          <div className="text-xl font-bold leading-none tabular-nums truncate">
            €{(costiDesk?.premontaggio ?? 0).toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="h-24 flex flex-col overflow-hidden">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium leading-tight">
            Costi totali Accessori Desk
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto pb-3 px-3">
          <div className="text-xl font-bold leading-none tabular-nums truncate">
            €{(costiAccessori ?? 0).toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Costo totale Desk */}
    <Card className="w-full h-28 flex flex-col overflow-hidden border-2 rounded-xl">
      <CardContent className="px-4 py-3 flex flex-col">
          <div className="text-lg font-medium leading-tight">Costo totale Desk</div>
          <div className="mt-1 text-3xl md:text-4xl font-bold leading-none tabular-nums">
            €{(costiDesk?.totale ?? 0).toFixed(2)}
          </div>
      </CardContent>
    </Card>
  </CardContent>
</Card>
    </div>
  );
}