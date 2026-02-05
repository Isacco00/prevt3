// src/api/preventivo.ts
import {api} from "@/api/index";
import {
  ListinoAccessoriRequestBean,
} from "@/types/preventivo.ts";
import {
  CondizioniFornituraPreventiviBean,
  CondizioniStandardFornituraBean
} from "@/types/fornitura.ts";

const entryPoint = "/fornitura";

export const FornituraAPI = {
  getCondizioniStandardFornitura: async (filter: ListinoAccessoriRequestBean = {}): Promise<CondizioniStandardFornituraBean[]> => {
    const res = await api.post(entryPoint + "/getCondizioniStandardFornitura", filter);
    return res.data;
  },
  getCondizioniFornituraPreventivi: async (filter: ListinoAccessoriRequestBean = {}): Promise<CondizioniFornituraPreventiviBean[]> => {
    const res = await api.post(entryPoint + "/getCondizioniFornituraPreventivi", filter);
    return res.data;
  },
  saveCondizioniFornituraPreventivi: async (objects: CondizioniFornituraPreventiviBean[] = []): Promise<CondizioniFornituraPreventiviBean[]> => {
    const res = await api.post(entryPoint + "/saveCondizioniFornituraPreventivi", objects);
    return res.data;
  },
};
