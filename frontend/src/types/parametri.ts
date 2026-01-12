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
    attivo: boolean;
}

export interface ListinoAccessoriStandBean {
    id: string;
    nome: string;
    costoUnitario: number;
    attivo: boolean;
}

export type ParametriRequestBean = AbstractSearchRequestBean
