import React, {useMemo, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Calculator, ChevronDown, ChevronRight} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {PreventivoBean} from "@/types/preventivo";
import {ParametriAPI} from "@/api/parametri";
import {TableBody, Table, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../ui/collapsible";
import {ParametriBean} from "@/types/parametri.ts";
import {useStandCosts} from "@/hooks/useStandCosts.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

interface StandSectionProps {
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}

export function StandSection({formData, setFormData}: StandSectionProps) {

  type AccessorioItem = {
    qty: number;
    noleggio: boolean;
  };

  type AccessoriStandMap = Record<string, AccessorioItem>;

  const parseAccessoriStand = (json?: string): AccessoriStandMap => {
    if (!json) return {};

    try {
      const parsed = JSON.parse(json);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  };

  const stringifyAccessoriStand = (map: AccessoriStandMap): string =>
      JSON.stringify(map);

  // Se non lo usi davvero, rimuovilo per evitare warning
  const [accessoriOpen, setAccessoriOpen] = useState(true);
  const {data: parametri = []} = useQuery({
    queryKey: ["parametri-for-preventivi"],
    queryFn: () =>
        ParametriAPI.getParametriList({
          sortFields: [
            {field: "PARAMETRI_TIPO", desc: false},
            {field: "PARAMETRI_ORDINE", desc: false},
          ],
        }),
  });

  const profiliDistribuzioneMap = useMemo(() => {
    const map: Record<number, number> = {};
    for (const p of parametri as ParametriBean[]) {
      if (p?.tipo === "profili_distribuzione") {
        const key = Number(p?.nome);
        if (Number.isFinite(key)) map[key] = Number(p?.valore);
      }
    }
    return map;
  }, [parametri]);

  const physicalElements = useMemo(() => {
    const profondita = Number(formData.profondita);
    const larghezza = Number(formData.larghezza);
    const altezza = Number(formData.altezza);
    const distribuzione = Number(formData.distribuzione);
    const bifaccialita = Number(formData.bifaccialita);

    // campi stringa
    const layout = formData.layout;

    // se “obbligatori”, blocca calcolo quando sono 0 o mancanti
    if (!profondita || !larghezza || !altezza || !layout || !distribuzione) {
      return {superficieStampa: 0, superficieMq: 0, sviluppoLineare: 0, numeroPezzi: 0};
    }

    // Superficie di stampa
    let superficieStampa: number;
    switch (layout) {
      case "4_lati":
        superficieStampa = (2 * larghezza + 2 * profondita) * altezza + bifaccialita * altezza;
        break;
      case "3_lati":
        superficieStampa = (larghezza + 2 * profondita) * altezza + bifaccialita * altezza + altezza;
        break;
      case "2_lati":
        superficieStampa = (larghezza + profondita) * altezza + bifaccialita * altezza + altezza;
        break;
      case "1_lato":
        superficieStampa = larghezza * altezza + bifaccialita * altezza + altezza;
        break;
      case "0_lati":
      default:
        superficieStampa = 0;
        break;
    }

    // Superficie metri quadri
    const superficieMq = larghezza * profondita;

    // Sviluppo lineare
    let sviluppoLineare: number;
    switch (layout) {
      case "4_lati":
        sviluppoLineare = 2 * larghezza + 2 * profondita;
        break;
      case "3_lati":
        sviluppoLineare = larghezza + 2 * profondita;
        break;
      case "2_lati":
        sviluppoLineare = larghezza + profondita;
        break;
      case "1_lato":
        sviluppoLineare = larghezza;
        break;
      case "0_lati":
      default:
        sviluppoLineare = 0;
        break;
    }

    // Numero di pezzi
    const fattoreDistribuzione = profiliDistribuzioneMap[distribuzione] ?? 0;
    const numeroPezzi = sviluppoLineare * fattoreDistribuzione + bifaccialita * (distribuzione + 1);

    return {superficieStampa, superficieMq, sviluppoLineare, numeroPezzi};
  }, [
    formData.profondita,
    formData.larghezza,
    formData.altezza,
    formData.layout,
    formData.distribuzione,
    formData.bifaccialita,
    profiliDistribuzioneMap,
  ]);

  // Fetch accessori stand from database
  const {
    data: accessoriStand = [],
  } = useQuery({
    queryKey: ["listino-accessori-stand", true],
    queryFn: () => ParametriAPI.getListinoAccessoriStand({
      attivo: true, sortFields: [{
        field: "LISTINO_ACCESSORI_STAND_NAME",
        desc: false
      }]
    }),
  });

  const accessoriStandMap = useMemo<AccessoriStandMap>(() => {
    return parseAccessoriStand(formData.accessoriStandConfig);
  }, [formData.accessoriStandConfig]);


  const handleAccessorioChange = (id: string, quantity: number) => {
    setFormData(prev => {
      const current = parseAccessoriStand(prev.accessoriStandConfig);
      const updated: AccessoriStandMap = {
        ...current,
        [id]: {
          qty: quantity,
          noleggio: current[id]?.noleggio ?? false,
        },
      };
      if (quantity <= 0) {
        delete updated[id];
      }
      return {
        ...prev,
        accessoriStandConfig: stringifyAccessoriStand(updated),
      };
    });
  };

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

  // Query per recuperare i costi retroilluminazione
  const {
    data: listinoRetroilluminazione = []
  } = useQuery({
    queryKey: ['costi-retroilluminazione'],
    queryFn: () => ParametriAPI.getListinoRetroilluminazione({
      sortFields: [{
        field: "PARAMETRI_COSTI_RETROILLUMINAZIONE_ALTEZZA",
        desc: false
      }]
    })
  });

  const {data: listinoServizi = []} = useQuery({
    queryKey: ["listino-servizi-prezzo-unitario"],
    queryFn: () =>
        ParametriAPI.getListinoServiziPrezzoUnitario({
          attivo: true,
        }),
  });

  // Calcolo dei costi automatici
  const costs = useStandCosts({
    formData,
    physicalElements,
    parametri,
    parametriCostiUnitari,
    listinoRetroilluminazione: listinoRetroilluminazione,
    accessoriStand,
    listinoServizi
  });

  const venditaTotaleListino = costs.totalePrezzoListinoVendita;
  const venditaTotaleNetto = costs.totalePrezzoNettoVendita;
  const venditaTotaleCosti = costs.totaleCostiVendita;
  const venditaScontoMedio = costs.scontoMedioVendita;
  const venditaMarginalita = costs.marginalitaVendita;

  const noleggioTotaleListino = costs.totalePrezzoListinoNoleggio;
  const noleggioTotaleNetto = costs.totalePrezzoNettoNoleggio;
  const noleggioTotaleCosti = costs.totaleCostiNoleggio;
  const noleggioScontoMedio = costs.scontoMedioNoleggio;
  const noleggioMarginalita = costs.marginalitaNoleggio;

  const handleNoleggioChange = (id: string, value: boolean) => {
    setFormData(prev => {
      const current = parseAccessoriStand(prev.accessoriStandConfig);
      if (!current[id] && !value) return prev;
      const updated: AccessoriStandMap = {
        ...current,
        [id]: {
          qty: current[id]?.qty ?? 0,
          noleggio: value,
        },
      };
      return {
        ...prev,
        accessoriStandConfig: stringifyAccessoriStand(updated),
      };
    });
  };

  return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5"/>
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
                  onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        profondita: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                  }
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
                  value={formData.larghezza || ""}
                  onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        larghezza: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                  }
                  placeholder="0.0"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altezza">Altezza (m) *</Label>
              <Select
                  value={String(formData.altezza)}
                  onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        altezza: Number(value),
                      }))
                  }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona altezza"/>
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
              <Select
                  value={formData.layout}
                  onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        layout: value as string,
                      }))
                  }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona layout"/>
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
              <Select
                  value={String(formData.distribuzione)}
                  onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        distribuzione: Number(value),
                      }))
                  }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona distribuzione"/>
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
              <Select
                  value={formData.complessita}
                  onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        complessita: value as string,
                      }))
                  }
              >
                <SelectTrigger>
                  <SelectValue/>
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
                  type="number"
                  step="0.5"
                  min="0"
                  max="15"
                  value={formData.bifaccialita ?? ""}
                  onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bifaccialita: e.target.value === "" ? null : Number(e.target.value),
                      }))
                  }
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
                  onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        retroilluminazione: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                  }
                  placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="premontaggio">Premontaggio</Label>
              <Select
                  value={formData.premontaggio ? "SI" : "NO"}
                  onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        premontaggio: value === "SI",
                      }))
                  }
              >
                <SelectTrigger>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SI">SI</SelectItem>
                  <SelectItem value="NO">NO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5"/>
            <h4 className="text-md font-semibold">Elementi Fisici Stand</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Superficie di stampa</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                    className="text-2xl font-bold">{physicalElements.superficieStampa.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">m²</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Superficie metri quadri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{physicalElements.superficieMq.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">m²</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sviluppo lineare</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                    className="text-2xl font-bold">{physicalElements.sviluppoLineare.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">m</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Numero di pezzi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{physicalElements.numeroPezzi.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">N</p>
              </CardContent>
            </Card>
          </div>
          {/* Accessori Stand */}
          <Collapsible open={accessoriOpen} onOpenChange={setAccessoriOpen}>
            <div className="space-y-4">
              <CollapsibleTrigger
                  className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg transition-colors mx-0 px-0 py-[13px]">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5"/>
                  <h4 className="text-md font-semibold">Accessori Stand</h4>
                </div>
                {accessoriOpen ? <ChevronDown className="h-4 w-4"/> :
                    <ChevronRight className="h-4 w-4"/>}
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4">
                {<Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Accessorio</TableHead>
                          <TableHead className="text-center">Costo unitario</TableHead>
                          <TableHead className="text-center w-24">Quantità</TableHead>
                          <TableHead className="text-center w-24">Noleggio</TableHead>
                          <TableHead className="text-right">Costo totale</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accessoriStand.map(accessorio => {
                          const item = accessoriStandMap[accessorio.id];
                          const quantity = item?.qty || 0;
                          const noleggio = item?.noleggio || false;
                          const totalCost = quantity * accessorio.costoUnitario;

                          return (
                              <TableRow key={accessorio.id}>
                                <TableCell className="font-medium py-1">
                                  {accessorio.nome}
                                </TableCell>

                                <TableCell className="text-center py-1">
                                  € {accessorio.costoUnitario.toFixed(2).replace(".", ",")}
                                </TableCell>

                                <TableCell className="text-center">
                                  <Input
                                      type="number"
                                      min="0"
                                      max="99"
                                      value={quantity}
                                      onChange={e =>
                                          handleAccessorioChange(
                                              accessorio.id,
                                              parseInt(e.target.value, 10) || 0
                                          )
                                      }
                                      className="w-14 text-center"
                                  />
                                </TableCell>

                                {/* NUOVO FLAG NOLEGGIO */}
                                <TableCell className="text-center">
                                  <Checkbox
                                      checked={noleggio}
                                      onCheckedChange={(checked) =>
                                          handleNoleggioChange(accessorio.id, !!checked)
                                      }
                                  />
                                </TableCell>

                                <TableCell className="text-right font-medium">
                                  € {totalCost.toFixed(2).replace(".", ",")}
                                </TableCell>
                              </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>}
              </CollapsibleContent>
            </div>

            {/* Calcolo Costi Stand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5"/>
                <h4 className="text-md font-semibold">Calcolo Preventivo Stand</h4>
              </div>

              {/* Layout 3x2 - Prima riga */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Struttura a terra */}
                <Card className="p-4">
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm font-medium">Struttura a terra</div>
                    <div className="text-lg font-bold">
                      €{costs.prezzoStrutturaTerra.toFixed(2)}
                    </div>
                  </div>

                  {/* COSTO */}
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Costo componenti</span>
                    <span>€{costs.costoStrutturaTerra.toFixed(2)}</span>
                  </div>

                  {/* SCONTO */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Sconto</div>
                      <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={formData.scontoStrutturaTerra || 0}
                            onChange={e =>
                                setFormData({
                                  ...formData,
                                  scontoStrutturaTerra: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-16 h-6 text-xs text-center"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    </div>

                    <div className="text-sm font-medium">
                      -€{(costs.prezzoStrutturaTerra * (formData.scontoStrutturaTerra || 0) / 100).toFixed(2)}
                    </div>
                  </div>

                  {/* NETTO */}
                  <div className="flex justify-between items-end mt-3 pt-2 border-t">
                    <span className="text-sm font-medium">Prezzo netto</span>
                    <span className="text-lg font-bold text-primary">
                      €{costs.prezzoNettoStrutturaTerra.toFixed(2)}
                    </span>
                  </div>

                  {/* COEFF NOLEGGIO */}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Coeff. noleggio</span>
                    <span
                        className="text-sm font-medium">{formData.coefficienteNoleggio ? formData.coefficienteNoleggio.nome : 0}</span>
                  </div>
                  {/* PREZZO NOLEGGIO */}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-medium">Prezzo noleggio</span>
                    <span className="text-lg font-bold">
                      €{(costs.prezzoNettoStrutturaTerra * (formData.coefficienteNoleggio ? formData.coefficienteNoleggio.valore : 0)).toFixed(2)}
                    </span>
                  </div>
                </Card>

                {/* Grafica con cordino a terra */}
                <Card className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm font-medium">Grafica con cordino</div>

                    {/* FLAG ATTIVO */}
                    <Input
                        type="checkbox"
                        checked={formData.graficaCordinoAttiva ?? false}
                        onChange={e =>
                            setFormData({
                              ...formData,
                              graficaCordinoAttiva: e.target.checked,
                            })
                        }
                        className="w-4 h-4"
                    />
                  </div>

                  {/* COSTO */}
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Costo componenti</span>
                    <span>€{costs.costoGraficaCordino.toFixed(2)}</span>
                  </div>

                  {/* PREZZO BASE */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Prezzo</span>
                    <span className="text-sm font-medium">€
                      {(
                          formData.graficaCordinoAttiva
                              ? costs.prezzoGraficaCordino
                              : 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* SCONTO */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Sconto</div>
                      <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={formData.scontoGraficaCordino || 0}
                            onChange={e =>
                                setFormData({
                                  ...formData,
                                  scontoGraficaCordino: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-16 h-6 text-xs text-center"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    </div>

                    <div className="text-sm font-medium">
                      -€
                      {(
                          (formData.graficaCordinoAttiva
                              ? costs.prezzoGraficaCordino
                              : 0) *
                          (formData.scontoGraficaCordino || 0) /
                          100
                      ).toFixed(2)}
                    </div>
                  </div>

                  {/* NETTO */}
                  <div className="flex justify-between items-end mt-3 pt-2 border-t">
                    <span className="text-sm font-medium">Prezzo netto</span>
                    <span className="text-lg font-bold text-primary">€
                      {(
                          (formData.graficaCordinoAttiva
                              ? costs.prezzoGraficaCordino
                              : 0) -
                          ((formData.graficaCordinoAttiva
                                  ? costs.prezzoGraficaCordino
                                  : 0) *
                              (formData.scontoGraficaCordino || 0)) /
                          100
                      ).toFixed(2)}
                    </span>
                  </div>
                </Card>

                {/* Retroilluminazione */}
                <Card className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm font-medium">Retroilluminazione</div>
                  </div>

                  {/* COSTO */}
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Costo componenti</span>
                    <span>€{costs.costoRetroilluminazione.toFixed(2)}</span>
                  </div>

                  {/* PREZZO */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Prezzo</span>
                    <span className="text-sm font-medium">
                      €{costs.prezzoRetroilluminazione.toFixed(2)}
                    </span>
                  </div>

                  {/* SCONTO */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Sconto</div>
                      <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={formData.scontoRetroilluminazione || 0}
                            onChange={e =>
                                setFormData({
                                  ...formData,
                                  scontoRetroilluminazione: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-16 h-6 text-xs text-center"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    </div>

                    <div className="text-sm font-medium">
                      -€
                      {(
                          costs.costoRetroilluminazione *
                          (formData.scontoRetroilluminazione || 0) /
                          100
                      ).toFixed(2)}
                    </div>
                  </div>

                  {/* NETTO */}
                  <div className="flex justify-between items-end mt-3 pt-2 border-t">
                    <span className="text-sm font-medium">Prezzo netto</span>
                    <span className="text-lg font-bold text-primary">€
                      {(
                          costs.prezzoNettoRetroilluminazione
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* COEFF NOLEGGIO */}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Coeff. noleggio</span>
                    <span className="text-sm font-medium">
                      {formData.coefficienteNoleggio
                          ? formData.coefficienteNoleggio.nome
                          : 0}
                    </span>
                  </div>

                  {/* PREZZO NOLEGGIO */}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-medium">Prezzo noleggio</span>
                    <span className="text-lg font-bold">€
                      {(
                          costs.prezzoNettoRetroilluminazione *
                          (formData.coefficienteNoleggio?.valore ?? 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </Card>
              </div>
              {/* Layout 3x2 - Seconda riga */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Accessori */}
                <Card className="p-4">
                  <div className="text-sm font-medium mb-3">Accessori</div>

                  {/* =========================
        ACCESSORI VENDITA
     ========================= */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Accessori vendita</span>
                      <span>€{costs.costiAccessoriVendita.toFixed(2)}</span>
                    </div>

                    {/* SCONTO */}
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-muted-foreground">Sconto cliente</div>
                        <div className="flex items-center gap-1">
                          <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={formData.scontoAccessoriVendita || 0}
                              onChange={e =>
                                  setFormData({
                                    ...formData,
                                    scontoAccessoriVendita: parseFloat(e.target.value) || 0,
                                  })
                              }
                              className="w-14 h-6 text-xs text-center"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      </div>

                      <div className="text-xs">
                        -€{(costs.costiAccessoriVendita - costs.nettoAccessoriVendita).toFixed(2)}
                      </div>
                    </div>

                    {/* NETTO */}
                    <div className="flex justify-between font-medium text-sm">
                      <span>Netto vendita</span>
                      <span>€{costs.nettoAccessoriVendita.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* =========================
        ACCESSORI NOLEGGIO
     ========================= */}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Accessori noleggio</span>
                      <span>€{costs.costiAccessoriNoleggio.toFixed(2)}</span>
                    </div>

                    {/* SCONTO */}
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-muted-foreground">Sconto cliente</div>
                        <div className="flex items-center gap-1">
                          <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={formData.scontoAccessoriNoleggio || 0}
                              onChange={e =>
                                  setFormData({
                                    ...formData,
                                    scontoAccessoriNoleggio: parseFloat(e.target.value) || 0,
                                  })
                              }
                              className="w-14 h-6 text-xs text-center"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      </div>

                      <div className="text-xs">
                        -€{(costs.costiAccessoriNoleggio - costs.nettoAccessoriNoleggio).toFixed(2)}
                      </div>
                    </div>

                    {/* NETTO */}
                    <div className="flex justify-between text-sm mb-1">
                      <span>Netto noleggio</span>
                      <span>€{costs.nettoAccessoriNoleggio.toFixed(2)}</span>
                    </div>

                    {/* COEFF */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Coeff. noleggio</span>
                      <span>{formData.coefficienteNoleggio?.nome || "-"}</span>
                    </div>

                    {/* PREZZO NOLEGGIO */}
                    <div className="flex justify-between font-bold text-sm mt-1">
                      <span>Prezzo noleggio</span>
                      <span>€{costs.prezzoNoleggioAccessori.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* =========================
        TOTALE
     ========================= */}
                  <div className="flex justify-between items-end mt-4 pt-2 border-t">
                    <span className="text-sm font-medium">Totale accessori</span>
                    <span className="text-lg font-bold text-primary">
      €{costs.totaleAccessori.toFixed(2)}
    </span>
                  </div>
                </Card>

                {/* Premontaggio */}
                <Card className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm font-medium">Premontaggio</div>
                  </div>

                  {/* COSTO */}
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Costo componenti</span>
                    <span>€{costs.costoPremontaggio.toFixed(2)}</span>
                  </div>

                  {/* PREZZO */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Prezzo</span>
                    <span className="text-sm font-medium">
                      €{costs.prezzoPremontaggio.toFixed(2)}
                    </span>
                  </div>

                  {/* SCONTO */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Sconto</div>
                      <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={formData.scontoPremontaggio || 0}
                            onChange={e =>
                                setFormData({
                                  ...formData,
                                  scontoPremontaggio: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-16 h-6 text-xs text-center"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    </div>

                    <div className="text-sm font-medium">
                      -€{
                      (costs.prezzoPremontaggio *
                          (formData.scontoPremontaggio || 0) /
                          100
                      ).toFixed(2)
                    }
                    </div>
                  </div>

                  {/* NETTO */}
                  <div className="flex justify-between items-end mt-3 pt-2 border-t">
                    <span className="text-sm font-medium">Prezzo netto</span>
                    <span className="text-lg font-bold text-primary">€
                      €{costs.prezzoNettoPremontaggio.toFixed(2)}
                    </span>
                  </div>
                </Card>

                {/* Extra Stand Complesso */}
                <Card className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm font-medium">Extra Stand Complesso</div>
                  </div>

                  {/* COSTO BASE */}
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Extra base</span>
                    <span>€{costs.extraStandComplesso.toFixed(2)}</span>
                  </div>

                  {/* PERCENTUALE EXTRA */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Extra % su struttura</div>
                      <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min="0"
                            max="200"
                            step="1"
                            value={formData.extraPercComplex || 0}
                            onChange={e =>
                                setFormData({
                                  ...formData,
                                  extraPercComplex: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-16 h-6 text-xs text-center"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    </div>
                  </div>

                  {/* SCONTO */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Sconto</div>
                      <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={formData.scontoExtraStandComplesso || 0}
                            onChange={e =>
                                setFormData({
                                  ...formData,
                                  scontoExtraStandComplesso: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-16 h-6 text-xs text-center"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    </div>

                    <div className="text-sm font-medium">
                      -€
                      {(
                          costs.extraStandComplesso *
                          (formData.scontoExtraStandComplesso || 0) /
                          100
                      ).toFixed(2)}
                    </div>
                  </div>

                  {/* NETTO */}
                  <div className="flex justify-between items-end mt-3 pt-2 border-t">
                    <span className="text-sm font-medium">Prezzo netto</span>
                    <span className="text-lg font-bold text-primary">
                      €{costs.extraStandComplessoNetto.toFixed(2)}
                    </span>
                  </div>
                </Card>
              </div>
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="pt-4 space-y-6">

                  {/* ===================== VENDITA ===================== */}
                  <div>
                    <div className="text-lg font-semibold text-primary mb-2">
                      Vendita
                    </div>

                    <div className="grid grid-cols-5 gap-4 text-center">

                      <div>
                        <div className="text-xs text-muted-foreground">Totale Prezzo Listino</div>
                        <div className="text-lg font-bold">
                          €{costs.totalePrezzoListinoVendita?.toFixed(2) ?? "0.00"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Totale Prezzo Netto</div>
                        <div className="text-[10px] text-muted-foreground">(Prezzo scontato)</div>
                        <div className="text-lg font-bold text-primary">
                          €{costs.totalePrezzoNettoVendita?.toFixed(2) ?? "0.00"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Totale Costi</div>
                        <div className="text-lg font-bold">
                          €{costs.totaleCostiVendita?.toFixed(2) ?? "0.00"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Sconto Medio</div>
                        <div className="text-lg font-bold">
                          {costs.scontoMedioVendita?.toFixed(1) ?? "0.0"}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Marginalità di vendita</div>
                        <div className="text-lg font-bold text-green-600">
                          {costs.marginalitaVendita?.toFixed(1) ?? "0.0"}%
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ===================== SEPARATORE ===================== */}
                  <div className="border-t pt-4" />

                  {/* ===================== NOLEGGIO ===================== */}
                  <div>

                    {/* Titolo + Totale Prezzo Noleggio allineato sopra col 2 */}
                    <div className="grid grid-cols-5 gap-4 text-center mb-4">
                      <div className="text-left">
                        <div className="text-lg font-semibold text-primary">Noleggio</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Totale Prezzo Noleggio</div>
                        <div className="text-xl font-bold">
                          €{costs.totalePrezzoNoleggio?.toFixed(2) ?? "0.00"}
                        </div>
                      </div>
                      <div /><div /><div />
                    </div>

                    {/* Griglia a 5 colonne */}
                    <div className="grid grid-cols-5 gap-4 text-center">

                      {/* Col 1 – Totale Prezzo Listino */}
                      <div>
                        <div className="text-xs text-muted-foreground">Totale Prezzo Listino</div>
                        <div className="text-lg font-bold">
                          €{costs.totalePrezzoListinoNoleggio?.toFixed(2) ?? "0.00"}
                        </div>
                      </div>

                      {/* Col 2 – Totale Prezzo Netto + di cui + Totale Preventivo Finale */}
                      <div>
                        <div className="text-xs text-muted-foreground">Totale Prezzo Netto</div>
                        <div className="text-[10px] text-muted-foreground">(Prezzo scontato)</div>
                        <div className="text-lg font-bold text-primary">
                          €{costs.totalePrezzoNettoNoleggio?.toFixed(2) ?? "0.00"}
                        </div>

                        {/* di cui */}
                        <div className="text-xs text-muted-foreground mt-2">di cui:</div>
                        <div className="text-xs text-muted-foreground">
                          Premontaggio:{" "}
                          <span className="font-medium text-foreground">
                            €{costs.premontaggio?.toFixed(2) ?? "0.00"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Extra complesso:{" "}
                          <span className="font-medium text-foreground">
                            €{costs.extraComplesso?.toFixed(2) ?? "0.00"}
                          </span>
                        </div>

                        {/* Totale Preventivo Finale */}
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground">Totale Preventivo Finale</div>
                          <div className="text-xl font-bold text-primary">
                            €{costs.totalePreventivoFinale?.toFixed(2) ?? "0.00"}
                          </div>
                        </div>
                      </div>

                      {/* Col 3 – Totale Costi Vendita */}
                      <div>
                        <div className="text-xs text-muted-foreground">Totale Costi Vendita</div>
                        <div className="text-lg font-bold">
                          €{costs.totaleCostiNoleggio?.toFixed(2) ?? "0.00"}
                        </div>
                      </div>

                      {/* Col 4 – Sconto Medio */}
                      <div>
                        <div className="text-xs text-muted-foreground">Sconto Medio</div>
                        <div className="text-lg font-bold">
                          {costs.scontoMedioNoleggio?.toFixed(1) ?? "0.0"}%
                        </div>
                      </div>

                      {/* Col 5 – Marginalità su Venduto */}
                      <div>
                        <div className="text-xs text-muted-foreground">Marginalità su Venduto</div>
                        <div className="text-lg font-bold text-green-600">
                          {costs.marginalitaNoleggio?.toFixed(1) ?? "0.0"}%
                        </div>
                      </div>

                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </Collapsible>
        </div>
      </div>
  );
}
