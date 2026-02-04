import React, {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import {ChevronDown, FileText, Plus} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {StandSection} from "@/components/preventivi/StandSection.tsx";
import {StorageSection} from "@/components/preventivi/StorageSection.tsx";
import {DeskSection} from "@/components/preventivi/DeskSection.tsx";
import {TotalePreventivoSection} from "@/components/TotalePreventivoSection.tsx";
import {CondizioniFornituraSection} from "@/components/CondizioniFornituraSection.tsx";
import {useQuery} from "@tanstack/react-query";
import {ProspectsAPI} from "@/api/prospects.ts";
import {PreventivoBean} from "@/types/preventivo.ts";
import {PreventivoAnagrafica} from "@/components/preventivi/PreventivoAnagrafica.tsx";

interface PreventivoModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
  isEditing: boolean;
}

export function PreventivoModal({
                                  open,
                                  onOpenChange,
                                  formData,
                                  setFormData,
                                  isEditing,
                                }: PreventivoModalProps) {
  // State per controllare le sezioni collassabili
  const [sectionsOpen, setSectionsOpen] = useState({
    stand: false,
    storage: false,
    desk: false,
    espositori: false,
    servizi: false,
    altri_beni_servizi: false,
    condizioni_fornitura: false
  });


  // Function to update margins based on prospect type
  // const updateMarginsBasedOnProspect = (prospectId: string) => {
  //     const selectedProspect = prospects.find((p: any) => p.id === prospectId);
  //     if (selectedProspect && marginalitaProspect.length > 0) {
  //         const defaultMargin = marginalitaProspect.find((m: any) => m.tipoProspect === selectedProspect.tipoProspect);
  //         if (defaultMargin) {
  //             setFormData(prev => ({
  //                 ...prev,
  //                 prospectId: prospectId,
  //                 marginalitaStruttura: defaultMargin.marginalita,
  //                 marginalitaGrafica: defaultMargin.marginalita,
  //                 marginalitaRetroilluminazione: defaultMargin.marginalita,
  //                 marginalitaAccessori: defaultMargin.marginalita,
  //                 marginalitaPremontaggio: defaultMargin.marginalita,
  //                 // Storage margins
  //                 marginalitaStrutturaStorage: defaultMargin.marginalita,
  //                 marginalitaGraficaStorage: defaultMargin.marginalita,
  //                 marginalitaPremontaggioStorage: defaultMargin.marginalita,
  //                 // Desk margins
  //                 marginalitaStrutturaDesk: defaultMargin.marginalita,
  //                 marginalitaGraficaDesk: defaultMargin.marginalita,
  //                 marginalitaPremontaggioDesk: defaultMargin.marginalita,
  //                 marginalitaAccessoriDesk: defaultMargin.marginalita,
  //                 // Espositori margins
  //                 marginalitaStrutturaEspositori: defaultMargin.marginalita,
  //                 marginalitaGraficaEspositori: defaultMargin.marginalita,
  //                 marginalitaPremontaggioEspositori: defaultMargin.marginalita,
  //                 marginalitaAccessoriEspositori: defaultMargin.marginalita
  //             }));
  //             return;
  //         }
  //     }
  //     // Fallback if no default found
  //     setFormData(prev => ({
  //         ...prev,
  //         prospectId: prospectId
  //     }));
  // };
  //
  //
  //
  // // Calcolo automatico dei costi storage (sempre aggiornato)
  // const calculatedStorageCosts = React.useMemo(() => {
  //     if (!formData.larghezzaStorage || !formData.profonditaStorage || !formData.altezzaStorage || !parametri.length || !parametriCostiUnitari.length || !accessoriStand.length) {
  //         return {
  //             costoStrutturaStorage: 0,
  //             costoGraficaStorage: 0,
  //             costoPremontaggioStorage: 0,
  //             costoTotaleStorage: 0
  //         };
  //     }
  //
  //     const larg = parseFloat(formData.larghezzaStorage);
  //     const prof = parseFloat(formData.profonditaStorage);
  //     const alt = parseFloat(formData.altezzaStorage);
  //     const layout = formData.layoutStorage;
  //     const distribuzione = parseInt(formData.distribuzione || '0');
  //
  //     // Calcolo superficie di stampa storage
  //     let superficie_stampa = 0;
  //     switch (layout) {
  //         case '0':
  //             superficie_stampa = (2 * larg + 2 * prof) * alt;
  //             break;
  //         case '1':
  //             superficie_stampa = (2 * larg + 2 * prof) * alt + 2;
  //             break;
  //         case '2':
  //             superficie_stampa = (larg + prof) * alt + 2;
  //             break;
  //     }
  //
  //     // Calcolo sviluppo lineare storage
  //     let sviluppo_lineare = 0;
  //     switch (layout) {
  //         case '0':
  //             sviluppo_lineare = larg + prof;
  //             break;
  //         case '1':
  //             sviluppo_lineare = 2 * larg + 2 * prof;
  //             break;
  //         case '2':
  //             sviluppo_lineare = larg + prof + 1;
  //             break;
  //     }
  //
  //     // Calcolo numero pezzi storage
  //     const fattoreDistribuzione = profiliDistribuzioneMap[distribuzione] || 0;
  //     const numeroPezzi = sviluppo_lineare * fattoreDistribuzione;
  //
  //     // Parametri necessari
  //     const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
  //     const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
  //     const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === formData.altezzaStorage);
  //
  //     // Trova il costo della porta
  //     const portaAccessorio = accessoriStand.find(acc => acc.nome?.toLowerCase().includes('porta'));
  //     const costoPorta = portaAccessorio ? portaAccessorio.costoUnitario : 0;
  //     const numeroPorte = parseInt(formData.numeroPorte || '0') || 0;
  //
  //     // Calcolo costi
  //     const costoStrutturaBase = costoAltezzaParam ? sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;
  //     const costoPorte = numeroPorte * costoPorta;
  //     const costoStrutturaStorage = costoStrutturaBase + costoPorte;
  //
  //     const costoGraficaStorage = costoStampaParam ? superficie_stampa * (costoStampaParam.valore || 0) : 0;
  //     const costoPremontaggioStorage = costoPremontaggio ? numeroPezzi * (costoPremontaggio.valore || 0) : 0;
  //     const costoTotaleStorage = costoStrutturaStorage + costoGraficaStorage + costoPremontaggioStorage;
  //
  //     return {
  //         costoStrutturaStorage,
  //         costoGraficaStorage,
  //         costoPremontaggioStorage,
  //         costoTotaleStorage
  //     };
  // }, [
  //     formData.larghezzaStorage,
  //     formData.profonditaStorage,
  //     formData.altezzaStorage,
  //     formData.layoutStorage,
  //     formData.numeroPorte,
  //     formData.distribuzione,
  //     parametri,
  //     parametriCostiUnitari,
  //     profiliDistribuzioneMap,
  //     accessoriStand
  // ]);
  //
  // // Calcolo automatico dei costi espositori (sempre aggiornato)
  // const calculatedEspositoriCosts = React.useMemo(() => {
  //     const qta30 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
  //     const qta50 = parseInt(formData.qtaTipo50?.toString() || '0') || 0;
  //     const qta100 = parseInt(formData.qtaTipo100?.toString() || '0') || 0;
  //
  //     if ((qta30 + qta50 + qta100) === 0 || !parametriCostiUnitari.length || !layoutCostsEspositori.length) {
  //         return {
  //             strutturaEspositori: 0,
  //             graficaEspositori: 0,
  //             premontaggioEspositori: 0,
  //             accessoriEspositori: 0,
  //             costoTotaleEspositori: 0
  //         };
  //     }
  //
  //     // Calcolo elementi fisici espositori
  //     const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
  //     const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;
  //
  //     // Calcolo costi struttura
  //     const layoutCost30 = layoutCostsEspositori.find(l => l.layoutEspositore === '30');
  //     const layoutCost50 = layoutCostsEspositori.find(l => l.layoutEspositore === '50');
  //     const layoutCost100 = layoutCostsEspositori.find(l => l.layoutEspositore === '100');
  //
  //     const strutturaEspositori =
  //         qta30 * (layoutCost30?.costoUnitario || 0) +
  //         qta50 * (layoutCost50?.costoUnitario || 0) +
  //         qta100 * (layoutCost100?.costoUnitario || 0);
  //
  //     // Calcolo costi grafiche
  //     const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
  //     const graficaEspositori = costoStampaParam ? superficieStampaEspositori * (costoStampaParam.valore || 0) : 0;
  //
  //     // Calcolo costi premontaggio
  //     const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
  //     const premontaggioEspositori = costoPremontaggio ? numeroPezziEspositori * (costoPremontaggio.valore || 0) : 0;
  //
  //     // Calcolo costi accessori
  //     let accessoriEspositori = 0;
  //     if (accessoriEspositori && accessoriEspositoriDB.length > 0) {
  //         const getAccessoryPrice = (name: string): number => {
  //             const accessory = accessoriEspositoriDB.find(item => item.nome === name);
  //             return accessory ? Number(accessory.costoUnitario) : 0;
  //         };
  //
  //         accessoriEspositori += (formData.ripiano30x30 || 0) * getAccessoryPrice('Ripiano 30x30');
  //         accessoriEspositori += (formData.ripiano50x50 || 0) * getAccessoryPrice('Ripiano 50x50');
  //         accessoriEspositori += (formData.ripiano100x50 || 0) * getAccessoryPrice('Ripiano 100x50');
  //         accessoriEspositori += (formData.tecaPlexiglass30x30x30 || 0) * getAccessoryPrice('Teca in plexiglass 30x30x30');
  //         accessoriEspositori += (formData.tecaPlexiglass50x50x50 || 0) * getAccessoryPrice('Teca in plexiglass 50x50x50');
  //         accessoriEspositori += (formData.tecaPlexiglass100x50x30 || 0) * getAccessoryPrice('Teca in plexiglass 100x50x30');
  //         accessoriEspositori += (formData.retroilluminazione30x30x100h || 0) * getAccessoryPrice('Retroilluminazione 30x30x100 H');
  //         accessoriEspositori += (formData.retroilluminazione50x50x100h || 0) * getAccessoryPrice('Retroilluminazione 50x50x100 H');
  //         accessoriEspositori += (formData.retroilluminazione100x50x100h || 0) * getAccessoryPrice('Retroilluminazione 100x50x100 H');
  //         accessoriEspositori += (formData.borsaEspositori || 0) * getAccessoryPrice('Borsa');
  //     }
  //
  //     const costoTotaleEspositori = strutturaEspositori + graficaEspositori + premontaggioEspositori + accessoriEspositori;
  //
  //     return {
  //         strutturaEspositori,
  //         graficaEspositori,
  //         premontaggioEspositori,
  //         accessoriEspositori,
  //         costoTotaleEspositori
  //     };
  // }, [
  //     formData.qtaTipo30,
  //     formData.qtaTipo50,
  //     formData.qtaTipo100,
  //     formData.ripiano30x30,
  //     formData.ripiano50x50,
  //     formData.ripiano100x50,
  //     formData.tecaPlexiglass30x30x30,
  //     formData.tecaPlexiglass50x50x50,
  //     formData.tecaPlexiglass100x50x30,
  //     formData.retroilluminazione30x30x100h,
  //     formData.retroilluminazione50x50x100h,
  //     formData.retroilluminazione100x50x100h,
  //     formData.borsaEspositori,
  //     parametriCostiUnitari,
  //     layoutCostsEspositori,
  //     accessoriEspositoriDB
  // ]);
  //
  // // Calcolo automatico dei costi desk (sempre aggiornato)
  // const calculatedDeskCosts = React.useMemo(() => {
  //     if (!accessoriDesk || !costiStrutturaDesk || !parametriCostiUnitari.length) {
  //         return {
  //             strutturaTerra: 0,
  //             graficaCordino: 0,
  //             premontaggio: 0,
  //             accessori: 0,
  //             totale: 0
  //         };
  //     }
  //
  //     const deskLayoutsArray = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
  //         try {
  //             return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
  //         } catch {
  //             return [];
  //         }
  //     })();
  //
  //     // Costo struttura desk
  //     const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: any) => {
  //         const costoLayout = costiStrutturaDesk?.find((c: any) => c.layoutDesk === config.layout);
  //         return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
  //     }, 0);
  //
  //     // Grafica desk
  //     const superficie_stampa_desk = deskLayoutsArray.reduce((total, config: any) => {
  //         const {layout, quantity} = config;
  //         if (!layout || !quantity) return total;
  //         switch (layout) {
  //             case "50":
  //                 return total + 1.5 * quantity;
  //             case "100":
  //                 return total + 2 * quantity;
  //             case "150":
  //                 return total + 2.5 * quantity;
  //             case "200":
  //                 return total + 3 * quantity;
  //             default:
  //                 return total;
  //         }
  //     }, 0);
  //
  //     const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
  //     const graficaCordinoDesk = costoStampaParam ? superficie_stampa_desk * (costoStampaParam.valore || 0) : 0;
  //
  //     // Premontaggio desk
  //     const numeroPezzi_desk = deskLayoutsArray.reduce((total, config: any) => {
  //         const {layout, quantity} = config;
  //         if (!layout || !quantity) return total;
  //         switch (layout) {
  //             case "50":
  //             case "100":
  //             case "150":
  //                 return total + 12 * quantity;
  //             case "200":
  //                 return total + 20 * quantity;
  //             default:
  //                 return total;
  //         }
  //     }, 0);
  //
  //     const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
  //     const premontaggioDesk = costoPremontaggio ? numeroPezzi_desk * (costoPremontaggio.valore || 0) : 0;
  //
  //     // Accessori desk
  //     const costiAccessoriDesk =
  //         (formData.portaScorrevole || 0) * (accessoriDesk.find(a => a.nome === 'Porta scorrevole con chiave')?.costoUnitario || 0) +
  //         (formData.ripianoSuperiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Superiore L 100')?.costoUnitario || 0) +
  //         (formData.ripianoInferiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Inferiore L 100')?.costoUnitario || 0) +
  //         (formData.tecaPlexiglass || 0) * (accessoriDesk.find(a => a.nome === 'Teca in plexiglass')?.costoUnitario || 0) +
  //         (formData.fronteLuminoso || 0) * (accessoriDesk.find(a => a.nome === 'Fronte luminoso dim. 100x100')?.costoUnitario || 0) +
  //         (formData.borsa || 0) * (accessoriDesk.find(a => a.nome === 'Borsa')?.costoUnitario || 0);
  //
  //     const totale_desk = strutturaTerraDesk + graficaCordinoDesk + premontaggioDesk + costiAccessoriDesk;
  //
  //     return {
  //         strutturaTerra: strutturaTerraDesk,
  //         graficaCordino: graficaCordinoDesk,
  //         premontaggio: premontaggioDesk,
  //         accessori: costiAccessoriDesk,
  //         totale: totale_desk
  //     };
  // }, [
  //     formData.deskLayouts,
  //     formData.portaScorrevole,
  //     formData.ripianoSuperiore,
  //     formData.ripianoInferiore,
  //     formData.tecaPlexiglass,
  //     formData.fronteLuminoso,
  //     formData.borsa,
  //     parametriCostiUnitari,
  //     accessoriDesk,
  //     costiStrutturaDesk
  // ]);
  //
  // // Usa i costi calcolati o quelli lifted (dai componenti figli quando le sezioni sono aperte)
  // const finalStorageCosts = storageCostsLifted.costoTotaleStorage > 0 ? storageCostsLifted : calculatedStorageCosts;
  // const finalEspositoriCosts = expositoreCostsLifted.costoTotaleEspositori > 0 ? expositoreCostsLifted : calculatedEspositoriCosts;
  // const finalDeskCosts = deskCostsLifted.totale > 0 ? deskCostsLifted : calculatedDeskCosts;
  //
  // // Calcolo dei costi automatici
  // const calculateCosts = () => {
  //     if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione || !parametri.length) {
  //         return {
  //             strutturaTerra: 0,
  //             graficaCordino: 0,
  //             premontaggio: 0,
  //             retroilluminazione: 0,
  //             extraStandComplesso: 0,
  //             costiAccessori: 0,
  //             // Preventivo values
  //             preventivoStruttura: 0,
  //             preventivoGrafica: 0,
  //             preventivoRetroilluminazione: 0,
  //             preventivoAccessori: 0,
  //             preventivoPremontaggio: 0,
  //             // Summary values
  //             totalePreventivoStand: 0,
  //             totaleCostiStand: 0,
  //             marginalitaMedia: 0,
  //             totale: 0
  //         };
  //     }
  //     const elements = physicalElements;
  //
  //     // Trova i parametri necessari
  //     const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
  //     const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
  //     const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valoreChiave === formData.altezza);
  //
  //     // Struttura a terra: sviluppo lineare * costo per m/l in base all'altezza
  //     const strutturaTerra = costoAltezzaParam ? elements.sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;
  //
  //     // Grafica con cordino cucito: superficie di stampa * costo stampa grafica al mq
  //     const graficaCordino = costoStampaParam ? elements.superficieStampa * (costoStampaParam.valore || 0) : 0;
  //
  //     // Premontaggio: numero pezzi * costo premontaggio al pezzo (solo se premontaggio è attivo)
  //     const premontaggio = costoPremontaggio && formData.premontaggio ? elements.numeroPezzi * (costoPremontaggio.valore || 0) : 0;
  //
  //     // Retroilluminazione: metri retroilluminazione * costo per m/l in base all'altezza
  //     const costoRetroilluminazioneParam = costiRetroilluminazione.find(c => c.altezza === parseFloat(formData.altezza));
  //     const retroilluminazione = costoRetroilluminazioneParam ? parseFloat(formData.retroilluminazione || '0') * (costoRetroilluminazioneParam.costoAlMetro || 0) : 0;
  //
  //     // Extra per struttura complessa: percentuale sui costi di struttura a terra
  //     const extraPercComplex = formData.extraPercComplex || 0;
  //     const extraStandComplesso = strutturaTerra * (extraPercComplex / 100);
  //
  //     // Calcolo costi accessori
  //     let costiAccessori = 0;
  //     if (formData.accessoriStand && accessoriStand.length > 0) {
  //         accessoriStand.forEach(accessorio => {
  //             const quantity = formData.accessoriStand[accessorio.id] || 0;
  //             costiAccessori += quantity * accessorio.costoUnitario;
  //         });
  //     }
  //
  //     // Calcolo costi accessori desk
  //     let costiAccessoriDesk = 0;
  //     if (accessoriDesk && accessoriDesk.length > 0) {
  //         // Calcolo basato sui campi individuali del formData
  //         costiAccessoriDesk += (formData.portaScorrevole || 0) * (accessoriDesk.find(a => a.nome === 'Porta scorrevole con chiave')?.costoUnitario || 0);
  //         costiAccessoriDesk += (formData.ripianoSuperiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Superiore L 100')?.costoUnitario || 0);
  //         costiAccessoriDesk += (formData.ripianoInferiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Inferiore L 100')?.costoUnitario || 0);
  //         costiAccessoriDesk += (formData.tecaPlexiglass || 0) * (accessoriDesk.find(a => a.nome === 'Teca in plexiglass')?.costoUnitario || 0);
  //         costiAccessoriDesk += (formData.fronteLuminoso || 0) * (accessoriDesk.find(a => a.nome === 'Fronte luminoso dim. 100x100')?.costoUnitario || 0);
  //         costiAccessoriDesk += (formData.borsa || 0) * (accessoriDesk.find(a => a.nome === 'Borsa')?.costoUnitario || 0);
  //     }
  //
  //     // Calcolo costi desk
  //     const costoStampaDeskParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
  //     const costoPremontaggerDesk = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
  //
  //     // Costo struttura desk
  //     const deskLayoutsArray = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
  //         try {
  //             return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
  //         } catch {
  //             return [];
  //         }
  //     })();
  //     const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: any) => {
  //         const costoLayout = costiStrutturaDesk?.find((c: any) => c.layoutDesk === config.layout);
  //         return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
  //     }, 0);
  //
  //     // Grafica desk con cordino cucito
  //     const superficie_stampa_desk = calculateSuperficieStampaDesk();
  //     const graficaCordinoDesk = costoStampaDeskParam ? superficie_stampa_desk * (costoStampaDeskParam.valore || 0) : 0;
  //
  //     // Premontaggio desk
  //     const numeroPezzi_desk = calculateNumeroPezziDesk();
  //     const premontaggioDesk = costoPremontaggerDesk ? numeroPezzi_desk * (costoPremontaggerDesk.valore || 0) : 0;
  //     const totale_desk = strutturaTerraDesk + graficaCordinoDesk + premontaggioDesk + costiAccessoriDesk;
  //     const totale = strutturaTerra + graficaCordino + premontaggio + retroilluminazione + costiAccessori + extraStandComplesso;
  //
  //     // Calculate preventivos (quotes) based on costs and margins
  //     const preventivoStruttura = strutturaTerra * (1 + formData.marginalitaStruttura / 100);
  //     const preventivoGrafica = graficaCordino * (1 + formData.marginalitaGrafica / 100);
  //     const preventivoRetroilluminazione = retroilluminazione * (1 + formData.marginalitaRetroilluminazione / 100);
  //     const preventivoAccessori = costiAccessori * (1 + formData.marginalitaAccessori / 100);
  //     const preventivoPremontaggio = premontaggio * (1 + formData.marginalitaPremontaggio / 100);
  //
  //     // Total preventivo and total costs for summary
  //     const totalePreventivoStand = preventivoStruttura + preventivoGrafica + preventivoRetroilluminazione + preventivoAccessori + preventivoPremontaggio + extraStandComplesso;
  //     const totaleCostiStand = strutturaTerra + graficaCordino + retroilluminazione + costiAccessori + premontaggio;
  //     const marginalitaMedia = totaleCostiStand > 0 ? (totalePreventivoStand - totaleCostiStand) / totaleCostiStand * 100 : 0;
  //     return {
  //         strutturaTerra,
  //         graficaCordino,
  //         premontaggio,
  //         retroilluminazione,
  //         extraStandComplesso,
  //         costiAccessori,
  //         // Preventivo values
  //         preventivoStruttura,
  //         preventivoGrafica,
  //         preventivoRetroilluminazione,
  //         preventivoAccessori,
  //         preventivoPremontaggio,
  //         // Summary values
  //         totalePreventivoStand,
  //         totaleCostiStand,
  //         marginalitaMedia,
  //         costiAccessoriDesk,
  //         costiDesk: {
  //             strutturaTerra: strutturaTerraDesk,
  //             graficaCordino: graficaCordinoDesk,
  //             premontaggio: premontaggioDesk,
  //             accessori: costiAccessoriDesk,
  //             totale: totale_desk
  //         },
  //         totale
  //     };
  // };
  //
  // // Funzioni helper per calcolo desk
  // const calculateSuperficieStampaDesk = () => {
  //     const arr = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
  //         try {
  //             return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
  //         } catch {
  //             return [];
  //         }
  //     })();
  //     if (!arr.length) return 0;
  //     return arr.reduce((total, config: any) => {
  //         const {
  //             layout,
  //             quantity
  //         } = config;
  //         if (!layout || !quantity) return total;
  //         switch (layout) {
  //             case "50":
  //                 return total + 1.5 * quantity;
  //             case "100":
  //                 return total + 2 * quantity;
  //             case "150":
  //                 return total + 2.5 * quantity;
  //             case "200":
  //                 return total + 3 * quantity;
  //             default:
  //                 return total;
  //         }
  //     }, 0);
  // };
  // const calculateNumeroPezziDesk = () => {
  //     const arr = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
  //         try {
  //             return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
  //         } catch {
  //             return [];
  //         }
  //     })();
  //     if (!arr.length) return 0;
  //     return arr.reduce((total, config: any) => {
  //         const {
  //             layout,
  //             quantity
  //         } = config;
  //         if (!layout || !quantity) return total;
  //         switch (layout) {
  //             case "50":
  //             case "100":
  //             case "150":
  //                 return total + 12 * quantity;
  //             case "200":
  //                 return total + 20 * quantity;
  //             default:
  //                 return total;
  //         }
  //     }, 0);
  // };
  //
  // // Calcola gli elementi fisici per gli espositori
  // const calculateExpositorePhysicalElements = () => {
  //     const qta30 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
  //     const qta50 = parseInt(formData.qtaTipo50?.toString() || '0') || 0;
  //     const qta100 = parseInt(formData.qtaTipo100?.toString() || '0') || 0;
  //     const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
  //     const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;
  //     return {
  //         numeroPezziEspositori,
  //         superficieStampaEspositori
  //     };
  // };
  // const espositorePhysicalElements = calculateExpositorePhysicalElements();
  // const costs = calculateCosts();

  // Effect per ricalcolare i costi quando si apre un preventivo esistente
  // React.useEffect(() => {
  //     if (!editingPreventivo || !parametriCostiUnitari.length || !accessoriEspositoriDB.length) return;
  //
  //     // Calcola costi Storage
  //     const calculateStorageCostsOnLoad = () => {
  //         const larg = parseFloat(formData.larghezzaStorage) || 0;
  //         const prof = parseFloat(formData.profonditaStorage) || 0;
  //         const alt = parseFloat(formData.altezzaStorage) || 2.5;
  //         const layout = formData.layoutStorage || '0';
  //         const distribuzione = parseInt(formData.distribuzione) || 0;
  //
  //         if (!larg || !prof || !distribuzione) {
  //             return {
  //                 costoStrutturaStorage: 0,
  //                 costoGraficaStorage: 0,
  //                 costoPremontaggioStorage: 0,
  //                 costoTotaleStorage: 0
  //             };
  //         }
  //
  //         // Calcolo superficie di stampa
  //         let superficie_stampa = 0;
  //         if (layout === "0") {
  //             superficie_stampa = (2 * larg + 2 * prof) * alt;
  //         } else if (layout === "1") {
  //             superficie_stampa = (2 * larg + 2 * prof) * alt + 2;
  //         } else if (layout === "2") {
  //             superficie_stampa = (larg + prof) * alt + 2;
  //         }
  //
  //         // Calcolo sviluppo lineare
  //         let sviluppo_lineare = 0;
  //         if (layout === "0") {
  //             sviluppo_lineare = larg + prof;
  //         } else if (layout === "1") {
  //             sviluppo_lineare = 2 * larg + 2 * prof;
  //         } else if (layout === "2") {
  //             sviluppo_lineare = larg + prof + 1;
  //         }
  //
  //         const numeroPezzi = sviluppo_lineare * distribuzione;
  //
  //         // Trova i parametri di costo
  //         const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
  //         const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
  //         const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valore_chiave === alt.toString());
  //
  //         const costoStrutturaStorage = costoAltezzaParam ? sviluppo_lineare * (costoAltezzaParam.valore || 0) : 0;
  //         const costoGraficaStorage = costoStampaParam ? superficie_stampa * (costoStampaParam.valore || 0) : 0;
  //         const costoPremontaggioStorage = costoPremontaggio ? numeroPezzi * (costoPremontaggio.valore || 0) : 0;
  //         const costoTotaleStorage = costoStrutturaStorage + costoGraficaStorage + costoPremontaggioStorage;
  //
  //         return {
  //             costoStrutturaStorage,
  //             costoGraficaStorage,
  //             costoPremontaggioStorage,
  //             costoTotaleStorage
  //         };
  //     };
  //
  //     // Calcola costi Espositori
  //     const calculateEspositoriCostsOnLoad = () => {
  //         const qta30 = parseInt(formData.qtaTipo30?.toString() || '0') || 0;
  //         const qta50 = parseInt(formData.qtaTipo50?.toString() || '0') || 0;
  //         const qta100 = parseInt(formData.qtaTipo100?.toString() || '0') || 0;
  //
  //         if (!qta30 && !qta50 && !qta100) {
  //             return {
  //                 strutturaEspositori: 0,
  //                 graficaEspositori: 0,
  //                 premontaggioEspositori: 0,
  //                 accessoriEspositori: 0,
  //                 costoTotaleEspositori: 0
  //             };
  //         }
  //
  //         // Calcolo elementi fisici
  //         const numeroPezziEspositori = qta30 * 12 + qta50 * 12 + qta100 * 12;
  //         const superficieStampaEspositori = qta30 * 1.2 + qta50 * 2 + qta100 * 3;
  //
  //         // Trova parametri di costo per struttura
  //         const costoStruttura30 = layoutCostsEspositori?.find(c => c.layoutEspositore === '30x30x100h');
  //         const costoStruttura50 = layoutCostsEspositori?.find(c => c.layoutEspositore === '50x50x100h');
  //         const costoStruttura100 = layoutCostsEspositori?.find(c => c.layoutEspositore === '100x50x100h');
  //
  //         const strutturaEspositori = (qta30 * (costoStruttura30?.costoUnitario || 0)) +
  //             (qta50 * (costoStruttura50?.costoUnitario || 0)) +
  //             (qta100 * (costoStruttura100?.costoUnitario || 0));
  //
  //         const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
  //         const graficaEspositori = costoStampaParam ? superficieStampaEspositori * (costoStampaParam.valore || 0) : 0;
  //
  //         const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
  //         const premontaggioEspositori = costoPremontaggio ? numeroPezziEspositori * (costoPremontaggio.valore || 0) : 0;
  //
  //         // Calcolo accessori espositori
  //         const accessoriEspositori =
  //             (parseInt(formData.ripiano30x30?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Ripiano 30x30')?.costoUnitario || 0)) +
  //             (parseInt(formData.ripiano50x50?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Ripiano 50x50')?.costoUnitario || 0)) +
  //             (parseInt(formData.ripiano100x50?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Ripiano 100x50')?.costoUnitario || 0)) +
  //             (parseInt(formData.tecaPlexiglass30x30x30?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Teca plexiglass 30x30x30')?.costoUnitario || 0)) +
  //             (parseInt(formData.tecaPlexiglass50x50x50?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Teca plexiglass 50x50x50')?.costoUnitario || 0)) +
  //             (parseInt(formData.tecaPlexiglass100x50x30?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Teca plexiglass 100x50x30')?.costoUnitario || 0)) +
  //             (parseInt(formData.retroilluminazione30x30x100h?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Retroilluminazione 30x30x100h')?.costoUnitario || 0)) +
  //             (parseInt(formData.retroilluminazione50x50x100h?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Retroilluminazione 50x50x100h')?.costoUnitario || 0)) +
  //             (parseInt(formData.retroilluminazione100x50x100h?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Retroilluminazione 100x50x100h')?.costoUnitario || 0)) +
  //             (parseInt(formData.borsaEspositori?.toString() || '0') * (accessoriEspositoriDB.find(a => a.nome === 'Borsa')?.costoUnitario || 0));
  //
  //         const costoTotaleEspositori = strutturaEspositori + graficaEspositori + premontaggioEspositori + accessoriEspositori;
  //
  //         return {
  //             strutturaEspositori,
  //             graficaEspositori,
  //             premontaggioEspositori,
  //             accessoriEspositori,
  //             costoTotaleEspositori
  //         };
  //     };
  //
  //     // Calcola costi Desk
  //     const calculateDeskCostsOnLoad = () => {
  //         if (!accessoriDesk || !costiStrutturaDesk) {
  //             return {
  //                 strutturaTerra: 0,
  //                 graficaCordino: 0,
  //                 premontaggio: 0,
  //                 accessori: 0,
  //                 totale: 0
  //             };
  //         }
  //
  //         const deskLayoutsArray = Array.isArray(formData.deskLayouts) ? formData.deskLayouts as any[] : (() => {
  //             try {
  //                 return typeof (formData.deskLayouts as any) === 'string' ? JSON.parse(formData.deskLayouts as any) : [];
  //             } catch {
  //                 return [];
  //             }
  //         })();
  //
  //         // Costo struttura desk
  //         const strutturaTerraDesk = deskLayoutsArray.reduce((total, config: any) => {
  //             const costoLayout = costiStrutturaDesk?.find((c: any) => c.layoutDesk === config.layout);
  //             return total + (Number(config.quantity) || 0) * (Number(costoLayout?.costoUnitario) || 0);
  //         }, 0);
  //
  //         // Grafica desk
  //         const superficie_stampa_desk = deskLayoutsArray.reduce((total, config: any) => {
  //             const {layout, quantity} = config;
  //             if (!layout || !quantity) return total;
  //             switch (layout) {
  //                 case "50":
  //                     return total + 1.5 * quantity;
  //                 case "100":
  //                     return total + 2 * quantity;
  //                 case "150":
  //                     return total + 2.5 * quantity;
  //                 case "200":
  //                     return total + 3 * quantity;
  //                 default:
  //                     return total;
  //             }
  //         }, 0);
  //
  //         const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
  //         const graficaCordinoDesk = costoStampaParam ? superficie_stampa_desk * (costoStampaParam.valore || 0) : 0;
  //
  //         // Premontaggio desk
  //         const numeroPezzi_desk = deskLayoutsArray.reduce((total, config: any) => {
  //             const {layout, quantity} = config;
  //             if (!layout || !quantity) return total;
  //             switch (layout) {
  //                 case "50":
  //                 case "100":
  //                 case "150":
  //                     return total + 12 * quantity;
  //                 case "200":
  //                     return total + 20 * quantity;
  //                 default:
  //                     return total;
  //             }
  //         }, 0);
  //
  //         const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
  //         const premontaggioDesk = costoPremontaggio ? numeroPezzi_desk * (costoPremontaggio.valore || 0) : 0;
  //
  //         // Accessori desk
  //         const costiAccessoriDesk =
  //             (formData.portaScorrevole || 0) * (accessoriDesk.find(a => a.nome === 'Porta scorrevole con chiave')?.costoUnitario || 0) +
  //             (formData.ripianoSuperiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Superiore L 100')?.costoUnitario || 0) +
  //             (formData.ripianoInferiore || 0) * (accessoriDesk.find(a => a.nome === 'Ripiano Inferiore L 100')?.costoUnitario || 0) +
  //             (formData.tecaPlexiglass || 0) * (accessoriDesk.find(a => a.nome === 'Teca in plexiglass')?.costoUnitario || 0) +
  //             (formData.fronteLuminoso || 0) * (accessoriDesk.find(a => a.nome === 'Fronte luminoso dim. 100x100')?.costoUnitario || 0) +
  //             (formData.borsa || 0) * (accessoriDesk.find(a => a.nome === 'Borsa')?.costoUnitario || 0);
  //
  //         const totale_desk = strutturaTerraDesk + graficaCordinoDesk + premontaggioDesk + costiAccessoriDesk;
  //
  //         return {
  //             strutturaTerra: strutturaTerraDesk,
  //             graficaCordino: graficaCordinoDesk,
  //             premontaggio: premontaggioDesk,
  //             accessori: costiAccessoriDesk,
  //             totale: totale_desk
  //         };
  //     };
  //
  //     // Aggiorna i costi solo se abbiamo tutti i dati necessari
  //     if (parametri.length > 0) {
  //         const storageCosts = calculateStorageCostsOnLoad();
  //         const espositoriCosts = calculateEspositoriCostsOnLoad();
  //         const deskCosts = calculateDeskCostsOnLoad();
  //
  //         setStorageCostsLifted(storageCosts);
  //         setExpositoreCostsLifted(espositoriCosts);
  //         setDeskCostsLifted(deskCosts);
  //     }
  // }, [editingPreventivo, formData, parametriCostiUnitari, parametri, accessoriEspositoriDB, layoutCostsEspositori, accessoriDesk, costiStrutturaDesk]);

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifica Preventivo' : 'Nuovo Preventivo'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifica il preventivo esistente' : 'Crea un nuovo preventivo compilando le sezioni seguenti'}.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-8">
            <PreventivoAnagrafica formData={formData} setFormData={setFormData}/>
            <Separator/>
            {/* Sezione Stand - collassabile */}
            <Collapsible open={sectionsOpen.stand} onOpenChange={open => setSectionsOpen(prev => ({
              ...prev,
              stand: open
            }))}>
              <div
                  className="bg-[hsl(var(--section-stand))] border border-[hsl(var(--section-stand-border))] rounded-lg overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost"
                          className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-stand-border))] rounded-none border-0">
                    <div className="flex items-center gap-3">
                      <div
                          className="w-3 h-3 rounded-full bg-[hsl(var(--section-stand-foreground))]"></div>
                      <span
                          className="font-medium text-[hsl(var(--section-stand-foreground))]">Stand</span>
                      <span
                          className="ml-2 text-xs bg-[hsl(var(--section-stand-foreground))] text-[hsl(var(--section-stand))] px-2 py-1 rounded-full">
                            Principale
                          </span>
                    </div>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-stand-foreground))] ${sectionsOpen.stand ? 'rotate-180' : ''}`}/>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t border-[hsl(var(--section-stand-border))] bg-card p-6">
                    <StandSection formData={formData} setFormData={setFormData}/>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            {/* Sezioni aggiuntive collassabili */}
            <div className="space-y-3">
              <Collapsible open={sectionsOpen.storage}
                           onOpenChange={open => setSectionsOpen(prev => ({
                             ...prev,
                             storage: open
                           }))}>
                <div
                    className="bg-[hsl(var(--section-storage))] border border-[hsl(var(--section-storage-border))] rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-storage-border))] rounded-none border-0">
                      <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full bg-[hsl(var(--section-storage-foreground))]"></div>
                        <span
                            className="font-medium text-[hsl(var(--section-storage-foreground))]">Storage</span>
                      </div>
                      <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-storage-foreground))] ${sectionsOpen.storage ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div
                        className="border-t border-[hsl(var(--section-storage-border))] bg-card p-6">
                      <StorageSection formData={formData} setFormData={setFormData}/>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              <Collapsible open={sectionsOpen.desk} onOpenChange={open => setSectionsOpen(prev => ({
                ...prev,
                desk: open
              }))}>
                <div
                    className="bg-[hsl(var(--section-desk))] border border-[hsl(var(--section-desk-border))] rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-desk-border))] rounded-none border-0">
                      <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full bg-[hsl(var(--section-desk-foreground))]"></div>
                        <span
                            className="font-medium text-[hsl(var(--section-desk-foreground))]">Desk</span>
                      </div>
                      <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-desk-foreground))] ${sectionsOpen.desk ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-[hsl(var(--section-desk-border))] bg-card p-6">
                      <DeskSection formData={formData} setFormData={setFormData}/>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
}
