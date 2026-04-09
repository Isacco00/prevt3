import React, {useMemo} from 'react';
import {Calculator} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {Input} from '@/components/ui/input.tsx';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table.tsx';
import {useQuery} from "@tanstack/react-query";
import {ParametriAPI} from "@/api/parametri.ts";
import {ListinoStrutturaDeskBean, ListinoServiziPrezzoUnitarioBean, ParametriBean, PreventivoServiziBean} from "@/types/parametri.ts";
import {LayoutDeskBean, PreventivoBean} from "@/types/preventivo.ts";
import {useStandCosts} from "@/hooks/useStandCosts.ts";

interface TotalePreventivoSectionProps {
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}

export function TotalePreventivoSection({
                                          formData,
                                          setFormData
                                        }: TotalePreventivoSectionProps) {
  const {
    data: preventivoServizi,
  } = useQuery<PreventivoServiziBean | null>({
    queryKey: ['preventivo-servizi', formData?.id],
    queryFn: () => {
      if (!formData?.id) {
        return Promise.resolve(null);
      }
      return ParametriAPI.getPreventivoServiziByPreventivoId({
        preventivoId: formData.id,
      });
    },
    enabled: !!formData?.id,
  });

  // Fetch altri beni/servizi for the current preventivo
  const {
    data: altriBeniServizi = [],
  } = useQuery({
    queryKey: ['altri-beni-servizi', formData?.id],
    queryFn: () => {
      if (!formData?.id) {
        return Promise.resolve([]);
      }
      return ParametriAPI.getAltriBeniServiziByPreventivoId({
        preventivoId: formData.id
      });
    },
    enabled: !!formData?.id,
  });

// Query for service costs (certificazione + istruzioni/assistenza)
  const {
    data: serviceCosts = {},
  } = useQuery({
    queryKey: ['service-costs'],
    queryFn: async () => {
      const res = await ParametriAPI.getParametriACostiUnitari({
        attivo: true,
        parametri: [
          'Costo_certificazione',
          'Costo_istruzionieassistenza',
        ],
      });
      const costs: Record<string, number> = {};
      res.forEach((p) => {
        costs[p.parametro] = Number(p.valore) || 0;
      });
      return costs;
    },
  });

  // Query for accessories prices
  const {
    data: accessoriesData = []
  } = useQuery({
    queryKey: ['listino_accessori_espositori'],
    queryFn: () => ParametriAPI.getListinoAccessoriEspositori({
      attivo: true, sortFields: [{
        field: "LISTINO_ACCESSORI_ESPOSITORI_NOME",
        desc: false
      }]
    })
  });
  // Query for expositor layout costs
  const {
    data: layoutCostsEspositori = []
  } = useQuery({
    queryKey: ['listino_struttura_espositori'],
    queryFn: () => ParametriAPI.getListinoStrutturaEspositori({
      attivo: true, sortFields: [{
        field: "LISTINO_STRUTTURA_ESPOSITORI_LAYOUT_ESPOSITORE",
        desc: false
      }]
    })
  });

  type AccessoriStandMap = Record<string, number>;
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

  const parseAccessoriStand = (json?: string): AccessoriStandMap => {
    if (!json) return {};
    try {
      const parsed = JSON.parse(json);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  };

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

  const standCosts = useStandCosts({
    formData,
    physicalElements,
    parametri,
    parametriCostiUnitari,
    listinoRetroilluminazione: listinoRetroilluminazione,
    accessoriStand,
    listinoServizi
  });

  const standMargins = {
    marginalitaStruttura: formData.marginalitaStruttura,
    marginalitaGrafica: formData.marginalitaGrafica,
    marginalitaRetroilluminazione: formData.marginalitaRetroilluminazione,
    marginalitaAccessori: formData.marginalitaAccessori,
    marginalitaPremontaggio: formData.marginalitaPremontaggio
  }
  const storageMargins = {
    marginalitaStrutturaStorage: formData.marginalitaStrutturaStorage,
    marginalitaGraficaStorage: formData.marginalitaGraficaStorage,
    marginalitaPremontaggioStorage: formData.marginalitaPremontaggioStorage
  }
  const deskMargins = {
    marginalitaStrutturaDesk: formData.marginalitaStrutturaDesk,
    marginalitaGraficaDesk: formData.marginalitaGraficaDesk,
    marginalitaPremontaggioDesk: formData.marginalitaPremontaggioDesk,
    marginalitaAccessoriDesk: formData.marginalitaAccessoriDesk
  }
  const espositoriMargins = {
    marginalitaStrutturaEspositori: formData.marginalitaStrutturaEspositori,
    marginalitaGraficaEspositori: formData.marginalitaGraficaEspositori,
    marginalitaPremontaggioEspositori: formData.marginalitaPremontaggioEspositori,
    marginalitaAccessoriEspositori: formData.marginalitaAccessoriEspositori
  }

  // Calcolo automatico dei costi storage (sempre aggiornato)
  const calculatedStorageCosts = React.useMemo(() => {
    if (!formData.larghezzaStorage || !formData.profonditaStorage || !formData.altezzaStorage || !parametri.length || !listinoServizi.length || !accessoriStand.length) {
      return {
        costoStrutturaStorage: 0,
        costoGraficaStorage: 0,
        costoPremontaggioStorage: 0,
        costoTotaleStorage: 0
      };
    }

    const larg = formData.larghezzaStorage;
    const prof = formData.profonditaStorage;
    const alt = formData.altezzaStorage;
    const layout = formData.layoutStorage;
    const distribuzione = formData.distribuzione;

    // Calcolo superficie di stampa storage
    let superficieStampa = 0;
    switch (layout) {
      case '0':
        superficieStampa = (2 * larg + 2 * prof) * alt;
        break;
      case '1':
        superficieStampa = (2 * larg + 2 * prof) * alt + 2;
        break;
      case '2':
        superficieStampa = (larg + prof) * alt + 2;
        break;
    }

    // Calcolo sviluppo lineare storage
    let sviluppoLineare = 0;
    switch (layout) {
      case '0':
        sviluppoLineare = larg + prof;
        break;
      case '1':
        sviluppoLineare = 2 * larg + 2 * prof;
        break;
      case '2':
        sviluppoLineare = larg + prof + 1;
        break;
    }

    // Calcolo numero pezzi storage
    const fattoreDistribuzione = profiliDistribuzioneMap[distribuzione] || 0;
    const numeroPezzi = sviluppoLineare * fattoreDistribuzione;

    // Parametri necessari
    const costoStampaParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Stampa Grafica');
    const costoPremontaggio = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Premontaggio');
    const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && Number(p.valoreChiave) === formData.altezzaStorage);

    // Trova il costo della porta
    const portaAccessorio = accessoriStand.find(acc => acc.nome?.toLowerCase().includes('porta'));
    const costoPorta = portaAccessorio ? portaAccessorio.costoUnitario : 0;
    const numeroPorte = parseInt(formData.numeroPorte || '0') || 0;

    // Calcolo costi
    const costoStrutturaBase = costoAltezzaParam ? sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;
    const costoPorte = numeroPorte * costoPorta;
    const costoStrutturaStorage = costoStrutturaBase + costoPorte;

    const costoGraficaStorage = costoStampaParam ? superficieStampa * (costoStampaParam.costo || 0) : 0;
    const costoPremontaggioStorage = costoPremontaggio ? numeroPezzi * (costoPremontaggio.costo || 0) : 0;
    const costoTotaleStorage = costoStrutturaStorage + costoGraficaStorage + costoPremontaggioStorage;

    return {
      costoStrutturaStorage,
      costoGraficaStorage,
      costoPremontaggioStorage,
      costoTotaleStorage
    };
  }, [
    formData.larghezzaStorage,
    formData.profonditaStorage,
    formData.altezzaStorage,
    formData.layoutStorage,
    formData.numeroPorte,
    formData.distribuzione,
    parametri,
    listinoServizi,
    profiliDistribuzioneMap,
    accessoriStand
  ]);

  // Calcolo automatico dei costi espositori (sempre aggiornato)
  const calculatedEspositoriCosts = React.useMemo(() => {
    const qta30 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
    const qta50 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
    const qta100 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;

    if ((qta30 + qta50 + qta100) === 0 || !listinoServizi.length || !layoutCostsEspositori.length) {
      return {
        strutturaEspositori: 0,
        graficaEspositori: 0,
        premontaggioEspositori: 0,
        accessoriEspositori: 0,
        costoTotaleEspositori: 0
      };
    }

    // Calcolo elementi fisici espositori
    const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
    const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;

    // Calcolo costi struttura
    const layoutCost30 = layoutCostsEspositori.find(l => l.layoutEspositore === '30');
    const layoutCost50 = layoutCostsEspositori.find(l => l.layoutEspositore === '50');
    const layoutCost100 = layoutCostsEspositori.find(l => l.layoutEspositore === '100');

    const strutturaEspositori =
        qta30 * (layoutCost30?.costoUnitario || 0) +
        qta50 * (layoutCost50?.costoUnitario || 0) +
        qta100 * (layoutCost100?.costoUnitario || 0);

    // Calcolo costi grafiche
    const costoStampaParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Stampa Grafica');
    const graficaEspositori = costoStampaParam ? superficieStampaEspositori * (costoStampaParam.costo || 0) : 0;

    // Calcolo costi premontaggio
    const costoPremontaggio = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Premontaggio');
    const premontaggioEspositori = costoPremontaggio ? numeroPezziEspositori * (costoPremontaggio.costo || 0) : 0;

    // Calcolo costi accessori
    let accessoriEspositori = 0;
    if (accessoriesData && accessoriesData.length > 0) {
      const getAccessoryPrice = (name: string): number => {
        const accessory = accessoriesData.find(item => item.nome === name);
        return accessory ? Number(accessory.costoUnitario) : 0;
      };

      accessoriEspositori += (formData.ripiano30x30 || 0) * getAccessoryPrice('Ripiano 30x30');
      accessoriEspositori += (formData.ripiano50x50 || 0) * getAccessoryPrice('Ripiano 50x50');
      accessoriEspositori += (formData.ripiano100x50 || 0) * getAccessoryPrice('Ripiano 100x50');
      accessoriEspositori += (formData.tecaPlexiglass30x30x30 || 0) * getAccessoryPrice('Teca in plexiglass 30x30x30');
      accessoriEspositori += (formData.tecaPlexiglass50x50x50 || 0) * getAccessoryPrice('Teca in plexiglass 50x50x50');
      accessoriEspositori += (formData.tecaPlexiglass100x50x30 || 0) * getAccessoryPrice('Teca in plexiglass 100x50x30');
      accessoriEspositori += (formData.retroilluminazione30x30x100h || 0) * getAccessoryPrice('Retroilluminazione 30x30x100 H');
      accessoriEspositori += (formData.retroilluminazione50x50x100h || 0) * getAccessoryPrice('Retroilluminazione 50x50x100 H');
      accessoriEspositori += (formData.retroilluminazione100x50x100h || 0) * getAccessoryPrice('Retroilluminazione 100x50x100 H');
      accessoriEspositori += (formData.borsaEspositori || 0) * getAccessoryPrice('Borsa');
    }

    const costoTotaleEspositori = strutturaEspositori + graficaEspositori + premontaggioEspositori + accessoriEspositori;

    return {
      strutturaEspositori,
      graficaEspositori,
      premontaggioEspositori,
      accessoriEspositori,
      costoTotaleEspositori
    };
  }, [
    formData.qtaTipo30,
    formData.qtaTipo50,
    formData.qtaTipo100,
    formData.ripiano30x30,
    formData.ripiano50x50,
    formData.ripiano100x50,
    formData.tecaPlexiglass30x30x30,
    formData.tecaPlexiglass50x50x50,
    formData.tecaPlexiglass100x50x30,
    formData.retroilluminazione30x30x100h,
    formData.retroilluminazione50x50x100h,
    formData.retroilluminazione100x50x100h,
    formData.borsaEspositori,
    listinoServizi,
    layoutCostsEspositori,
    accessoriesData
  ]);

  // Calcolo automatico dei costi desk (sempre aggiornato)
  const calculatedDeskCosts = React.useMemo(() => {
    if (!accessoriDesk || !listinoStrutturaDesk || !listinoServizi.length) {
      return {
        strutturaTerra: 0,
        graficaCordino: 0,
        premontaggio: 0,
        accessori: 0,
        totale: 0
      };
    }

    const deskLayoutsArray = Array.isArray(formData.layoutDesk) ? formData.layoutDesk as LayoutDeskBean[] : (() => {
      try {
        return typeof (formData.layoutDesk as LayoutDeskBean) === 'string' ? JSON.parse(formData.layoutDesk as string) : [];
      } catch {
        return [];
      }
    })();

    // Costo struttura desk
    const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: LayoutDeskBean) => {
      const costoLayout = listinoStrutturaDesk?.find((c: ListinoStrutturaDeskBean) => c.layoutDesk === config.layout);
      return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
    }, 0);

    // Grafica desk
    const superficieStampaDesk = deskLayoutsArray.reduce((total, config: LayoutDeskBean) => {
      const {layout, quantity} = config;
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

    const costoStampaParam = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Stampa Grafica');
    const graficaCordinoDesk = costoStampaParam ? superficieStampaDesk * (costoStampaParam.costo || 0) : 0;

    // Premontaggio desk
    const numeroPezziDesk = deskLayoutsArray.reduce((total, config: LayoutDeskBean) => {
      const {layout, quantity} = config;
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

    const costoPremontaggio = (listinoServizi as ListinoServiziPrezzoUnitarioBean[]).find(p => p.parametro === 'Premontaggio');
    const premontaggioDesk = costoPremontaggio ? numeroPezziDesk * (costoPremontaggio.costo || 0) : 0;

    // Accessori desk
    const costiAccessoriDesk =
        (formData.portaScorrevole || 0) * (accessoriDesk.find(a => a.nome === 'Porta scorrevole con chiave')?.costoUnitario || 0) +
        (formData.ripianoSuperiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Superiore L 100')?.costoUnitario || 0) +
        (formData.ripianoInferiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Inferiore L 100')?.costoUnitario || 0) +
        (formData.tecaPlexiglass || 0) * (accessoriDesk.find(a => a.nome === 'Teca in plexiglass')?.costoUnitario || 0) +
        (formData.fronteLuminoso || 0) * (accessoriDesk.find(a => a.nome === 'Fronte luminoso dim. 100x100')?.costoUnitario || 0) +
        (formData.borsa || 0) * (accessoriDesk.find(a => a.nome === 'Borsa')?.costoUnitario || 0);

    const totaleDesk = strutturaTerraDesk + graficaCordinoDesk + premontaggioDesk + costiAccessoriDesk;

    return {
      strutturaTerra: strutturaTerraDesk,
      graficaCordino: graficaCordinoDesk,
      premontaggio: premontaggioDesk,
      accessori: costiAccessoriDesk,
      totale: totaleDesk
    };
  }, [
    formData.layoutDesk,
    formData.portaScorrevole,
    formData.ripianoSuperiore,
    formData.ripianoInferiore,
    formData.tecaPlexiglass,
    formData.fronteLuminoso,
    formData.borsa,
    listinoServizi,
    accessoriDesk,
    listinoStrutturaDesk
  ]);

  // Usa i costi calcolati o quelli lifted (dai componenti figli quando le sezioni sono aperte)
  const storageCosts = calculatedStorageCosts;
  const espositoriCosts = calculatedEspositoriCosts;
  const deskCosts = calculatedDeskCosts;

  // Calculate preventivo totals (costs + margins)
  const calculatePreventivoWithMargin = (cost: number, margin: number) => {
    return cost * (1 + margin / 100);
  };
  // Struttura totals
  const costoStruttura = standCosts.strutturaTerra + storageCosts.costoStrutturaStorage + (deskCosts.strutturaTerra || 0) + espositoriCosts.strutturaEspositori;
  const preventivoStruttura =
      calculatePreventivoWithMargin(standCosts.strutturaTerra, standMargins.marginalitaStruttura) +
      calculatePreventivoWithMargin(storageCosts.costoStrutturaStorage, storageMargins.marginalitaStrutturaStorage) +
      calculatePreventivoWithMargin(deskCosts.strutturaTerra, deskMargins.marginalitaStrutturaDesk) +
      calculatePreventivoWithMargin(espositoriCosts.strutturaEspositori, espositoriMargins.marginalitaStrutturaEspositori);

  // Grafiche totals
  const costoGrafiche = standCosts.graficaCordino + storageCosts.costoGraficaStorage + (deskCosts.graficaCordino || 0) + espositoriCosts.graficaEspositori;
  const preventivoGrafiche =
      calculatePreventivoWithMargin(standCosts.graficaCordino, standMargins.marginalitaGrafica) +
      calculatePreventivoWithMargin(storageCosts.costoGraficaStorage, storageMargins.marginalitaGraficaStorage) +
      calculatePreventivoWithMargin(deskCosts.graficaCordino, deskMargins.marginalitaGraficaDesk) +
      calculatePreventivoWithMargin(espositoriCosts.graficaEspositori, espositoriMargins.marginalitaGraficaEspositori);

  // Retroilluminazione (only for stands)
  const costoRetroilluminazione = standCosts.retroilluminazione;
  const preventivoRetroilluminazione = calculatePreventivoWithMargin(standCosts.retroilluminazione, standMargins.marginalitaRetroilluminazione);

  // Extra per struttura complessa (only for stands)
  const costoExtraComplessa = standCosts.extraStandComplesso;
  calculatePreventivoWithMargin(standCosts.extraStandComplesso, standMargins.marginalitaStruttura);
// Accessori totals
  const costoAccessori = standCosts.costiAccessori + (deskCosts.accessori ?? 0) + espositoriCosts.accessoriEspositori;
  const preventivoAccessori =
      calculatePreventivoWithMargin(standCosts.costiAccessori, standMargins.marginalitaAccessori) +
      calculatePreventivoWithMargin(deskCosts.accessori ?? 0, deskMargins.marginalitaAccessoriDesk) +
      calculatePreventivoWithMargin(espositoriCosts.accessoriEspositori, espositoriMargins.marginalitaAccessoriEspositori);

  // Premontaggi totals
  const costoPremontaggi = standCosts.premontaggio + storageCosts.costoPremontaggioStorage + (deskCosts.premontaggio ?? 0) + espositoriCosts.premontaggioEspositori;
  const preventivoPremontaggi =
      calculatePreventivoWithMargin(standCosts.premontaggio, standMargins.marginalitaPremontaggio) +
      calculatePreventivoWithMargin(storageCosts.costoPremontaggioStorage, storageMargins.marginalitaPremontaggioStorage) +
      calculatePreventivoWithMargin(deskCosts.premontaggio ?? 0, deskMargins.marginalitaPremontaggioDesk) +
      calculatePreventivoWithMargin(espositoriCosts.premontaggioEspositori, espositoriMargins.marginalitaPremontaggioEspositori);

  const costoMontaggio = formData.servizioMontaggioSmontaggio ? (preventivoServizi?.preventivoMontaggio || 0) + (preventivoServizi?.preventivoSmontaggio || 0) : 0;
  const costoCertificazioni = formData.servizioCertificazioni ? serviceCosts?.['Costo_certificazione'] || 0 : 0;
  const costoIstruzioni = formData.servizioIstruzioniAssistenza ? serviceCosts?.['Costo_istruzionieassistenza'] || 0 : 0;

  const servicesCost = formData.servizioMontaggioSmontaggio ? (preventivoServizi?.totaleCostoMontaggio || 0) + (preventivoServizi?.totaleCostoSmontaggio || 0) : 0;
  const servicesTotal = costoMontaggio + costoCertificazioni + costoIstruzioni;
  // Final totals

  const altriBeniServiziTotal = altriBeniServizi.reduce((sum, item) => sum + (item.totale || 0), 0);
  const altriBeniServiziCost = altriBeniServizi.reduce((sum, item) => sum + ((item.costoUnitario || 0) * (item.quantita || 0)), 0);

  const costoTotale = costoStruttura + costoGrafiche + costoRetroilluminazione + costoAccessori +
      costoPremontaggi + servicesCost + altriBeniServiziCost;

  const rows: { voce: string; costo: number; prezzo: number; scontoField: keyof PreventivoBean; noleggio: boolean }[] = [
    {voce: 'Struttura', costo: costoStruttura, prezzo: preventivoStruttura, scontoField: 'scontoStrutturaGlobale', noleggio: true},
    {voce: 'Grafica', costo: costoGrafiche, prezzo: preventivoGrafiche, scontoField: 'scontoGraficaGlobale', noleggio: false},
    {voce: 'Retroilluminazione', costo: costoRetroilluminazione, prezzo: preventivoRetroilluminazione, scontoField: 'scontoRetroilluminazioneGlobale', noleggio: false},
    {voce: 'Accessori', costo: costoAccessori, prezzo: preventivoAccessori, scontoField: 'scontoAccessoriGlobale', noleggio: false},
    {voce: 'Premontaggi', costo: costoPremontaggi, prezzo: preventivoPremontaggi, scontoField: 'scontoPremontaggiGlobale', noleggio: false},
    {voce: 'Servizi', costo: servicesCost, prezzo: servicesTotal, scontoField: 'scontoServiziGlobale', noleggio: false},
    {voce: 'Altri Beni/Servizi', costo: altriBeniServiziCost, prezzo: altriBeniServiziTotal, scontoField: 'scontoAltriBeniGlobale', noleggio: false},
  ];

  const totaleNetto = rows.reduce((sum, row) => {
    const scontoPerc = (formData[row.scontoField] as number) || 0;
    return sum + row.prezzo * (1 - scontoPerc / 100);
  }, 0);

  const marginalitaFinale = costoTotale === 0 ? 0 : (totaleNetto - costoTotale) / costoTotale * 100;

  React.useEffect(() => {
    if (!physicalElements) return;

    setFormData(prev => {
      const {
        superficieStampa,
        sviluppoLineare,
        numeroPezzi,
        superficieMq
      } = physicalElements;

      // Evita loop inutili
      if (
          prev.superficieStampa === superficieStampa &&
          prev.sviluppoLineare === sviluppoLineare &&
          prev.numeroPezzi === numeroPezzi &&
          prev.superficieMq === superficieMq
      ) {
        return prev;
      }

      return {
        ...prev,
        superficieStampa,
        sviluppoLineare,
        numeroPezzi,
        superficieMq
      };
    });

  }, [physicalElements, setFormData]);
  React.useEffect(() => {
    if (!formData) return;
    // Evita set inutili (importantissimo per non fare loop)
    if (formData.totalePreventivo !== totaleNetto) {
      setFormData(prev => ({
        ...prev,
        totalePreventivo: totaleNetto
      }));
    }
  }, [totaleNetto, setFormData]);

  return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5"/>
          <h3 className="text-lg font-semibold">Totale Preventivo Fornitura</h3>
        </div>

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
                {rows.map((row) => {
                  const scontoPerc = (formData[row.scontoField] as number) || 0;
                  const scontoEuro = row.prezzo * scontoPerc / 100;
                  const prezzoNetto = row.prezzo - scontoEuro;
                  const prezzoNoleggio = row.noleggio ? prezzoNetto * (formData.coefficienteNoleggio?.valore ?? 0) : null;
                  return (
                    <TableRow key={row.voce}>
                      <TableCell className="font-medium">{row.voce}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        €{row.costo.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        €{row.prezzo.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                              type="number" min="0" max="100" step="1"
                              value={scontoPerc}
                              onChange={(e) => setFormData({...formData, [row.scontoField]: parseFloat(e.target.value) || 0})}
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
                        {prezzoNoleggio !== null ? `€${prezzoNoleggio.toFixed(2)}` : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Totale preventivo</div>
                <div className="text-2xl font-bold text-primary">€{totaleNetto.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Totale costi</div>
                <div className="text-2xl font-bold">€{costoTotale.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Marginalità Media (%)</div>
                <div className="text-2xl font-bold text-green-600">
                  {costoTotale === 0 ? '0.0%' : marginalitaFinale.toFixed(1) + '%'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};
