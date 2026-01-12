// src/api/preventivo.ts
import {api} from "@/api/index";
import {ParametriBean, ParametriRequestBean} from "@/types/parametri.ts";
import {
    CostiRetroilluminazioneBean,
    ListinoAccessoriRequestBean, ListinoAccessoriStandBean,
    ParametriACostiUnitariBean
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

    getCostiRetroilluminazione: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiRetroilluminazioneBean[]> => {
        const res = await api.post(entryPoint + "/getCostiRetroilluminazione", filter);
        return res.data;
    },

    saveCostiRetroilluminazione: async (parametro: CostiRetroilluminazioneBean): Promise<CostiRetroilluminazioneBean> => {
        const data = await api.post(entryPoint + "/saveCostiRetroilluminazione", parametro);
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

    deleteListinoAccessoriStand: async (parametro: ListinoAccessoriStandBean): Promise<ListinoAccessoriStandBean> => {
        const data = await api.post(entryPoint + "/deleteListinoAccessoriStand", parametro);
        return data.data;
    },
};
