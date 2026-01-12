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

export type ParametriRequestBean = AbstractSearchRequestBean
