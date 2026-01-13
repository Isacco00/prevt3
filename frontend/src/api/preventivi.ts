// src/api/preventivo.ts
import {api} from "@/api/index";
import {
  ListinoAccessoriRequestBean, PreventivoBean
} from "@/types/preventivo.ts";
import {CostiRetroilluminazioneBean} from "@/types/parametri.ts";

const entryPoint = "/preventivi";

export const PreventiviAPI = {
  getPreventiviList: async (): Promise<PreventivoBean[]> => {
    const res = await api.get(entryPoint + '/getPreventiviList');
    return res.data;
  },
  getAltriBeniServizi: async (filter: ListinoAccessoriRequestBean = {}): Promise<CostiRetroilluminazioneBean[]> => {
    const res = await api.post(entryPoint + "/getAltriBeniServizi", filter);
    return res.data;
  },
};
