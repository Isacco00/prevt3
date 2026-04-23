// src/api/preventivo.ts
import {api} from "@/api/index";
import {
  ListinoAccessoriStandBean,
  ParametriBean,
  ParametriRequestBean,
  ListinoRetroilluminazioneBean,
  ListinoAccessoriDeskBean,
  ParametriACostiUnitariBean, ListinoAccessoriEspositoriBean, ListinoStrutturaDeskBean,
  ListinoStrutturaEspositoriBean, AltriBeniServiziBean, ListinoServiziPrezzoUnitarioBean,
  PreventivoServiziBean, CostoVoloArBean, CostoExtraTrasfMontBean
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

  getListinoServiziPrezzoUnitario: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoServiziPrezzoUnitarioBean[]> => {
    const res = await api.post(entryPoint + "/getListinoServiziPrezzoUnitario", filter);
    return res.data;
  },

  saveListinoServiziPrezzoUnitario: async (parametro: ListinoServiziPrezzoUnitarioBean): Promise<ListinoServiziPrezzoUnitarioBean> => {
    const data = await api.post(entryPoint + "/saveListinoServiziPrezzoUnitario", parametro);
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
    const data = await api.post(entryPoint + "/deleteListinoAccessoriStand", {id});
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
    const data = await api.post(entryPoint + "/deleteListinoAccessoriDesk", {id});
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
    const data = await api.post(entryPoint + "/deleteListinoAccessoriEspositori", {id});
    return data.data;
  },

  getListinoStrutturaDesk: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoStrutturaDeskBean[]> => {
    const res = await api.post(entryPoint + "/getListinoStrutturaDesk", filter);
    return res.data;
  },

  saveListinoStrutturaDesk: async (parametro: ListinoStrutturaDeskBean): Promise<ListinoStrutturaDeskBean> => {
    const data = await api.post(entryPoint + "/saveListinoStrutturaDesk", parametro);
    return data.data;
  },

  deleteListinoStrutturaDesk: async (id: string): Promise<void> => {
    const data = await api.post(entryPoint + "/deleteListinoStrutturaDesk", {id});
    return data.data;
  },

  getListinoStrutturaEspositori: async (filter: ListinoAccessoriRequestBean = {}): Promise<ListinoStrutturaEspositoriBean[]> => {
    const res = await api.post(entryPoint + "/getListinoStrutturaEspositori", filter);
    return res.data;
  },

  saveListinoStrutturaEspositori: async (parametro: ListinoStrutturaEspositoriBean): Promise<ListinoStrutturaEspositoriBean> => {
    const data = await api.post(entryPoint + "/saveListinoStrutturaEspositori", parametro);
    return data.data;
  },

  deleteListinoStrutturaEspositori: async (id: string): Promise<void> => {
    const data = await api.post(entryPoint + "/deleteListinoStrutturaEspositori", {id});
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

  getPreventivoServiziByPreventivoId: async (filter?: ListinoAccessoriRequestBean): Promise<PreventivoServiziBean | null> => {
    const res = await api.post(entryPoint + "/getPreventivoServiziByPreventivoId", filter ?? {});
    const list = (res.data as PreventivoServiziBean[]) || [];
    return list.length > 0 ? list[0] : null;
  },

  savePreventivoServizi: async (bean: PreventivoServiziBean): Promise<PreventivoServiziBean> => {
    const res = await api.post(entryPoint + "/savePreventivoServizi", bean);
    return res.data;
  },

  getCostiVoloAr: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostoVoloArBean[]> => {
    const res = await api.post(entryPoint + "/getCostiVoloAr", filter);
    return res.data;
  },

  getCostiExtraTrasfMont: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostoExtraTrasfMontBean[]> => {
    const res = await api.post(entryPoint + "/getCostiExtraTrasfMont", filter);
    return res.data;
  },
};
