import {AbstractSearchRequestBean} from "@/types/index.ts";

export interface ParametriBean {
  id: string;
  tipo: string;
  nome: string;
  valore: number;
  valoreTesto: string;
  descrizione: string;
  attivo: boolean;
  valoreChiave: string;
  ordine: number;
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

export interface CostiStrutturaEspositoriLayoutBean {
  id: string;
  layoutEspositore: string
  costoUnitario: number;
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
  id: string;
  preventivoMontaggio?: number;
  preventivoSmontaggio?: number;
  totaleCostoMontaggio?: number;
  totaleCostoSmontaggio?: number;
}

export type ParametriRequestBean = AbstractSearchRequestBean
