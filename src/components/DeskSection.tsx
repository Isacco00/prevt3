import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DeskData {
  desk_qta: number;
  layout_desk: string;
  accessori_desk: Record<string, number>;
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
  const { data: accessoriDesk } = useQuery({
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

  const handleAccessorioChange = (accessorioId: string, quantity: number) => {
    const currentAccessori = data.accessori_desk || {};
    onChange("accessori_desk", {
      ...currentAccessori,
      [accessorioId]: quantity
    });
  };
  const calculateSuperficieStampa = () => {
    const { desk_qta, layout_desk } = data;
    
    if (!layout_desk || !desk_qta) return 0;
    
    switch (layout_desk) {
      case "50":
        return 1.5 * desk_qta;
      case "100":
        return 2 * desk_qta;
      case "150":
        return 2.5 * desk_qta;
      case "200":
        return 3 * desk_qta;
      default:
        return 0;
    }
  };

  const calculateNumeroPezzi = () => {
    const { desk_qta, layout_desk } = data;
    
    if (!layout_desk || !desk_qta) return 0;
    
    switch (layout_desk) {
      case "50":
      case "100":
      case "150":
        return 12 * desk_qta;
      case "200":
        return 20 * desk_qta;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dati di ingresso */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold mb-4 text-desk">Dati di ingresso per Desk</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="desk_qta">Quantità Desk</Label>
              <Input
                id="desk_qta"
                type="number"
                min="1"
                max="10"
                step="1"
                value={data.desk_qta || ""}
                onChange={(e) => onChange("desk_qta", parseInt(e.target.value) || 0)}
                placeholder="1-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout_desk">Layout Desk</Label>
              <Select
                value={data.layout_desk || ""}
                onValueChange={(value) => onChange("layout_desk", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="150">150</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
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
            
            {accessoriDesk && accessoriDesk.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Accessorio</TableHead>
                      <TableHead className="w-24">Quantità</TableHead>
                      <TableHead className="w-32 text-right">Costo Unit.</TableHead>
                      <TableHead className="w-32 text-right">Totale</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessoriDesk.map((accessorio) => {
                      const quantity = data.accessori_desk?.[accessorio.id] || 0;
                      const total = quantity * Number(accessorio.costo_unitario);
                      return (
                        <TableRow key={accessorio.id}>
                          <TableCell className="font-medium">{accessorio.nome}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="1"
                              value={quantity || ""}
                              onChange={(e) => handleAccessorioChange(accessorio.id, parseInt(e.target.value) || 0)}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell className="text-right">€ {Number(accessorio.costo_unitario).toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">€ {total.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground">Nessun accessorio disponibile</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calcolo Costi Desk */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold mb-4 text-desk">Calcolo Costi Desk</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Costo struttura a terra Desk */}
            <div className="bg-card rounded-lg border p-4 flex flex-col justify-between h-24">
              <Label className="text-sm text-muted-foreground leading-tight">
                Struttura a terra Desk
              </Label>
              <div className="mt-auto">
                <span className="text-lg font-bold text-desk">
                  € {costiDesk?.struttura_terra?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            {/* Costo grafica Desk */}
            <div className="bg-card rounded-lg border p-4 flex flex-col justify-between h-24">
              <Label className="text-sm text-muted-foreground leading-tight">
                Grafica con cordino cucito Desk
              </Label>
              <div className="mt-auto">
                <span className="text-lg font-bold text-desk">
                  € {costiDesk?.grafica_cordino?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            {/* Costo premontaggio Desk */}
            <div className="bg-card rounded-lg border p-4 flex flex-col justify-between h-24">
              <Label className="text-sm text-muted-foreground leading-tight">
                Premontaggio Desk
              </Label>
              <div className="mt-auto">
                <span className="text-lg font-bold text-desk">
                  € {costiDesk?.premontaggio?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            {/* Costi totali Accessori Desk */}
            <div className="bg-card rounded-lg border p-4 flex flex-col justify-between h-24">
              <Label className="text-sm text-muted-foreground leading-tight">
                Costi totali Accessori Desk
              </Label>
              <div className="mt-auto">
                <span className="text-lg font-bold text-desk">
                  € {costiAccessori?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Costo totale Desk */}
          <div className="flex justify-center">
            <div className="bg-primary/5 rounded-lg border-2 border-primary/20 p-6 min-w-64">
              <div className="text-center">
                <Label className="text-lg text-muted-foreground leading-tight block mb-2">
                  Costo totale Desk
                </Label>
                <span className="text-3xl font-bold text-primary">
                  € {costiDesk?.totale?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}