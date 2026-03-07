// src/api/preventivo.ts
import {api} from "@/api/index";
import {
    ListinoAccessoriStandBean,
    ParametriBean,
    ParametriRequestBean,
    ListinoRetroilluminazioneBean,
    ListinoAccessoriDeskBean,
    ParametriACostiUnitariBean, ListinoAccessoriEspositoriBean, CostiStrutturaDeskBean,
    CostiStrutturaEspositoriLayoutBean, AltriBeniServiziBean
} from "@/types/parametri.ts";
import {
    ListinoAccessoriRequestBean,
} from "@/types/preventivo.ts";

const entryPoint = "/parametri";

export const ParametriAPI = {

    getParametriList: async (filter: ParametriRequestBean = {}): Promise<ParametriBean[]> => {
        const res = await api.post(entryPoint + "/getParametriList", filter);
        return res.data;
    },

    saveParametro: async (parametro: ParametriBean): Promise<ParametriBean> => {
        const data = await api.post(entryPoint + "/saveParametro", parametro);
        return data.data;
    },

    getParametriACostiUnitari: async (filter: ListinoAccessoriRequestBean = {}): Promise<ParametriACostiUnitariBean[]> => {
        const res = await api.post(entryPoint + "/getParametriACostiUnitari", filter);
        return res.data;
    },

    saveParametriCostiUnitari: async (parametro: ParametriACostiUnitariBean): Promise<ParametriACostiUnitariBean> => {
        const data = await api.post(entryPoint + "/saveParametriCostiUnitari", parametro);
        return data.data;
    },

    getListinoRetroilluminazione: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoRetroilluminazioneBean[]> => {
        const res = await api.post(entryPoint + "/getListinoRetroilluminazione", filter);
        return res.data;
    },

    saveListinoRetroilluminazione: async (parametro: ListinoRetroilluminazioneBean): Promise<ListinoRetroilluminazioneBean> => {
        const data = await api.post(entryPoint + "/saveListinoRetroilluminazione", parametro);
        return data.data;
    },

    getListinoAccessoriStand: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoAccessoriStandBean[]> => {
        const res = await api.post(entryPoint + "/getListinoAccessoriStand", filter);
        return res.data;
    },

    saveListinoAccessoriStand: async (parametro: ListinoAccessoriStandBean): Promise<ListinoAccessoriStandBean> => {
        const data = await api.post(entryPoint + "/saveListinoAccessoriStand", parametro);
        return data.data;
    },

    deleteListinoAccessoriStand: async (id: string): Promise<void> => {
        const data = await api.post(entryPoint + "/deleteListinoAccessoriStand", { id });
        return data.data;
    },

    getListinoAccessoriDesk: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoAccessoriDeskBean[]> => {
        const res = await api.post(entryPoint + "/getListinoAccessoriDesk", filter);
        return res.data;
    },

    saveListinoAccessoriDesk: async (parametro: ListinoAccessoriDeskBean): Promise<ListinoAccessoriDeskBean> => {
        const data = await api.post(entryPoint + "/saveListinoAccessoriDesk", parametro);
        return data.data;
    },

    deleteListinoAccessoriDesk: async (id: string): Promise<void> => {
        const data = await api.post(entryPoint + "/deleteListinoAccessoriDesk", { id });
        return data.data;
    },

    getListinoAccessoriEspositori: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoAccessoriEspositoriBean[]> => {
        const res = await api.post(entryPoint + "/getListinoAccessoriEspositori", filter);
        return res.data;
    },

    saveListinoAccessoriEspositori: async (parametro: ListinoAccessoriEspositoriBean): Promise<ListinoAccessoriEspositoriBean> => {
        const data = await api.post(entryPoint + "/saveListinoAccessoriEspositori", parametro);
        return data.data;
    },

    deleteListinoAccessoriEspositori: async (id: string): Promise<void> => {
        const data = await api.post(entryPoint + "/deleteListinoAccessoriEspositori", { id });
        return data.data;
    },

    getCostiStrutturaDesk: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiStrutturaDeskBean[]> => {
        const res = await api.post(entryPoint + "/getCostiStrutturaDesk", filter);
        return res.data;
    },

    saveCostiStrutturaDesk: async (parametro: CostiStrutturaDeskBean): Promise<CostiStrutturaDeskBean> => {
        const data = await api.post(entryPoint + "/saveCostiStrutturaDesk", parametro);
        return data.data;
    },

    deleteCostiStrutturaDesk: async (id: string): Promise<void> => {
        const data = await api.post(entryPoint + "/deleteCostiStrutturaDesk", { id });
        return data.data;
    },

    getCostiStrutturaEspositoriLayout: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiStrutturaEspositoriLayoutBean[]> => {
        const res = await api.post(entryPoint + "/getCostiStrutturaEspositoriLayout", filter);
        return res.data;
    },

    saveCostiStrutturaEspositoriLayout: async (parametro: CostiStrutturaEspositoriLayoutBean): Promise<CostiStrutturaEspositoriLayoutBean> => {
        const data = await api.post(entryPoint + "/saveCostiStrutturaEspositoriLayout", parametro);
        return data.data;
    },

    deleteCostiStrutturaEspositoriLayout: async (id: string): Promise<void> => {
        const data = await api.post(entryPoint + "/deleteCostiStrutturaEspositoriLayout", { id });
        return data.data;
    },

    getAltriBeniServiziByPreventivoId: async (filter?: ListinoAccessoriRequestBean): Promise<AltriBeniServiziBean[]> => {
        const res = await api.post(entryPoint + "/getAltriBeniServiziByPreventivoId", filter);
        return res.data;
    },

    saveAltriBeniServizi: async (bean: AltriBeniServiziBean): Promise<AltriBeniServiziBean> => {
        const data = await api.post(entryPoint + "/saveAltriBeniServizi", bean);
        return data.data;
    },

    deleteAltriBeniServizi: async (bean: AltriBeniServiziBean): Promise<AltriBeniServiziBean> => {
        const data = await api.post(entryPoint + "/deleteAltriBeniServizi", bean);
        return data.data;
    },

    getPreventivoServiziByPreventivoId: async (filter?: ListinoAccessoriRequestBean): Promise<void> => {
        const res = await api.post(entryPoint + "/getPreventivoServiziByPreventivoId", filter);
        return res.data;
    },
};
