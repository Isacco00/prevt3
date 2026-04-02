import {useMemo} from "react";
import {
  ListinoRetroilluminazioneBean,
  ListinoAccessoriStandBean,
  ParametriACostiUnitariBean,
  ParametriBean,
  ListinoServiziPrezzoUnitarioBean
} from "@/types/parametri";
import {PreventivoBean} from "@/types/preventivo.ts";

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
  listinoServizi: ListinoServiziPrezzoUnitarioBean[];
}

const empty = {
  prezzoStrutturaTerra: 0,
  costoStrutturaTerra: 0,
  prezzoNettoStrutturaTerra: 0,

  prezzoGraficaCordino: 0,
  costoGraficaCordino: 0,
  prezzoNettoGraficaCordino: 0,

  prezzoRetroilluminazione: 0,
  costoRetroilluminazione: 0,
  prezzoNettoRetroilluminazione: 0,

  prezzoPremontaggio: 0,
  costoPremontaggio: 0,
  prezzoNettoPremontaggio: 0,

  costiAccessoriVendita: 0,
  costiAccessoriNoleggio: 0,
  nettoAccessoriVendita: 0,
  nettoAccessoriNoleggio: 0,
  prezzoNoleggioAccessori: 0,
  totaleAccessori: 0,

  extraStandComplesso: 0,
  extraStandComplessoNetto: 0,

  totalePreventivoStand: 0,
  totaleCostiStand: 0,
  marginalitaMedia: 0,
};

export function useStandCosts({
                                formData,
                                physicalElements,
                                parametri,
                                listinoRetroilluminazione,
                                accessoriStand,
                                listinoServizi
                              }: UseStandCostsParams) {

  return useMemo(() => {

    // =========================
    // GUARD
    // =========================
    if (
        !formData.profondita ||
        !formData.larghezza ||
        !formData.altezza ||
        !formData.layout ||
        !formData.distribuzione ||
        !parametri.length
    ) {
      return empty;
    }

    const el = physicalElements;

    // =========================
    // PARAMETRI BASE
    // =========================
    const costoStampaParam = listinoServizi.find(p => p.parametro === "Stampa Grafica");
    const parametroPremontaggio = listinoServizi.find(p => p.parametro === "Premontaggio");
    const costoAltezzaParam = parametri.find(
        p => p.tipo === "costo_altezza" && p.valoreChiave === String(formData.altezza)
    );

    // =========================
    // STRUTTURA
    // =========================
    const prezzoStrutturaTerra =
        el.sviluppoLineare * (costoAltezzaParam?.prezzo ?? 0) +
        (formData.bifaccialita ?? 0) * (costoAltezzaParam?.prezzo ?? 0) * 0.5;

    const costoStrutturaTerra =
        el.sviluppoLineare * (costoAltezzaParam?.valore ?? 0) +
        (formData.bifaccialita ?? 0) * (costoAltezzaParam?.valore ?? 0) * 0.5;

    const prezzoNettoStrutturaTerra =
        prezzoStrutturaTerra * (1 - (formData.scontoStrutturaTerra ?? 0) / 100);

    // =========================
    // GRAFICA
    // =========================
    const prezzoGraficaCordino = costoStampaParam
        ? el.superficieStampa *
        (costoStampaParam.costo ?? 0) *
        (1 + (costoStampaParam.ricaricoPercentuale ?? 0) / 100)
        : 0;

    const costoGraficaCordino = costoStampaParam
        ? el.superficieStampa * (costoStampaParam.costo ?? 0)
        : 0;

    const prezzoNettoGraficaCordino =
        (formData.graficaCordinoAttiva ?? false)
            ? prezzoGraficaCordino * (1 - (formData.scontoGraficaCordino ?? 0) / 100)
            : 0;

    // =========================
    // RETROILLUMINAZIONE
    // =========================
    const costoRetroParam = listinoRetroilluminazione.find(
        c => c.altezza === formData.altezza
    );

    const prezzoRetroilluminazione = costoRetroParam
        ? formData.retroilluminazione *
        (costoRetroParam.costoAlMetro ?? 0) *
        (1 + (costoStampaParam?.ricaricoPercentuale ?? 0) / 100)
        : 0;

    const costoRetroilluminazione = costoRetroParam
        ? formData.retroilluminazione * (costoRetroParam.costoAlMetro ?? 0)
        : 0;

    const prezzoNettoRetroilluminazione =
        prezzoRetroilluminazione *
        (1 - (formData.scontoRetroilluminazione ?? 0) / 100);

    // =========================
    // PREMONTAGGIO
    // =========================
    const prezzoPremontaggio =
        parametroPremontaggio && formData.premontaggio
            ? el.numeroPezzi *
            (parametroPremontaggio.costo ?? 0) *
            (1 + (parametroPremontaggio.ricaricoPercentuale ?? 0) / 100)
            : 0;

    const costoPremontaggio =
        parametroPremontaggio && formData.premontaggio
            ? el.numeroPezzi * (parametroPremontaggio.costo ?? 0)
            : 0;

    const prezzoNettoPremontaggio =
        prezzoPremontaggio * (1 - (formData.scontoPremontaggio ?? 0) / 100);

    // =========================
    // ACCESSORI (NUOVO MODELLO)
    // =========================
    const accessoriMap = parseAccessoriStand(formData.accessoriStandConfig);

    let costiAccessoriVendita = 0;
    let costiAccessoriNoleggio = 0;

    Object.entries(accessoriMap).forEach(([id, item]) => {
      const acc = accessoriStand.find(a => a.id === id);
      if (!acc) return;

      const costo = item.qty * acc.costoUnitario;

      if (item.noleggio) {
        costiAccessoriNoleggio += costo;
      } else {
        costiAccessoriVendita += costo;
      }
    });

    const nettoAccessoriVendita =
        costiAccessoriVendita *
        (1 - (formData.scontoAccessoriVendita ?? 0) / 100);

    const nettoAccessoriNoleggio =
        costiAccessoriNoleggio *
        (1 - (formData.scontoAccessoriNoleggio ?? 0) / 100);

    const prezzoNoleggioAccessori =
        nettoAccessoriNoleggio *
        (formData.coefficienteNoleggio?.valore ?? 0);

    const totaleAccessori =
        nettoAccessoriVendita + prezzoNoleggioAccessori;

    // =========================
    // EXTRA
    // =========================
    const extraBase =
        formData.complessita === "alta"
            ? prezzoStrutturaTerra * ((formData.extraPercComplex ?? 0) / 100)
            : 0;
    const extraStandComplesso = extraBase;

    const extraStandComplessoNetto =
        extraBase * (1 - (formData.scontoExtraStandComplesso ?? 0) / 100);

    // =========================
    // TOTALI
    // =========================
    const totalePreventivoStand =
        prezzoNettoStrutturaTerra +
        prezzoNettoGraficaCordino +
        prezzoNettoRetroilluminazione +
        prezzoNettoPremontaggio +
        totaleAccessori +
        extraStandComplessoNetto;

    const totaleCostiStand =
        costoStrutturaTerra +
        costoGraficaCordino +
        costoRetroilluminazione +
        costoPremontaggio +
        costiAccessoriVendita +
        costiAccessoriNoleggio;

    const marginalitaMedia =
        totaleCostiStand > 0
            ? ((totalePreventivoStand - totaleCostiStand) / totaleCostiStand) * 100
            : 0;

    return {
      // struttura
      prezzoStrutturaTerra,
      costoStrutturaTerra,
      prezzoNettoStrutturaTerra,

      // grafica
      prezzoGraficaCordino,
      costoGraficaCordino,
      prezzoNettoGraficaCordino,

      // retro
      prezzoRetroilluminazione,
      costoRetroilluminazione,
      prezzoNettoRetroilluminazione,

      // premontaggio
      prezzoPremontaggio,
      costoPremontaggio,
      prezzoNettoPremontaggio,

      // accessori
      costiAccessoriVendita,
      costiAccessoriNoleggio,
      nettoAccessoriVendita,
      nettoAccessoriNoleggio,
      prezzoNoleggioAccessori,
      totaleAccessori,

      // extra
      extraStandComplesso,
      extraStandComplessoNetto,

      // totali
      totalePreventivoStand,
      totaleCostiStand,
      marginalitaMedia,
    };

  }, [
    formData,
    physicalElements,
    parametri,
    listinoRetroilluminazione,
    accessoriStand,
    listinoServizi
  ]);
}