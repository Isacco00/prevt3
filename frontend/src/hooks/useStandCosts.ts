// hooks/preventivo/useStandCosts.ts
import {useMemo} from "react";
import {
  ListinoRetroilluminazioneBean, ListinoAccessoriStandBean,
  ParametriACostiUnitariBean,
  ParametriBean
} from "@/types/parametri";
import {PreventivoBean} from "@/types/preventivo.ts";

type AccessoriStandMap = Record<string, number>;

const parseAccessoriStand = (json?: string): AccessoriStandMap => {
  if (!json) return {};
  try {
    const parsed = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

interface UseStandCostsParams {
  formData: PreventivoBean;
  physicalElements: {
    superficieStampa: number;
    superficieMq: number;
    sviluppoLineare: number;
    numeroPezzi: number;
  };
  parametri: ParametriBean[];
  parametriCostiUnitari: ParametriACostiUnitariBean[];
  listinoRetroilluminazione: ListinoRetroilluminazioneBean[];
  accessoriStand: ListinoAccessoriStandBean[];
}

export function useStandCosts({
                                formData,
                                physicalElements,
                                parametri,
                                parametriCostiUnitari,
                                listinoRetroilluminazione,
                                accessoriStand,
                              }: UseStandCostsParams) {

  return useMemo(() => {
    if (!formData.profondita || !formData.larghezza || !formData.altezza || !formData.layout || !formData.distribuzione || !parametri.length) {
      return {
        strutturaTerra: 0,
        graficaCordino: 0,
        premontaggio: 0,
        retroilluminazione: 0,
        extraStandComplesso: 0,
        costiAccessori: 0,
        preventivoStruttura: 0,
        preventivoGrafica: 0,
        preventivoRetroilluminazione: 0,
        preventivoAccessori: 0,
        preventivoPremontaggio: 0,
        totalePreventivoStand: 0,
        totaleCostiStand: 0,
        marginalitaMedia: 0,
      };
    }

    const elements = physicalElements;

    const costoStampaParam = parametriCostiUnitari.find(p => p.parametro === 'Costo Stampa Grafica');
    const costoPremontaggio = parametriCostiUnitari.find(p => p.parametro === 'Costo Premontaggio');
    const costoAltezzaParam = parametri.find(p => p.tipo === 'costo_altezza' && p.valoreChiave === String(formData.altezza));

    const strutturaTerra = costoAltezzaParam ? elements.sviluppoLineare * (costoAltezzaParam.valore || 0) : 0;
    const graficaCordino = costoStampaParam ? elements.superficieStampa * (costoStampaParam.valore || 0) : 0;
    const premontaggio = costoPremontaggio && formData.premontaggio ? elements.numeroPezzi * (costoPremontaggio.valore || 0) : 0;

    const costoRetroParam = listinoRetroilluminazione.find(c => c.altezza === formData.altezza);
    const retroilluminazione = costoRetroParam ? formData.retroilluminazione * (costoRetroParam.costoAlMetro || 0) : 0;

    const extraPercComplex = formData.extraPercComplex || 0;
    const extraStandComplesso =
        formData.complessita === 'alta'
            ? strutturaTerra * (extraPercComplex / 100)
            : 0;

    let costiAccessori = 0;
    if (accessoriStand.length > 0) {
      const accessoriMap = parseAccessoriStand(formData.accessoriStandConfig);
      accessoriStand.forEach(accessorio => {
        const quantity = accessoriMap[accessorio.id] ?? 0;
        costiAccessori += quantity * accessorio.costoUnitario;
      });
    }

    const preventivoStruttura = strutturaTerra * (1 + formData.marginalitaStruttura / 100);
    const preventivoGrafica = graficaCordino * (1 + formData.marginalitaGrafica / 100);
    const preventivoRetroilluminazione = retroilluminazione * (1 + formData.marginalitaRetroilluminazione / 100);
    const preventivoAccessori = costiAccessori * (1 + formData.marginalitaAccessori / 100);
    const preventivoPremontaggio = premontaggio * (1 + formData.marginalitaPremontaggio / 100);

    const totalePreventivoStand =
        preventivoStruttura +
        preventivoGrafica +
        preventivoRetroilluminazione +
        preventivoAccessori +
        preventivoPremontaggio +
        extraStandComplesso;

    const totaleCostiStand =
        strutturaTerra +
        graficaCordino +
        retroilluminazione +
        costiAccessori +
        premontaggio;

    const marginalitaMedia =
        totaleCostiStand > 0
            ? (totalePreventivoStand - totaleCostiStand) / totaleCostiStand * 100
            : 0;

    return {
      strutturaTerra,
      graficaCordino,
      premontaggio,
      retroilluminazione,
      extraStandComplesso,
      costiAccessori,
      preventivoStruttura,
      preventivoGrafica,
      preventivoRetroilluminazione,
      preventivoAccessori,
      preventivoPremontaggio,
      totalePreventivoStand,
      totaleCostiStand,
      marginalitaMedia,
    };
  }, [
    formData,
    physicalElements,
    parametri,
    parametriCostiUnitari,
    listinoRetroilluminazione,
    accessoriStand,
  ]);
}