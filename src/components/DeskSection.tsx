import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeskData {
  desk_qta: number;
  layout_desk: string;
}

interface DeskSectionProps {
  data: DeskData;
  onChange: (field: keyof DeskData, value: any) => void;
}

export function DeskSection({ data, onChange }: DeskSectionProps) {
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
        </CardContent>
      </Card>
    </div>
  );
}