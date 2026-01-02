import {PreventiviBean} from "@/types/preventivi";

export interface DashboardBean {
    prospectsCount: number;
    preventiviCount: number;
    preventiviInCorso: number;
    valoreTotale: number;

    ultimiPreventivi: PreventiviBean[];

    valorePerStatus: {
        status: string;
        valore: number;
    }[];
}
