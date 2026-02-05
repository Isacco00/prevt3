// src/api/preventivo.ts
import {api} from "@/api/index";
import {MarginalitaPerProspectBean} from "@/types/marginalitaPerProspect.ts";
import {ListinoAccessoriRequestBean} from "@/types/preventivo.ts";

const entryPoint = "/marginalitaperprospect";

export const MarginalitaPerProspectAPI = {
    getMarginalitaPerProspectList: async (filter: ListinoAccessoriRequestBean = {}): Promise<MarginalitaPerProspectBean[]> => {
        const res = await api.post(entryPoint + "/getMarginalitaPerProspectList", filter);
        return res.data;
    },

    saveMarginalitaPerProspect: async (data: Partial<MarginalitaPerProspectBean>) => {
        await api.post(entryPoint + "/saveMarginalitaPerProspect", data);
    },

};
