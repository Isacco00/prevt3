import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {ChevronDown, ChevronRight} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import React, {useState} from "react";
import {ParametriAPI} from "@/api/parametri.ts";
import {PreventivoBean} from "@/types/preventivo.ts";

interface DeskSectionProps {
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}

export function DeskSection({formData, setFormData}: DeskSectionProps) {
  const [accessoriOpen, setAccessoriOpen] = useState(true);

  const fieldMap: Record<string, keyof PreventivoBean> = {
    "Porta scorrevole con chiave": "portaScorrevole",
    "Ripiano Superiore L 100": "ripianoSuperiore",
    "Ripiano Inferiore L 100": "ripianoInferiore",
    "Teca in plexiglass": "tecaPlexiglass",
    "Fronte luminoso dim. 100x100": "fronteLuminoso",
    "Borsa": "borsa",
  };

  const deskLayoutsArray = Array.isArray(formData.layoutDesk) ? formData.layoutDesk as any[] : (() => {
    try {
      return typeof (formData.layoutDesk as any) === 'string' ? JSON.parse(formData.layoutDesk as any) : [];
    } catch {
      return [];
    }
  })();

  // Query per recuperare i parametri a costi unitari
  const {
    data: parametriCostiUnitari = []
  } = useQuery({
    queryKey: ['parametri-costi-unitari'],
    queryFn: () => ParametriAPI.getParametriACostiUnitari({
      attivo: true, sortFields: [{
        field: "PARAMETRI_COSTI_UNITARI_PARAMETRO",
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
    data: costiStrutturaDesk
  } = useQuery({
    queryKey: ["costi-struttura-desk-layout"],
    queryFn: () => ParametriAPI.getCostiStrutturaDesk({attivo: true})
  });

  const handleAccessorioChange = (accessorioNome: string, quantity: number) => {
    // Mappa i nomi degli accessori ai campi del formData
    const field = fieldMap[accessorioNome];
    if (!field) return;
    setFormData(prev => ({
      ...prev,
      [field]: quantity,
    }));
  };
  const getLayoutCost = (layout: string) => {
    if (!costiStrutturaDesk) return 0;
    const costo = costiStrutturaDesk.find(c => c.layoutDesk === layout);
    return costo ? Number(costo.costoUnitario) : 0;
  };

  const calculateLayoutTotal = (layout: string, quantity: number) => {
    return getLayoutCost(layout) * quantity;
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
    const arr = Array.isArray(formData.layoutDesk) ? formData.layoutDesk as any[] : (() => {
      try {
        return typeof (formData.layoutDesk as any) === 'string' ? JSON.parse(formData.layoutDesk as any) : [];
      } catch {
        return [];
      }
    })();
    if (!arr.length) return 0;
    return arr.reduce((total, config: any) => {
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
    const arr = Array.isArray(formData.layoutDesk) ? formData.layoutDesk as any[] : (() => {
      try {
        return typeof (formData.layoutDesk as any) === 'string' ? JSON.parse(formData.layoutDesk as any) : [];
      } catch {
        return [];
      }
    })();
    if (!arr.length) return 0;
    return arr.reduce((total, config: any) => {
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
    let costiAccessoriDesk = 0;
    if (accessoriDesk && accessoriDesk.length > 0) {
      // Calcolo basato sui campi individuali del formData
      costiAccessoriDesk += (formData.portaScorrevole || 0) * (accessoriDesk.find(a => a.nome === 'Porta scorrevole con chiave')?.costoUnitario || 0);
      costiAccessoriDesk += (formData.ripianoSuperiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Superiore L 100')?.costoUnitario || 0);
      costiAccessoriDesk += (formData.ripianoInferiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Inferiore L 100')?.costoUnitario || 0);
      costiAccessoriDesk += (formData.tecaPlexiglass || 0) * (accessoriDesk.find(a => a.nome === 'Teca in plexiglass')?.costoUnitario || 0);
      costiAccessoriDesk += (formData.fronteLuminoso || 0) * (accessoriDesk.find(a => a.nome === 'Fronte luminoso dim. 100x100')?.costoUnitario || 0);
      costiAccessoriDesk += (formData.borsa || 0) * (accessoriDesk.find(a => a.nome === 'Borsa')?.costoUnitario || 0);
    }

    // Calcolo costi desk
    const costoStampaDeskParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
    const costoPremontaggerDesk = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');

    const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: any) => {
      const costoLayout = costiStrutturaDesk?.find((c: any) => c.layout_desk === config.layout);
      return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
    }, 0);
    // Grafica desk con cordino cucito
    const superficieStampaDesk = calculateSuperficieStampaDesk();
    const graficaCordinoDesk = costoStampaDeskParam ? superficieStampaDesk * (costoStampaDeskParam.valore || 0) : 0;
    // Premontaggio desk
    const numeroPezziDesk = calculateNumeroPezziDesk();
    const premontaggioDesk = costoPremontaggerDesk ? numeroPezziDesk * (costoPremontaggerDesk.valore || 0) : 0;
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
                    <TableHead className="text-center">Quantità</TableHead>
                    <TableHead className="text-right">Prezzo unitario</TableHead>
                    <TableHead className="text-right">Costo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {['50', '100', '150', '200'].map((layout, index) => {
                    const layoutConfig = safeLayouts.find(l => l.layout === layout) || {
                      layout,
                      quantity: 0
                    };
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
                                    newLayouts[layoutIndex] = {layout, quantity};
                                  } else {
                                    // Add new layout
                                    newLayouts.push({layout, quantity});
                                  }

                                  setFormData({...formData, layoutDesk: newLayouts})
                                }}
                                className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell
                              className="text-right">€ {unitCost.toFixed(2).replace('.', ',')}</TableCell>
                          <TableCell
                              className="text-right font-medium">€ {totalCost.toFixed(2).replace('.', ',')}</TableCell>
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
                          <TableHead className="text-center w-24">Quantità</TableHead>
                          <TableHead className="text-right">Costo totale</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accessoriDesk.map((accessorio: any) => {
                          // Mappa i nomi degli accessori ai campi del formData
                          const field = fieldMap[accessorio.nome];
                          const quantity = field ? (formData[field] || 0) : 0;
                          const total = Number(quantity) * Number(accessorio.costoUnitario);
                          return (
                              <TableRow key={accessorio.id}>
                                <TableCell
                                    className="font-medium">{accessorio.nome}</TableCell>
                                <TableCell
                                    className="text-center">€ {Number(accessorio.costoUnitario).toFixed(2).replace('.', ',')}</TableCell>
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
                                <TableCell
                                    className="text-right font-medium">€ {total.toFixed(2).replace('.', ',')}</TableCell>
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

        {/* Calcolo Costi Desk */}

        <Card>
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold mb-4 text-desk">Calcolo Preventivo Desk</h4>

            {/* Cost cards in 3x2 layout (3 items in 2 rows) */}
            <div className="grid grid-cols-2 gap-4 mb-4">


              {/* Struttura desk NEW */}
              <Card className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-medium">Struttura desk</div>
                  <div
                      className="text-lg font-bold">€{(costs.costiDesk?.strutturaTerra ?? 0).toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">Ricarico</div>
                    <div className="flex items-center gap-1">
                      <Input
                          type="number"
                          min="0"
                          max="200"
                          step="1"
                          value={formData.marginalitaStrutturaDesk ?? 0}
                          onChange={(e) =>
                              setFormData({
                                ...formData,
                                marginalitaStrutturaDesk: Number(e.target.value)
                              })
                          }
                          className="w-16 h-6 text-xs text-center"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </div>

                  <div className="text-lg font-bold text-primary">
                    €{((costs.costiDesk?.strutturaTerra ?? 0) * (1 + ((formData.marginalitaStrutturaDesk ?? 0) / 100))).toFixed(2)}
                  </div>
                </div>
              </Card>


              {/* Grafica desk NEW*/}
              <Card className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-medium">Grafica desk</div>
                  <div
                      className="text-lg font-bold">€{(costs.costiDesk?.graficaCordino ?? 0).toFixed(2)}</div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">Ricarico</div>
                    <div className="flex items-center gap-1">
                      <Input
                          type="number"
                          min="0"
                          max="200"
                          step="1"
                          value={formData.marginalitaGraficaDesk ?? 0}
                          onChange={(e) =>
                              setFormData({
                                ...formData,
                                marginalitaGraficaDesk: Number(e.target.value)
                              })
                          }
                          className="w-16 h-6 text-xs text-center"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </div>

                  <div className="text-lg font-bold text-primary">
                    €{((costs.costiDesk?.graficaCordino ?? 0) * (1 + ((formData.marginalitaGraficaDesk ?? 0) / 100))).toFixed(2)}
                  </div>
                </div>
              </Card>


              {/* Premontaggio desk NEW */}
              <Card className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-medium">Premontaggio desk</div>
                  <div
                      className="text-lg font-bold">€{(costs.costiDesk?.premontaggio ?? 0).toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">Ricarico</div>
                    <div className="flex items-center gap-1">
                      <Input
                          type="number"
                          min="0"
                          max="200"
                          step="1"
                          value={formData.marginalitaPremontaggioDesk ?? 0}
                          onChange={(e) =>
                              setFormData({
                                ...formData,
                                marginalitaPremontaggioDesk: Number(e.target.value)
                              })
                          }
                          className="w-16 h-6 text-xs text-center"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    €{((costs.costiDesk?.premontaggio ?? 0) * (1 + ((formData.marginalitaPremontaggioDesk ?? 0) / 100))).toFixed(2)}
                  </div>
                </div>
              </Card>

              {/* Accessori desk */}
              <Card className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-medium">Accessori desk</div>
                  <div
                      className="text-lg font-bold">€{(costs.costiAccessoriDesk ?? 0).toFixed(2)}</div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">Ricarico</div>
                    <div className="flex items-center gap-1">
                      <Input
                          type="number"
                          min="0"
                          max="200"
                          step="1"
                          value={formData.marginalitaAccessoriDesk ?? 0}
                          onChange={(e) =>
                              setFormData({
                                ...formData,
                                marginalitaAccessoriDesk: Number(e.target.value)
                              })
                          }
                          className="w-16 h-6 text-xs text-center"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </div>

                  <div className="text-lg font-bold text-primary">
                    €{(
                      (costs.costiAccessoriDesk ?? 0) *
                      (1 + ((formData.marginalitaAccessoriDesk ?? 0) / 100))
                  ).toFixed(2)}
                  </div>
                </div>
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
                          (costs.costiDesk?.strutturaTerra ?? 0) * (1 + (formData.marginalitaStrutturaDesk || 0) / 100) +
                          (costs.costiDesk?.graficaCordino ?? 0) * (1 + (formData.marginalitaGraficaDesk || 0) / 100) +
                          (costs.costiDesk?.premontaggio ?? 0) * (1 + (formData.marginalitaPremontaggioDesk || 0) / 100) +
                          (costs.costiAccessoriDesk ?? 0) * (1 + (formData.marginalitaAccessoriDesk || 0) / 100);
                      return totalePreventivo.toFixed(2);
                    })()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Totale costi desk</div>
                    <div className="text-2xl font-bold">
                      €{((costs.costiDesk?.strutturaTerra ?? 0) + (costs.costiDesk?.graficaCordino ?? 0) + (costs.costiDesk?.premontaggio ?? 0) + (costs.costiAccessoriDesk ?? 0)).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Marginalità Media (%)</div>
                    <div className="text-2xl font-bold text-green-600">
                      {(() => {
                        const totaleCosti = (costs.costiDesk?.strutturaTerra ?? 0) + (costs.costiDesk?.graficaCordino ?? 0) + (costs.costiDesk?.premontaggio ?? 0) + (costs.costiAccessoriDesk ?? 0);
                        if (totaleCosti === 0) return '0.0%';
                        const totalePreventivo =
                            (costs.costiDesk?.strutturaTerra ?? 0) * (1 + (formData.marginalitaStrutturaDesk || 0) / 100) +
                            (costs.costiDesk?.graficaCordino ?? 0) * (1 + (formData.marginalitaGraficaDesk || 0) / 100) +
                            (costs.costiDesk?.premontaggio ?? 0) * (1 + (formData.marginalitaPremontaggioDesk || 0) / 100) +
                            (costs.costiAccessoriDesk ?? 0) * (1 + (formData.marginalitaAccessoriDesk || 0) / 100);
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
