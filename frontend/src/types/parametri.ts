import {AbstractSearchRequestBean} from "@/types/index.ts";

export interface ParametriBean {
  id: string;
  tipo: string;
  nome: string;
  valore: number;
  valoreTesto?: string;
  ricaricoPercentuale: number;
  prezzo: number;
  descrizione: string;
  attivo: boolean;
  valoreChiave?: string;
  ordine?: number;
}

export interface ParametriACostiUnitariBean {
  id: string;
  parametro: string
  unitaMisura: string;
  valore: number;
  ricaricoPercentuale: number;
  prezzo: number;
  attivo: boolean;
}

export interface ListinoServiziPrezzoUnitarioBean {
  id: string;
  parametro: string
  unitaMisura: string;
  costo: number;
  ricaricoPercentuale: number;
  prezzo: number;
  descrizione: string;
  attivo: boolean;
}

export interface ListinoAccessoriStandBean {
  id: string;
  nome: string;
  costoUnitario: number;
  ricaricoPercentuale: number;
  prezzo: number;
  descrizione: string;
  attivo: boolean;
}

export interface ListinoAccessoriDeskBean {
  id: string;
  nome: string;
  costoUnitario: number;
  ricaricoPercentuale: number;
  prezzo: number;
  descrizione: string;
  attivo: boolean;
}

export interface ListinoRetroilluminazioneBean {
  id: string;
  altezza: number
  costoAlMetro: number;
  ricaricoPercentuale: number;
  prezzo: number;
  descrizione: string;
}

export interface ListinoAccessoriEspositoriBean {
  id: string;
  nome: string
  costoUnitario: number;
  ricaricoPercentuale: number;
  prezzo: number;
  descrizione: string;
  attivo: boolean;
}

export interface ListinoStrutturaDeskBean {
  id?: string;
  costoUnitario: number;
  ricaricoPercentuale: number;
  prezzo?: number;
  descrizione: string;
  layoutDesk: number;
  attivo: boolean;
}

export interface ListinoStrutturaEspositoriBean {
  id: string;
  layoutEspositore: number
  costoUnitario: number;
  ricaricoPercentuale: number;
  prezzo?: number;
  descrizione: string;
  attivo: boolean;
}

export interface AltriBeniServiziBean {
  id: string;
  preventivoId: string;
  descrizione: string;
  costoUnitario: number;
  marginalita: number;
  prezzoUnitario: number;
  quantita: number;
  totale: number;
}

export interface PreventivoServiziBean {
  id?: string;
  preventivoId?: string;
  montaggioSmontaggio?: boolean;
  certificazioni?: boolean;
  istruzioniAssistenza?: boolean;

  personaleMont?: number;
  costoOrarioMont?: number;
  giorniMontaggio?: number;
  oreLavoroCantxperMont?: number;
  kmArMont?: number;
  consegCant?: boolean;
  voloMont?: string;
  trenoMont?: boolean;
  oreViaggioTrasfertaMont?: number;
  viaggioAutoComMont?: boolean;
  extraCostiTrasfertaMont?: string;
  extraKmTraspFurgMont?: number;
  extraKmTraspTirMont?: number;
  ricaricoMontaggio?: number;
  scontoMontaggio?: number;

  totCostOreMont?: number;
  totCostKmMont?: number;
  numVitti?: number;
  numAlloggi?: number;
  totCostVittall?: number;
  totCostoVoloAr?: number;
  totCostoTreno?: number;
  totCostoTrasfPers?: number;
  totCostiAuto?: number;
  totCostiExtraTrasfMont?: number;
  totCostiExtraKmTraspFurgMont?: number;
  totCostiExtraKmTraspTirMont?: number;
  totCostiConsegnaCantiere?: number;
  totaleCostoMontaggio?: number;
  preventivoMontaggio?: number;
  totalePrezzoListinoMont?: number;
  totalePrezzoNettoMont?: number;
  margineMont?: number;
  marginalitaMont?: number;

  personaleSmon?: number;
  costoOrarioSmon?: number;
  giorniSmontaggioViaggio?: number;
  oreLavoroCantxperSmon?: number;
  kmArSmon?: number;
  voloSmon?: string;
  trenoSmon?: boolean;
  oreViaggioTrasfertaSmon?: number;
  viaggioAutoComSmon?: boolean;
  extraCostiTrasfertaSmon?: string;
  extraKmTraspFurgSmon?: number;
  extraKmTraspTirSmon?: number;

  totCostOreSmon?: number;
  totCostKmSmon?: number;
  numVittiSmon?: number;
  numAlloggiSmon?: number;
  totCostVittallSmon?: number;
  totCostoVoloArSmon?: number;
  totCostoTrenoSmon?: number;
  totCostoTrasfPersSmon?: number;
  totCostiAutoSmon?: number;
  totCostiExtraTrasfSmon?: number;
  totCostiExtraKmTraspFurgSmon?: number;
  totCostiExtraKmTraspTirSmon?: number;
  totaleCostoSmontaggio?: number;
  preventivoSmontaggio?: number;
  totalePrezzoListinoSmon?: number;
  totalePrezzoNettoSmon?: number;
  margineSmon?: number;
  marginalitaSmon?: number;
}

export interface CostoVoloArBean {
  id: string;
  tipologia: string;
  costoVoloAr: number;
  attivo: boolean;
}

export interface CostoExtraTrasfMontBean {
  id: string;
  livello: string;
  costoExtraMont: number;
  attivo: boolean;
}

export interface ParametriRequestBean extends AbstractSearchRequestBean {
  attivo?: boolean;
  tipo?: string;
}
