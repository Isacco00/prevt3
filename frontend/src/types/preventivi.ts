import {ProspectBean} from "@/types/prospects";

export interface PreventiviBean {
    id: string;
    titolo: string;
    status: string;
    totalePreventivo: number;
    prospect: ProspectBean;
}

interface PreventivoBean {
    id: string;
    numeroPreventivo: string;
    titolo: string;
    descrizione?: string;
    prospectId?: string;
    profondita: number;
    larghezza: number;
    altezza: number;
    layout: string;
    distribuzione: number;
    complessita: string;
    superficie?: number;
    volume?: number;
    superficieStampa?: number;
    sviluppoLineare?: number;
    numeroPezzi?: number;
    costoMq: number;
    costoCc: number;
    costoFisso: number;
    costoStruttura?: number;
    costoGrafica?: number;
    costoPremontaggio?: number;
    costoTotale?: number;
    totale?: number;
    totalePreventivo?: number;
    status: string;
    dataScadenza?: string;
    note?: string;
    createdAt: string;
    prospects?: ProspectBean;
}
