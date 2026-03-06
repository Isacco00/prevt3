import {ISODateString} from "@/types/index.ts";

export interface ProspectBean {
    id: string;
    userId?: string;
    ragioneSociale: string;
    partitaIva: string;
    codiceFiscale?: string;
    indirizzo: string;
    citta: string;
    cap: string;
    provincia: string;
    telefono?: string;
    email?: string;
    tipo: 'prospect' | 'cliente';
    tipoProspect?: 'Professional' | 'Finale';
    scontoCliente: number;
    createdAt?: ISODateString;
    updatedAt?: ISODateString;
}
