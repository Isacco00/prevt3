import {ISODateString} from "@/types/index.ts";

export interface MarginalitaPerProspectBean {
    id: string;
    tipoProspect: string;
    marginalita: number;
    attivo: boolean;
    createdAt?: ISODateString;
    updatedAt?: ISODateString;
}
