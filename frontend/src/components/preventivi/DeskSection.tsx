import {Card, CardContent} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Calculator, ChevronDown, ChevronRight} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import React, {useState} from "react";
import {ParametriAPI} from "@/api/parametri.ts";
import {LayoutDeskBean, PreventivoBean} from "@/types/preventivo.ts";
import {ListinoStrutturaDeskBean, ListinoAccessoriDeskBean, ListinoServiziPrezzoUnitarioBean} from "@/types/parametri.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

interface DeskSectionProps {
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}

export function DeskSection({formData, setFormData}: DeskSectionProps) {
  const [accessoriOpen, setAccessoriOpen] = useState(true);

  type AccessorioDeskItem = { qty: number; noleggio: boolean };
  type AccessoriDeskMap = Record<string, AccessorioDeskItem>;

  const parseAccessoriDeskConfig = (json?: string): AccessoriDeskMap => {
    if (!json) return {};
    try {
      const parsed = JSON.parse(json);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  };

  const stringifyAccessoriDeskConfig = (map: AccessoriDeskMap): string =>
    JSON.stringify(map);

  const deskLayoutsArray = Array.isArray(formData.layoutDesk) ? formData.layoutDesk as LayoutDeskBean[] : (() => {
    try {
      return typeof (formData.layoutDesk as LayoutDeskBean) === 'string' ? JSON.parse(formData.layoutDesk as string) : [];
    } catch {
      return [];
    }
  })();

  // Fetch listino servizi
  const {
    data: listinoServizi = []
  } = useQuery({
    queryKey: ['listino-servizi-prezzo-unitario'],
    queryFn: () => ParametriAPI.getListinoServiziPrezzoUnitario({
      attivo: true, sortFields: [{
        field: "LISTINO_SERVIZI_PREZZO_UNITARIO_PARAMETRO",
        desc: false
      }]
    })
  });

  // Fetch listino accessori desk
  const {
    data: accessoriDesk = []
  } = useQuery({
    queryKey: ["listino-accessori-desk"],
    queryFn: () => ParametriAPI.getListinoAccessoriDesk({
      attivo: true, sortFields: [{
        field: "LISTINO_ACCESSORI_DESK_NAME",
        desc: false
      }]
    })
  });

  // Fetch costi struttura desk
  const {
    data: listinoStrutturaDesk
  } = useQuery({
    queryKey: ["costi-struttura-desk-layout"],
    queryFn: () => ParametriAPI.getListinoStrutturaDesk({attivo: true})
  });

  const accessoriDeskMap = parseAccessoriDeskConfig(formData.accessoriDeskConfig);

  const handleAccessorioChange = (id: string, quantity: number) => {
    setFormData(prev => {
      const current = parseAccessoriDeskConfig(prev.accessoriDeskConfig);
      const updated: AccessoriDeskMap = {
        ...current,
        [id]: { qty: quantity, noleggio: current[id]?.noleggio ?? false },
      };
      if (quantity <= 0) delete updated[id];
      return { ...prev, accessoriDeskConfig: stringifyAccessoriDeskConfig(updated) };
    });
  };

  const handleNoleggioDesk = (id: string, value: boolean) => {
    setFormData(prev => {
      const current = parseAccessoriDeskConfig(prev.accessoriDeskConfig);
      if (!current[id] && !value) return prev;
      const updated: AccessoriDeskMap = {
        ...current,
        [id]: { qty: current[id]?.qty ?? 0, noleggio: value },
      };
      return { ...prev, accessoriDeskConfig: stringifyAccessoriDeskConfig(updated) };
    });
  };
  const getLayoutCost = (layout: string) => {
    if (!listinoStrutturaDesk) return 0;
    const costo = listinoStrutturaDesk.find(c => String(c.layoutDesk) === layout);
    return costo ? Number(costo.costoUnitario) : 0;
  };

  const getLayoutPrezzoUnitario = (layout: string) => {
    if (!listinoStrutturaDesk) return 0;
    const entry = listinoStrutturaDesk.find(c => String(c.layoutDesk) === layout);
    if (!entry) return 0;
    return Number(entry.costoUnitario) * (1 + (entry.ricaricoPercentuale ?? 0) / 100);
  };

  const calculateLayoutTotal = (layout: string, quantity: number) => {
    return getLayoutPrezzoUnitario(layout) * quantity;
  };

  const calculateTotalStructureCost = () => {
    if (!formData.layoutDesk || !Array.isArray(formData.layoutDesk)) return 0;
    return formData.layoutDesk.reduce((total, config) => {
      return total + calculateLayoutTotal(config.layout, config.quantity);
    }, 0);
  };

  const calculateSuperficieStampa = () => {
    if (!formData.layoutDesk || !Array.isArray(formData.layoutDesk)) return 0;

    return formData.layoutDesk.reduce((total, config) => {
      const {layout, quantity} = config;
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
    if (!formData.layoutDesk || !Array.isArray(formData.layoutDesk)) return 0;

    return formData.layoutDesk.reduce((total, config) => {
      const {layout, quantity} = config;
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

  // Funzioni helper per calcolo desk
  const calculateSuperficieStampaDesk = () => {
    const arr = Array.isArray(formData.layoutDesk) ? formData.layoutDesk as LayoutDeskBean[] : (() => {
      try {
        return typeof (formData.layoutDesk as LayoutDeskBean) === 'string' ? JSON.parse(formData.layoutDesk as string) : [];
      } catch {
        return [];
      }
    })();
    if (!arr.length) return 0;
    return arr.reduce((total, config: LayoutDeskBean) => {
      const {
        layout,
        quantity
      } = config;
      if (!layout || !quantity) return total;
      switch (layout) {
        case "50":
          return total + 1.5 * quantity;
        case "100":
          return total + 2 * quantity;
        case "150":
          return total + 2.5 * quantity;
        case "200":
          return total + 3 * quantity;
        default:
          return total;
      }
    }, 0);
  };
  const calculateNumeroPezziDesk = () => {
    const arr = Array.isArray(formData.layoutDesk) ? formData.layoutDesk as LayoutDeskBean[] : (() => {
      try {
        return typeof (formData.layoutDesk as LayoutDeskBean) === 'string' ? JSON.parse(formData.layoutDesk as string) : [];
      } catch {
        return [];
      }
    })();
    if (!arr.length) return 0;
    return arr.reduce((total, config: LayoutDeskBean) => {
      const {
        layout,
        quantity
      } = config;
      if (!layout || !quantity) return total;
      switch (layout) {
        case "50":
        case "100":
        case "150":
          return total + 12 * quantity;
        case "200":
          return total + 20 * quantity;
        default:
          return total;
      }
    }, 0);
  };

  // Calcolo dei costi automatici
  const calculateCosts = () => {
    if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione) {
      return {
        costiAccessoriDesk: 0,
      };
    }
    // Calcolo costi accessori desk
    const coeff = formData.coefficienteNoleggio?.valore ?? 0;
    let costiAccessoriDesk = 0;
    for (const accessorio of accessoriDesk) {
      const item = accessoriDeskMap[accessorio.id];
      if (!item) continue;
      costiAccessoriDesk += item.qty * Number(accessorio.costoUnitario);
    }

    // Calcolo costi desk
    const costoStampaDeskParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Stampa Grafica');
    const costoPremontaggerDesk = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Premontaggio');

    const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: LayoutDeskBean) => {
      const costoLayout = listinoStrutturaDesk?.find((c: ListinoStrutturaDeskBean) => String(c.layoutDesk) === String(config.layout));
      return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
    }, 0);
    // Grafica desk con cordino cucito
    const superficieStampaDesk = calculateSuperficieStampaDesk();
    const graficaCordinoDesk = costoStampaDeskParam ? superficieStampaDesk * (costoStampaDeskParam.costo || 0) : 0;
    // Premontaggio desk
    const numeroPezziDesk = calculateNumeroPezziDesk();
    const premontaggioDesk = formData.premontaggioDesk && costoPremontaggerDesk ? numeroPezziDesk * (costoPremontaggerDesk.costo || 0) : 0;
    const totaleDesk = strutturaTerraDesk + graficaCordinoDesk + premontaggioDesk + costiAccessoriDesk;
    return {
      costiAccessoriDesk,
      costiDesk: {
        strutturaTerra: strutturaTerraDesk,
        graficaCordino: graficaCordinoDesk,
        premontaggio: premontaggioDesk,
        accessori: costiAccessoriDesk,
        totale: totaleDesk
      },
    };
  };
  const costs = calculateCosts();

  // Initialize deskLayouts safely as an array if not already
  const safeLayouts = Array.isArray(formData.layoutDesk) ? formData.layoutDesk : [];

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
                    <TableHead className="text-center">Costo Unitario</TableHead>
                    <TableHead className="text-center">Prezzo Unitario</TableHead>
                    <TableHead className="text-center">Quantità</TableHead>
                    <TableHead className="text-right">Prezzo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {['50', '100', '150', '200'].map((layout) => {
                    const layoutConfig = safeLayouts.find(l => l.layout === layout) || {layout, quantity: 0};
                    const layoutIndex = safeLayouts.findIndex(l => l.layout === layout);
                    const costoUnitario = getLayoutCost(layout);
                    const prezzoUnitario = getLayoutPrezzoUnitario(layout);
                    const prezzo = calculateLayoutTotal(layout, layoutConfig.quantity);

                    return (
                        <TableRow key={layout}>
                          <TableCell className="font-medium py-1">Layout {layout}</TableCell>
                          <TableCell className="text-center py-1">
                            € {costoUnitario.toFixed(2).replace('.', ',')}
                          </TableCell>
                          <TableCell className="text-center py-1">
                            € {prezzoUnitario.toFixed(2).replace('.', ',')}
                          </TableCell>
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
                                    newLayouts[layoutIndex] = {layout, quantity};
                                  } else {
                                    newLayouts.push({layout, quantity});
                                  }
                                  setFormData({...formData, layoutDesk: newLayouts});
                                }}
                                className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium py-1">
                            € {prezzo.toFixed(2).replace('.', ',')}
                          </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Totale Struttura Desk:</span>
                  <span
                      className="text-xl font-bold text-desk">€ {calculateTotalStructureCost().toFixed(2).replace('.', ',')}</span>
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
            <Collapsible open={accessoriOpen} onOpenChange={setAccessoriOpen} className="mt-6">
              <CollapsibleTrigger className="flex items-center gap-2 w-full mb-4">
                <h5 className="text-lg font-semibold text-desk">Accessori Desk</h5>
                {accessoriOpen ? (
                    <ChevronDown className="h-4 w-4"/>
                ) : (
                    <ChevronRight className="h-4 w-4"/>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Accessorio</TableHead>
                          <TableHead className="text-center">Costo unitario</TableHead>
                          <TableHead className="text-center">Prezzo Unitario</TableHead>
                          <TableHead className="text-center w-24">Quantità</TableHead>
                          <TableHead className="text-center w-24">Noleggio</TableHead>
                          <TableHead className="text-right">Prezzo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accessoriDesk.map((accessorio: ListinoAccessoriDeskBean) => {
                          const item = accessoriDeskMap[accessorio.id];
                          const quantity = item?.qty ?? 0;
                          const noleggio = item?.noleggio ?? false;
                          const prezzoUnitario = Number(accessorio.costoUnitario) * (1 + (accessorio.ricaricoPercentuale ?? 0) / 100);
                          const coeff = formData.coefficienteNoleggio?.valore ?? 0;
                          const prezzo = noleggio
                            ? prezzoUnitario * quantity * coeff
                            : prezzoUnitario * quantity;
                          return (
                              <TableRow key={accessorio.id}>
                                <TableCell className="font-medium py-1">{accessorio.nome}</TableCell>
                                <TableCell className="text-center py-1">
                                  € {Number(accessorio.costoUnitario).toFixed(2).replace('.', ',')}
                                </TableCell>
                                <TableCell className="text-center py-1">
                                  € {prezzoUnitario.toFixed(2).replace('.', ',')}
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
                                <TableCell className="text-center">
                                  <Checkbox
                                      checked={noleggio}
                                      onCheckedChange={(checked) => handleNoleggioDesk(accessorio.id, !!checked)}
                                  />
                                </TableCell>
                                <TableCell className="text-right font-medium py-1">
                                  € {prezzo.toFixed(2).replace('.', ',')}
                                </TableCell>
                              </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Calcolo Preventivo Desk */}
        <div className="space-y-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5"/>
              <h4 className="text-md font-semibold">Calcolo Preventivo Desk</h4>
            </div>
            {formData.coefficienteNoleggio && (
              <span className="text-sm text-muted-foreground">
                Coeff. Noleggio: <span className="font-semibold text-foreground">{formData.coefficienteNoleggio.nome}</span>
              </span>
            )}
          </div>

          {/* Tabella Calcolo Costi */}
          <Card>
            <CardContent className="pt-4 px-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voce</TableHead>
                    <TableHead className="text-right">Costo</TableHead>
                    <TableHead className="text-right">Prezzo</TableHead>
                    <TableHead className="text-center w-32">Sconto %</TableHead>
                    <TableHead className="text-right">Sconto €</TableHead>
                    <TableHead className="text-right">Prezzo Netto</TableHead>
                    <TableHead className="text-right">Prezzo Noleggio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Struttura desk */}
                  {(() => {
                    const costoStruttura = costs.costiDesk?.strutturaTerra ?? 0;
                    const prezzo = calculateTotalStructureCost();
                    const scontoPerc = formData.scontoStrutturaDesk || 0;
                    const scontoEuro = prezzo * scontoPerc / 100;
                    const prezzoNetto = prezzo - scontoEuro;
                    const prezzoNoleggio = prezzoNetto * (formData.coefficienteNoleggio?.valore ?? 0);
                    return (
                      <TableRow>
                        <TableCell className="font-medium">Struttura desk</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          €{costoStruttura.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          €{prezzo.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Input
                                type="number" min="0" max="100" step="1"
                                value={scontoPerc}
                                onChange={(e) => setFormData({...formData, scontoStrutturaDesk: parseFloat(e.target.value) || 0})}
                                className="w-16 h-6 text-xs text-center"
                            />
                            <span className="text-xs">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          -€{scontoEuro.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          €{prezzoNetto.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          €{prezzoNoleggio.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })()}

                  {/* Grafica desk */}
                  {(() => {
                    const attiva = formData.graficaDeskAttiva ?? true;
                    const costoGraficaRaw = costs.costiDesk?.graficaCordino ?? 0;
                    const costoGrafica = attiva ? costoGraficaRaw : 0;
                    const costoStampaParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Stampa Grafica');
                    const superficieStampaDesk = calculateSuperficieStampaDesk();
                    const prezzo = attiva && costoStampaParam
                        ? superficieStampaDesk * (costoStampaParam.costo || 0) * (1 + (costoStampaParam.ricaricoPercentuale || 0) / 100)
                        : 0;
                    const scontoPerc = formData.scontoGraficaDesk || 0;
                    const scontoEuro = prezzo * scontoPerc / 100;
                    const prezzoNetto = prezzo - scontoEuro;
                    return (
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            Grafica desk
                            <Checkbox
                                checked={attiva}
                                onCheckedChange={checked => setFormData({...formData, graficaDeskAttiva: Boolean(checked)})}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          €{costoGrafica.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          €{prezzo.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Input
                                type="number" min="0" max="100" step="1"
                                value={scontoPerc}
                                onChange={(e) => setFormData({...formData, scontoGraficaDesk: parseFloat(e.target.value) || 0})}
                                className="w-16 h-6 text-xs text-center"
                            />
                            <span className="text-xs">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          -€{scontoEuro.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          €{prezzoNetto.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">-</TableCell>
                      </TableRow>
                    );
                  })()}

                  {/* Premontaggio desk */}
                  {(() => {
                    const costoPrem = costs.costiDesk?.premontaggio ?? 0;
                    const costoPremParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Premontaggio');
                    const numeroPezziDesk = calculateNumeroPezziDesk();
                    const prezzo = costoPremParam && formData.premontaggioDesk
                        ? numeroPezziDesk * (costoPremParam.costo || 0) * (1 + (costoPremParam.ricaricoPercentuale || 0) / 100)
                        : 0;
                    const scontoPerc = formData.scontoPremontaggioDesk || 0;
                    const scontoEuro = prezzo * scontoPerc / 100;
                    const prezzoNetto = prezzo - scontoEuro;
                    return (
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            Premontaggio desk
                            <Checkbox
                                checked={formData.premontaggioDesk ?? false}
                                onCheckedChange={checked => setFormData({...formData, premontaggioDesk: Boolean(checked)})}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          €{costoPrem.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          €{prezzo.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Input
                                type="number" min="0" max="100" step="1"
                                value={scontoPerc}
                                onChange={(e) => setFormData({...formData, scontoPremontaggioDesk: parseFloat(e.target.value) || 0})}
                                className="w-16 h-6 text-xs text-center"
                            />
                            <span className="text-xs">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          -€{scontoEuro.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          €{prezzoNetto.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">-</TableCell>
                      </TableRow>
                    );
                  })()}

                  {/* Accessori desk vendita */}
                  {(() => {
                    let costoV = 0;
                    let prezzoV = 0;
                    for (const accessorio of accessoriDesk as ListinoAccessoriDeskBean[]) {
                      const item = accessoriDeskMap[accessorio.id];
                      if (!item || item.noleggio) continue;
                      costoV += item.qty * Number(accessorio.costoUnitario);
                      prezzoV += item.qty * Number(accessorio.costoUnitario) * (1 + (accessorio.ricaricoPercentuale ?? 0) / 100);
                    }
                    const scontoPerc = formData.scontoAccessoriDesk || 0;
                    const scontoEuro = prezzoV * scontoPerc / 100;
                    const prezzoNetto = prezzoV - scontoEuro;
                    return (
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Accessori desk</span>
                            <span>Vendita</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          €{costoV.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          €{prezzoV.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Input
                                type="number" min="0" max="100" step="1"
                                value={scontoPerc}
                                onChange={(e) => setFormData({...formData, scontoAccessoriDesk: parseFloat(e.target.value) || 0})}
                                className="w-16 h-6 text-xs text-center"
                            />
                            <span className="text-xs">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          -€{scontoEuro.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          €{prezzoNetto.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">-</TableCell>
                      </TableRow>
                    );
                  })()}

                  {/* Accessori desk noleggio */}
                  {(() => {
                    let costoN = 0;
                    let prezzoN = 0;
                    for (const accessorio of accessoriDesk as ListinoAccessoriDeskBean[]) {
                      const item = accessoriDeskMap[accessorio.id];
                      if (!item || !item.noleggio) continue;
                      costoN += item.qty * Number(accessorio.costoUnitario);
                      prezzoN += item.qty * Number(accessorio.costoUnitario) * (1 + (accessorio.ricaricoPercentuale ?? 0) / 100);
                    }
                    const scontoPerc = formData.scontoAccessoriDesk || 0;
                    const scontoEuro = prezzoN * scontoPerc / 100;
                    const prezzoNetto = prezzoN - scontoEuro;
                    const prezzoNoleggioAcc = prezzoNetto * (formData.coefficienteNoleggio?.valore ?? 0);
                    return (
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Accessori desk</span>
                            <span>Noleggio</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          €{costoN.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          €{prezzoN.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Input
                                type="number" min="0" max="100" step="1"
                                value={scontoPerc}
                                onChange={(e) => setFormData({...formData, scontoAccessoriDesk: parseFloat(e.target.value) || 0})}
                                className="w-16 h-6 text-xs text-center"
                            />
                            <span className="text-xs">%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          -€{scontoEuro.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          €{prezzoNetto.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {prezzoNoleggioAcc > 0 ? `€${prezzoNoleggioAcc.toFixed(2)}` : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-4 space-y-6">
              {(() => {
                const graficaAttiva = formData.graficaDeskAttiva ?? true;
                const costoStruttura = costs.costiDesk?.strutturaTerra ?? 0;
                const costoGrafica = graficaAttiva ? (costs.costiDesk?.graficaCordino ?? 0) : 0;
                const costoPremontaggio = costs.costiDesk?.premontaggio ?? 0;
                const costoAccessori = costs.costiAccessoriDesk ?? 0;
                const costoTotale = costoStruttura + costoGrafica + costoPremontaggio + costoAccessori;

                const costoStampaParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Stampa Grafica');
                const costoPremParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Premontaggio');
                const superficieStampaDesk = calculateSuperficieStampaDesk();
                const numeroPezziDesk = calculateNumeroPezziDesk();

                const listStruttura = calculateTotalStructureCost();
                const listGrafica = graficaAttiva && costoStampaParam
                    ? superficieStampaDesk * (costoStampaParam.costo || 0) * (1 + (costoStampaParam.ricaricoPercentuale || 0) / 100)
                    : 0;
                const listPremontaggio = costoPremParam && formData.premontaggioDesk
                    ? numeroPezziDesk * (costoPremParam.costo || 0) * (1 + (costoPremParam.ricaricoPercentuale || 0) / 100)
                    : 0;
                let listAccessoriVendita = 0;
                let listAccessoriNoleggio = 0;
                for (const accessorio of accessoriDesk as ListinoAccessoriDeskBean[]) {
                  const item = accessoriDeskMap[accessorio.id];
                  if (!item) continue;
                  const p = item.qty * Number(accessorio.costoUnitario) * (1 + (accessorio.ricaricoPercentuale ?? 0) / 100);
                  if (item.noleggio) listAccessoriNoleggio += p;
                  else listAccessoriVendita += p;
                }
                const listAccessori = listAccessoriVendita + listAccessoriNoleggio;

                const totalListinoVendita = listStruttura + listGrafica + listPremontaggio + listAccessori;

                const nettoStruttura = listStruttura * (1 - (formData.scontoStrutturaDesk || 0) / 100);
                const nettoGrafica = listGrafica * (1 - (formData.scontoGraficaDesk || 0) / 100);
                const nettoPremontaggio = listPremontaggio * (1 - (formData.scontoPremontaggioDesk || 0) / 100);
                const scontoPercAcc = formData.scontoAccessoriDesk || 0;
                const nettoAccessoriVendita = listAccessoriVendita * (1 - scontoPercAcc / 100);
                const nettoAccessoriNoleggio = listAccessoriNoleggio * (1 - scontoPercAcc / 100);
                const nettoAccessori = nettoAccessoriVendita + nettoAccessoriNoleggio;
                const totalNettoVendita = nettoStruttura + nettoGrafica + nettoPremontaggio + nettoAccessori;

                const scontoMedioVendita = totalListinoVendita > 0 ? (totalListinoVendita - totalNettoVendita) / totalListinoVendita * 100 : 0;
                const marginalitaVendita = costoTotale > 0 ? (totalNettoVendita - costoTotale) / costoTotale * 100 : 0;

                const coeffNoleggio = formData.coefficienteNoleggio?.valore ?? 0;
                const prezzoNoleggioStruttura = nettoStruttura * coeffNoleggio;
                const prezzoNoleggioAccessori = nettoAccessoriNoleggio * coeffNoleggio;
                const totalNettoNoleggio = nettoGrafica + nettoPremontaggio + nettoAccessoriVendita;
                const totalePreventivoFinale = prezzoNoleggioStruttura + totalNettoNoleggio + prezzoNoleggioAccessori;
                const scontoMedioNoleggio = listStruttura > 0 ? (listStruttura - nettoStruttura) / listStruttura * 100 : 0;
                const marginalitaNoleggio = costoTotale > 0 ? (totalePreventivoFinale - costoTotale) / costoTotale * 100 : 0;

                return (
                  <>
                    {/* VENDITA */}
                    <div>
                      <div className="text-lg font-semibold text-primary mb-2">Vendita</div>
                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Listino</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">€{totalListinoVendita.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Netto</div>
                          <div className="text-[10px] text-muted-foreground">(Prezzo scontato)</div>
                          <div className="text-lg font-bold text-primary">€{totalNettoVendita.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Costi</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">€{costoTotale.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sconto Medio</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">{scontoMedioVendita.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Marginalità di vendita</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold text-green-600">{marginalitaVendita.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4" />

                    {/* NOLEGGIO */}
                    <div>
                      <div className="grid grid-cols-5 gap-4 text-center mb-4">
                        <div className="text-left">
                          <div className="text-lg font-semibold text-primary">Noleggio</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Noleggio</div>
                          <div className="text-xl font-bold">€{(prezzoNoleggioStruttura + prezzoNoleggioAccessori).toFixed(2)}</div>
                        </div>
                        <div /><div /><div />
                      </div>

                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Listino</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">€{listStruttura.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Prezzo Netto</div>
                          <div className="text-[10px] text-muted-foreground">(Prezzo scontato)</div>
                          <div className="text-lg font-bold text-primary">€{totalNettoNoleggio.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground mt-2">di cui:</div>
                          <div className="text-xs text-muted-foreground">
                            Premontaggio:{" "}
                            <span className="font-medium text-foreground">€{nettoPremontaggio.toFixed(2)}</span>
                          </div>
                          <div className="mt-3">
                            <div className="text-xs text-muted-foreground">Totale Preventivo Finale</div>
                            <div className="text-xl font-bold text-primary">€{totalePreventivoFinale.toFixed(2)}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Totale Costi Vendita</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">€{costoTotale.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sconto Medio</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold">{scontoMedioNoleggio.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Marginalità su Venduto</div>
                          <div className="text-[10px] invisible">-</div>
                          <div className="text-lg font-bold text-green-600">{marginalitaNoleggio.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
