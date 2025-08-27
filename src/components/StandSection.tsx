import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

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
    borsa_stand: string;
    baule_trolley: string;
    staffa_monitor: string;
    mensola: string;
    spot_light: string;
    kit_faro_50w: string;
    kit_faro_100w: string;
    quadro_elettrico_16a: string;
    nicchia: string;
    pedana: string;
    extra_perc_complex: string;
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
    totale: number;
  };
}

export function StandSection({ formData, setFormData, physicalElements, costs }: StandSectionProps) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="borsa_stand">Borsa</Label>
            <Input
              id="borsa_stand"
              type="number"
              min="0"
              max="10"
              value={formData.borsa_stand}
              onChange={(e) => setFormData({ ...formData, borsa_stand: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="baule_trolley">Baule Trolley</Label>
            <Input
              id="baule_trolley"
              type="number"
              min="0"
              max="10"
              value={formData.baule_trolley}
              onChange={(e) => setFormData({ ...formData, baule_trolley: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="staffa_monitor">Staffa monitor</Label>
            <Input
              id="staffa_monitor"
              type="number"
              min="0"
              max="10"
              value={formData.staffa_monitor}
              onChange={(e) => setFormData({ ...formData, staffa_monitor: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mensola">Mensola</Label>
            <Input
              id="mensola"
              type="number"
              min="0"
              max="10"
              value={formData.mensola}
              onChange={(e) => setFormData({ ...formData, mensola: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="spot_light">Spot light</Label>
            <Input
              id="spot_light"
              type="number"
              min="0"
              max="10"
              value={formData.spot_light}
              onChange={(e) => setFormData({ ...formData, spot_light: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kit_faro_50w">Kit Faro 50W</Label>
            <Input
              id="kit_faro_50w"
              type="number"
              min="0"
              max="10"
              value={formData.kit_faro_50w}
              onChange={(e) => setFormData({ ...formData, kit_faro_50w: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kit_faro_100w">Kit Faro 100W</Label>
            <Input
              id="kit_faro_100w"
              type="number"
              min="0"
              max="10"
              value={formData.kit_faro_100w}
              onChange={(e) => setFormData({ ...formData, kit_faro_100w: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quadro_elettrico_16a">Quadro Elettrico 16A</Label>
            <Input
              id="quadro_elettrico_16a"
              type="number"
              min="0"
              max="10"
              value={formData.quadro_elettrico_16a}
              onChange={(e) => setFormData({ ...formData, quadro_elettrico_16a: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nicchia">Nicchia</Label>
            <Input
              id="nicchia"
              type="number"
              min="0"
              max="10"
              value={formData.nicchia}
              onChange={(e) => setFormData({ ...formData, nicchia: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pedana">Pedana (SI/NO)</Label>
            <Input
              id="pedana"
              type="number"
              min="0"
              max="10"
              value={formData.pedana}
              onChange={(e) => setFormData({ ...formData, pedana: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Calcolo Costi Stand */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h4 className="text-md font-semibold">Calcolo Costi Stand</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Struttura a terra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{costs.struttura_terra.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Grafica con cordino cucito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{costs.grafica_cordino.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Premontaggio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{costs.premontaggio.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Retroilluminazione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{costs.retroilluminazione.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Extra per Complessità */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="extra_perc_complex">Extra per struttura complessa (%)</Label>
            <Input
              id="extra_perc_complex"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.extra_perc_complex}
              onChange={(e) => setFormData({ ...formData, extra_perc_complex: e.target.value })}
              placeholder="0.0"
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Extra per Struttura Complessa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{costs.extra_stand_complesso.toFixed(2)}</div>
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