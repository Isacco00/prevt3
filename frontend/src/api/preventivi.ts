// src/api/preventivo.ts
import {api} from "@/api/index";
import {
  ListinoAccessoriRequestBean, PreventivoBean
} from "@/types/preventivo.ts";
import {AltriBeniServiziBean, CostiRetroilluminazioneBean} from "@/types/parametri.ts";
import {ProspectBean} from "@/types/prospect.ts";

const entryPoint = "/preventivi";

export const PreventiviAPI = {
  getPreventiviList: async (): Promise<PreventivoBean[]> => {
    const res = await api.get(entryPoint + '/getPreventiviList');
    return res.data;
  },
  savePreventivo: async (data: PreventivoBean): Promise<PreventivoBean[]> => {
    const res = await api.post(entryPoint + '/savePreventivo', data);
    return res.data;
  },
  getPreventivoDetail: async (preventivoId: string): Promise<PreventivoBean> => {
    const res = await api.get(`${entryPoint}/getPreventivoDetail/${preventivoId}`);
    return res.data;
  },
  deletePreventivo: async (preventivoId: string): Promise<void> => {
    await api.delete(`${entryPoint}/deletePreventivo/${preventivoId}`);
  },
};
