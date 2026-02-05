// src/api/preventivo.ts
import {api} from "@/api/index";
import {
  ListinoAccessoriRequestBean, PreventivoBean
} from "@/types/preventivo.ts";
import {AltriBeniServiziBean, CostiRetroilluminazioneBean} from "@/types/parametri.ts";

const entryPoint = "/preventivi";

export const PreventiviAPI = {
  getPreventiviList: async (): Promise<PreventivoBean[]> => {
    const res = await api.get(entryPoint + '/getPreventiviList');
    return res.data;
  },
};
