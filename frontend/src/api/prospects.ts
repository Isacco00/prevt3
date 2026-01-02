// src/api/preventivi.ts
import {api} from "@/api/index";
import {ProspectBean} from "@/types/prospects";

const entryPoint = "/prospect";

export const ProspectsAPI = {
    getProspects: async (): Promise<ProspectBean[]> => {
        const res = await api.get(entryPoint + "/getProspectList");
        return res.data;
    },

    saveProspects: async (data: Partial<ProspectBean>) => {
        await api.post(entryPoint + "/saveProspect", data);
    },

};
