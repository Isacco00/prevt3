import {PreventivoBean} from "@/types/preventivo.ts";

export interface DashboardBean {
    prospectsCount: number;
    preventiviCount: number;
    preventiviInCorso: number;
    valoreTotale: number;

    ultimiPreventivi: PreventivoBean[];

    valorePerStatus: {
        status: string;
        valore: number;
    }[];
}
