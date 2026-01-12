// src/api/preventivo.ts
import {api} from "@/api/index";
import {
  CostiRetroilluminazioneBean,
  CostiStrutturaDeskBean,
  ListinoAccessoriDeskBean,
  ListinoAccessoriRequestBean, PreventivoBean
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
  getCostiStrutturaDesk: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiStrutturaDeskBean[]> => {
    const res = await api.post(entryPoint + "/getCostiStrutturaDesk", filter);
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
  getAltriBeniServizi: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiRetroilluminazioneBean[]> => {
    const res = await api.post(entryPoint + "/getAltriBeniServizi", filter);
    return res.data;
  },
};
