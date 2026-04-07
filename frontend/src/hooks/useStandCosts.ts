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
  prezziAccessoriVendita: 0,
  prezziAccessoriNoleggio: 0,
  nettoAccessoriVendita: 0,
  nettoAccessoriNoleggio: 0,
  prezzoNoleggioAccessori: 0,
  totaleAccessori: 0,

  prezzoNoleggioStrutturaTerra: 0,
  prezzoNoleggioRetroilluminazione: 0,

  extraStandComplesso: 0,
  extraStandComplessoNetto: 0,

  totalePreventivoStand: 0,
  totaleCostiStand: 0,
  marginalitaMedia: 0,

  // vendita
  totalePrezzoListinoVendita: 0,
  totalePrezzoNettoVendita: 0,
  totaleCostiVendita: 0,
  scontoMedioVendita: 0,
  marginalitaVendita: 0,

  // noleggio
  totalePrezzoListinoNoleggio: 0,
  totalePrezzoNettoNoleggio: 0,
  totaleCostiNoleggio: 0,
  scontoMedioNoleggio: 0,
  marginalitaNoleggio: 0,
  premontaggio: 0,
  extraComplesso: 0,
  totalePrezzoNoleggio: 0,
  totalePreventivoFinale: 0,
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

    const r2 = (n: number) => Math.round(n * 100) / 100;

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
    const prezzoStrutturaTerra = r2(
        el.sviluppoLineare * (costoAltezzaParam?.prezzo ?? 0) +
        (formData.bifaccialita ?? 0) * (costoAltezzaParam?.prezzo ?? 0) * 0.5
    );

    const costoStrutturaTerra = r2(
        el.sviluppoLineare * (costoAltezzaParam?.valore ?? 0) +
        (formData.bifaccialita ?? 0) * (costoAltezzaParam?.valore ?? 0) * 0.5
    );

    const prezzoNettoStrutturaTerra = r2(
        prezzoStrutturaTerra * (1 - (formData.scontoStrutturaTerra ?? 0) / 100)
    );

    // =========================
    // GRAFICA
    // =========================
    const prezzoGraficaCordino = r2(costoStampaParam
        ? el.superficieStampa *
        (costoStampaParam.costo ?? 0) *
        (1 + (costoStampaParam.ricaricoPercentuale ?? 0) / 100)
        : 0);

    const costoGraficaCordino = r2(costoStampaParam
        ? el.superficieStampa * (costoStampaParam.costo ?? 0)
        : 0);

    const prezzoNettoGraficaCordino = r2(
        (formData.graficaCordinoAttiva ?? false)
            ? prezzoGraficaCordino * (1 - (formData.scontoGraficaCordino ?? 0) / 100)
            : 0
    );

    // =========================
    // RETROILLUMINAZIONE
    // =========================
    const costoRetroParam = listinoRetroilluminazione.find(
        c => c.altezza === formData.altezza
    );

    const prezzoRetroilluminazione = r2(costoRetroParam
        ? formData.retroilluminazione *
        (costoRetroParam.costoAlMetro ?? 0) *
        (1 + (costoStampaParam?.ricaricoPercentuale ?? 0) / 100)
        : 0);

    const costoRetroilluminazione = r2(costoRetroParam
        ? formData.retroilluminazione * (costoRetroParam.costoAlMetro ?? 0)
        : 0);

    const prezzoNettoRetroilluminazione = r2(
        prezzoRetroilluminazione *
        (1 - (formData.scontoRetroilluminazione ?? 0) / 100)
    );

    // =========================
    // PREMONTAGGIO
    // =========================
    const prezzoPremontaggio = r2(
        parametroPremontaggio && formData.premontaggio
            ? el.numeroPezzi *
            (parametroPremontaggio.costo ?? 0) *
            (1 + (parametroPremontaggio.ricaricoPercentuale ?? 0) / 100)
            : 0
    );

    const costoPremontaggio = r2(
        parametroPremontaggio && formData.premontaggio
            ? el.numeroPezzi * (parametroPremontaggio.costo ?? 0)
            : 0
    );

    const prezzoNettoPremontaggio = r2(
        prezzoPremontaggio * (1 - (formData.scontoPremontaggio ?? 0) / 100)
    );

    // =========================
    // ACCESSORI (NUOVO MODELLO)
    // =========================
    const accessoriMap = parseAccessoriStand(formData.accessoriStandConfig);

    let costiAccessoriVendita = 0;
    let costiAccessoriNoleggio = 0;
    let prezziAccessoriVendita = 0;
    let prezziAccessoriNoleggio = 0;

    Object.entries(accessoriMap).forEach(([id, item]) => {
      const acc = accessoriStand.find(a => a.id === id);
      if (!acc) return;

      const costo = r2(item.qty * acc.costoUnitario);
      const prezzo = r2(item.qty * acc.costoUnitario * (1 + (acc.ricaricoPercentuale ?? 0) / 100));

      if (item.noleggio) {
        costiAccessoriNoleggio += costo;
        prezziAccessoriNoleggio += prezzo;
      } else {
        costiAccessoriVendita += costo;
        prezziAccessoriVendita += prezzo;
      }
    });

    costiAccessoriVendita = r2(costiAccessoriVendita);
    costiAccessoriNoleggio = r2(costiAccessoriNoleggio);
    prezziAccessoriVendita = r2(prezziAccessoriVendita);
    prezziAccessoriNoleggio = r2(prezziAccessoriNoleggio);

    const nettoAccessoriVendita = r2(
        prezziAccessoriVendita * (1 - (formData.scontoAccessoriVendita ?? 0) / 100)
    );

    const nettoAccessoriNoleggio = r2(
        prezziAccessoriNoleggio * (1 - (formData.scontoAccessoriNoleggio ?? 0) / 100)
    );

    const prezzoNoleggioAccessori = r2(
        nettoAccessoriNoleggio * (formData.coefficienteNoleggio?.valore ?? 0)
    );

    const totaleAccessori = r2(nettoAccessoriVendita + prezzoNoleggioAccessori);

    // =========================
    // EXTRA
    // =========================
    const extraStandComplesso = r2(
        formData.complessita === "alta"
            ? prezzoStrutturaTerra * ((formData.extraPercComplex ?? 0) / 100)
            : 0
    );

    const extraStandComplessoNetto = r2(
        extraStandComplesso * (1 - (formData.scontoExtraStandComplesso ?? 0) / 100)
    );

    // =========================
    // PREZZI NOLEGGIO PER VOCE
    // =========================
    const coeff = formData.coefficienteNoleggio?.valore ?? 0;

    const prezzoNoleggioStrutturaTerra = r2(prezzoNettoStrutturaTerra * coeff);
    const prezzoNoleggioRetroilluminazione = r2(prezzoNettoRetroilluminazione * coeff);

    // =========================
    // TOTALI VENDITA
    // =========================
    const totalePrezzoListinoVendita = r2(
        prezzoStrutturaTerra +
        (formData.graficaCordinoAttiva ? prezzoGraficaCordino : 0) +
        prezzoRetroilluminazione +
        prezzoPremontaggio +
        prezziAccessoriVendita +
        prezziAccessoriNoleggio +
        extraStandComplesso
    );

    const totalePrezzoNettoVendita = r2(
        prezzoNettoStrutturaTerra +
        prezzoNettoGraficaCordino +
        prezzoNettoRetroilluminazione +
        prezzoNettoPremontaggio +
        nettoAccessoriVendita +
        nettoAccessoriNoleggio +
        extraStandComplessoNetto
    );

    const totaleCostiVendita = r2(
        costoStrutturaTerra +
        (formData.graficaCordinoAttiva ? costoGraficaCordino : 0) +
        costoRetroilluminazione +
        costoPremontaggio +
        costiAccessoriVendita +
        costiAccessoriNoleggio
    );

    const scontoMedioVendita =
        totalePrezzoListinoVendita > 0
            ? r2((totalePrezzoListinoVendita - totalePrezzoNettoVendita) / totalePrezzoListinoVendita * 100)
            : 0;

    const marginalitaVendita =
        totalePrezzoNettoVendita > 0
            ? r2((totalePrezzoNettoVendita - totaleCostiVendita) / totalePrezzoNettoVendita * 100)
            : 0;

    // =========================
    // TOTALI NOLEGGIO
    // =========================
    const totalePrezzoListinoNoleggio = r2(
        prezziAccessoriVendita +
        (formData.graficaCordinoAttiva ? prezzoGraficaCordino : 0) +
        prezzoPremontaggio +
        extraStandComplesso
    );

    const totalePrezzoNettoNoleggio = r2(
        nettoAccessoriVendita +
        prezzoNettoGraficaCordino +
        prezzoNettoPremontaggio +
        extraStandComplessoNetto
    );

    const totaleCostiNoleggio = r2(
        (formData.graficaCordinoAttiva ? costoGraficaCordino : 0) +
        costoPremontaggio +
        costiAccessoriVendita
    );

    const scontoMedioNoleggio =
        totalePrezzoListinoNoleggio > 0
            ? r2((totalePrezzoListinoNoleggio - totalePrezzoNettoNoleggio) / totalePrezzoListinoNoleggio * 100)
            : 0;

    const marginalitaNoleggio =
        totalePrezzoNettoNoleggio > 0
            ? r2((totalePrezzoNettoNoleggio - totaleCostiNoleggio) / totalePrezzoNettoNoleggio * 100)
            : 0;

    // =========================
    // TOTALI
    // =========================
    const totalePreventivoStand = r2(
        prezzoNettoStrutturaTerra +
        prezzoNettoGraficaCordino +
        prezzoNettoRetroilluminazione +
        prezzoNettoPremontaggio +
        totaleAccessori +
        extraStandComplessoNetto
    );

    const totaleCostiStand = r2(
        costoStrutturaTerra +
        costoGraficaCordino +
        costoRetroilluminazione +
        costoPremontaggio +
        costiAccessoriVendita +
        costiAccessoriNoleggio
    );

    const marginalitaMedia =
        totaleCostiStand > 0
            ? r2((totalePreventivoStand - totaleCostiStand) / totaleCostiStand * 100)
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
      prezziAccessoriVendita,
      prezziAccessoriNoleggio,
      nettoAccessoriVendita,
      nettoAccessoriNoleggio,
      prezzoNoleggioAccessori,
      totaleAccessori,

      // noleggio per voce
      prezzoNoleggioStrutturaTerra,
      prezzoNoleggioRetroilluminazione,

      // extra
      extraStandComplesso,
      extraStandComplessoNetto,

      // totali
      totalePreventivoStand,
      totaleCostiStand,
      marginalitaMedia,

      // vendita
      totalePrezzoListinoVendita,
      totalePrezzoNettoVendita,
      totaleCostiVendita,
      scontoMedioVendita,
      marginalitaVendita,

      // noleggio
      totalePrezzoListinoNoleggio,
      totalePrezzoNettoNoleggio,
      totaleCostiNoleggio,
      scontoMedioNoleggio,
      marginalitaNoleggio,
      premontaggio: prezzoNettoPremontaggio,
      extraComplesso: extraStandComplessoNetto,
      totalePrezzoNoleggio: r2(prezzoNoleggioStrutturaTerra + prezzoNoleggioRetroilluminazione + prezzoNoleggioAccessori),
      totalePreventivoFinale: r2(totalePrezzoNettoNoleggio + prezzoNoleggioStrutturaTerra + prezzoNoleggioRetroilluminazione + prezzoNoleggioAccessori),
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
