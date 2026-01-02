import {ProspectBean} from "@/types/prospects";

export interface PreventiviBean {
    id: string;
    titolo: string;
    status: string;
    totalePreventivo: number;
    prospect: ProspectBean;
}
