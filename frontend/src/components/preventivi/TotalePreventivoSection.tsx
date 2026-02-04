import React, {useMemo} from 'react';
import {Calculator} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card.tsx';
import {useQuery} from "@tanstack/react-query";
import {ParametriAPI} from "@/api/parametri.ts";
import {CostiStrutturaDeskBean, ParametriBean, PreventivoServiziBean} from "@/types/parametri.ts";
import {LayoutDeskBean, PreventivoBean} from "@/types/preventivo.ts";
import {LayoutRouteProps} from "react-router-dom";

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
    queryKey: ['costi_struttura_espositori_layout'],
    queryFn: () => ParametriAPI.getCostiStrutturaEspositoriLayout({
      attivo: true, sortFields: [{
        field: "COSTI_STRUTTURA_ESPOSITORI_LAYOUT_ESPOSITORE",
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
    data: costiStrutturaDesk
  } = useQuery({
    queryKey: ["costi-struttura-desk-layout"],
    queryFn: () => ParametriAPI.getCostiStrutturaDesk({attivo: true})
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
    data: costiRetroilluminazione = []
  } = useQuery({
    queryKey: ['costi-retroilluminazione'],
    queryFn: () => ParametriAPI.getCostiRetroilluminazione({
      sortFields: [{
        field: "PARAMETRI_COSTI_RETROILLUMINAZIONE_ALTEZZA",
        desc: false
      }]
    })
  });

  const calculateCosts = () => {
    if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione || !parametri.length) {
      return {
        strutturaTerra: 0,
        graficaCordino: 0,
        premontaggio: 0,
        retroilluminazione: 0,
        extraStandComplesso: 0,
        costiAccessori: 0,
        // Preventivo values
        preventivoStruttura: 0,
        preventivoGrafica: 0,
        preventivoRetroilluminazione: 0,
        preventivoAccessori: 0,
        preventivoPremontaggio: 0,
        // Summary values
        totalePreventivoStand: 0,
        totaleCostiStand: 0,
        marginalitaMedia: 0,
        totale: 0
      };
    }
    const elements = physicalElements;

    // Trova i parametri necessari
    const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
    const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
    const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valoreChiave === String(formData.altezza));

    // Struttura a terra: sviluppo lineare * costo per m/l in base all'altezza
    const strutturaTerra = costoAltezzaParam ? elements.sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;

    // Grafica con cordino cucito: superficie di stampa * costo stampa grafica al mq
    const graficaCordino = costoStampaParam ? elements.superficieStampa * (costoStampaParam.valore || 0) : 0;

    // Premontaggio: numero pezzi * costo premontaggio al pezzo (solo se premontaggio è attivo)
    const premontaggio = costoPremontaggio && formData.premontaggio ? elements.numeroPezzi * (costoPremontaggio.valore || 0) : 0;

    // Retroilluminazione: metri retroilluminazione * costo per m/l in base all'altezza
    const costoRetroilluminazioneParam = costiRetroilluminazione.find(c => c.altezza === formData.altezza);
    const retroilluminazione = costoRetroilluminazioneParam ? formData.retroilluminazione * (costoRetroilluminazioneParam.costoAlMetro || 0) : 0;

    // Extra per struttura complessa: percentuale sui costi di struttura a terra
    const extraPercComplex = formData.extraPercComplex || 0;
    const extraStandComplesso = strutturaTerra * (extraPercComplex / 100);

    // Calcolo costi accessori
    let costiAccessori = 0;
    if (accessoriStand.length > 0) {
      const accessoriMap = parseAccessoriStand(formData.accessoriStandConfig);
      accessoriStand.forEach(accessorio => {
        const quantity = accessoriMap[accessorio.id] ?? 0;
        costiAccessori += quantity * accessorio.costoUnitario;
      });
    }

    // Calculate preventivos (quotes) based on costs and margins
    const preventivoStruttura = strutturaTerra * (1 + formData.marginalitaStruttura / 100);
    const preventivoGrafica = graficaCordino * (1 + formData.marginalitaGrafica / 100);
    const preventivoRetroilluminazione = retroilluminazione * (1 + formData.marginalitaRetroilluminazione / 100);
    const preventivoAccessori = costiAccessori * (1 + formData.marginalitaAccessori / 100);
    const preventivoPremontaggio = premontaggio * (1 + formData.marginalitaPremontaggio / 100);

    // Total preventivo and total costs for summary
    const totalePreventivoStand = preventivoStruttura + preventivoGrafica + preventivoRetroilluminazione + preventivoAccessori + preventivoPremontaggio + extraStandComplesso;
    const totaleCostiStand = strutturaTerra + graficaCordino + retroilluminazione + costiAccessori + premontaggio;
    const marginalitaMedia = totaleCostiStand > 0 ? (totalePreventivoStand - totaleCostiStand) / totaleCostiStand * 100 : 0;
    return {
      strutturaTerra,
      graficaCordino,
      premontaggio,
      retroilluminazione,
      extraStandComplesso,
      costiAccessori,
      // Preventivo values
      preventivoStruttura,
      preventivoGrafica,
      preventivoRetroilluminazione,
      preventivoAccessori,
      preventivoPremontaggio,
      // Summary values
      totalePreventivoStand,
      totaleCostiStand,
      marginalitaMedia,
    };
  };
  const standCosts = calculateCosts();
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
    if (!formData.larghezzaStorage || !formData.profonditaStorage || !formData.altezzaStorage || !parametri.length || !parametriCostiUnitari.length || !accessoriStand.length) {
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
    const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
    const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
    const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && Number(p.valoreChiave) === formData.altezzaStorage);

    // Trova il costo della porta
    const portaAccessorio = accessoriStand.find(acc => acc.nome?.toLowerCase().includes('porta'));
    const costoPorta = portaAccessorio ? portaAccessorio.costoUnitario : 0;
    const numeroPorte = parseInt(formData.numeroPorte || '0') || 0;

    // Calcolo costi
    const costoStrutturaBase = costoAltezzaParam ? sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;
    const costoPorte = numeroPorte * costoPorta;
    const costoStrutturaStorage = costoStrutturaBase + costoPorte;

    const costoGraficaStorage = costoStampaParam ? superficieStampa * (costoStampaParam.valore || 0) : 0;
    const costoPremontaggioStorage = costoPremontaggio ? numeroPezzi * (costoPremontaggio.valore || 0) : 0;
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
    parametriCostiUnitari,
    profiliDistribuzioneMap,
    accessoriStand
  ]);

  // Calcolo automatico dei costi espositori (sempre aggiornato)
  const calculatedEspositoriCosts = React.useMemo(() => {
    const qta30 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
    const qta50 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
    const qta100 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;

    if ((qta30 + qta50 + qta100) === 0 || !parametriCostiUnitari.length || !layoutCostsEspositori.length) {
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
    const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
    const graficaEspositori = costoStampaParam ? superficieStampaEspositori * (costoStampaParam.valore || 0) : 0;

    // Calcolo costi premontaggio
    const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
    const premontaggioEspositori = costoPremontaggio ? numeroPezziEspositori * (costoPremontaggio.valore || 0) : 0;

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
    parametriCostiUnitari,
    layoutCostsEspositori,
    accessoriesData
  ]);

  // Calcolo automatico dei costi desk (sempre aggiornato)
  const calculatedDeskCosts = React.useMemo(() => {
    if (!accessoriDesk || !costiStrutturaDesk || !parametriCostiUnitari.length) {
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
      const costoLayout = costiStrutturaDesk?.find((c: CostiStrutturaDeskBean) => c.layoutDesk === config.layout);
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

    const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
    const graficaCordinoDesk = costoStampaParam ? superficieStampaDesk * (costoStampaParam.valore || 0) : 0;

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

    const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
    const premontaggioDesk = costoPremontaggio ? numeroPezziDesk * (costoPremontaggio.valore || 0) : 0;

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
      struttura_terra: strutturaTerraDesk,
      grafica_cordino: graficaCordinoDesk,
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
    parametriCostiUnitari,
    accessoriDesk,
    costiStrutturaDesk
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
  const preventivoExtraComplessa = calculatePreventivoWithMargin(standCosts.extraStandComplesso, standMargins.marginalitaStruttura);

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

  const preventivoTotale = preventivoStruttura + preventivoGrafiche + preventivoRetroilluminazione +
      costoExtraComplessa + preventivoAccessori + preventivoPremontaggi +
      servicesTotal + altriBeniServiziTotal;

  // Marginalità media
  const marginalitaMedia = costoTotale > 0 ? ((preventivoTotale - costoTotale) / costoTotale) * 100 : 0;
  //
  // // Expose calculated values to parent component
  // React.useEffect(() => {
  //     if (onTotalsCalculated) {
  //         onTotalsCalculated({
  //             totalePreventivo: parseFloat(preventivoTotale.toFixed(2)),
  //             totaleCosti: parseFloat(costoTotale.toFixed(2))
  //         });
  //     }
  // }, [preventivoTotale, costoTotale, onTotalsCalculated]);

  return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5"/>
          <h3 className="text-lg font-semibold">Totale Preventivo Fornitura</h3>
        </div>

        {/* Grid with individual category cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Totale Struttura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{preventivoStruttura.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Totale grafiche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{preventivoGrafiche.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Retroilluminazione</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{preventivoRetroilluminazione.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Extra per struttura complessa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{costoExtraComplessa.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Totali accessori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{preventivoAccessori.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Totali Premontaggi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{preventivoPremontaggi.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Totali Servizi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{servicesTotal.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Totali Altri Beni/Servizi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{altriBeniServiziTotal.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Final totals card */}
        <Card className="border-2 border-primary">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-sm font-medium mb-2">Totale preventivo</div>
                <div className="text-3xl font-bold">€{preventivoTotale.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Totale costi</div>
                <div className="text-3xl font-bold">€{costoTotale.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Marginalità Media (%)</div>
                <div className="text-3xl font-bold">{marginalitaMedia.toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};
