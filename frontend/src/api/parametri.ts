// src/api/preventivo.ts
import {api} from "@/api/index";
import {ParametriBean, ParametriRequestBean} from "@/types/parametri.ts";

const entryPoint = "/parametri";

export const ParametriAPI = {

  getParametriList: async (filter: ParametriRequestBean = {}): Promise<ParametriBean[]> => {
    const res = await api.post(entryPoint + "/getParametriList", filter);
    return res.data;
  },

  saveParametro: async (parametro: ParametriBean): Promise<ParametriBean> => {
    const {data} = await api.post<ParametriBean>(
        entryPoint + "/saveParametro",
        parametro
    );
    return data;
  }

};
