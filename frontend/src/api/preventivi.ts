// src/api/preventivo.ts
import {api} from "@/api/index";
import {
    CostiRetroilluminazioneBean,
    CostiStrutturaDeskBean,
    ListinoAccessoriDeskBean,
    ListinoAccessoriRequestBean, ListinoAccessoriStandBean, ParametriACostiUnitariBean, ParametriBean,
    PreventivoBean
} from "@/types/preventivo.ts";

const entryPoint = "/preventivi";

export const PreventiviAPI = {
    getPreventiviList: async (): Promise<PreventivoBean[]> => {
        const res = await api.get(entryPoint + '/getPreventiviList');
        return res.data;
    },
    getListinoAccessoriDesk: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoAccessoriDeskBean[]> => {
        const res = await api.post(entryPoint + "/getListinoAccessoriDesk", filter);
        return res.data;
    },
    getListinoAccessoriStand: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoAccessoriStandBean[]> => {
        const res = await api.post(entryPoint + "/getListinoAccessoriStand", filter);
        return res.data;
    },
    getCostiStrutturaDesk: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiStrutturaDeskBean[]> => {
        const res = await api.post(entryPoint + "/getCostiStrutturaDesk", filter);
        return res.data;
    },
    getParametriList: async (): Promise<ParametriBean[]> => {
        const res = await api.post(entryPoint + "/getParametriList");
        return res.data;
    },
    getParametriACostiUnitari: async (filter: ListinoAccessoriRequestBean = {}): Promise<ParametriACostiUnitariBean[]> => {
        const res = await api.post(entryPoint + "/getParametriACostiUnitari", filter);
        return res.data;
    },
    getCostiRetroilluminazione: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiRetroilluminazioneBean[]> => {
        const res = await api.post(entryPoint + "/getCostiRetroilluminazione", filter);
        return res.data;
    },
    getCostiStrutturaEspositoriLayout: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiRetroilluminazioneBean[]> => {
        const res = await api.post(entryPoint + "/getCostiStrutturaEspositoriLayout", filter);
        return res.data;
    },
    getListinoAccessoriEspositori: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiRetroilluminazioneBean[]> => {
        const res = await api.post(entryPoint + "/getListinoAccessoriEspositori", filter);
        return res.data;
    },
};
