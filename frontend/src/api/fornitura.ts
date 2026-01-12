// src/api/preventivo.ts
import {api} from "@/api/index";
import {
    CostiRetroilluminazioneBean,
    CostiStrutturaDeskBean,
    ListinoAccessoriDeskBean,
    ListinoAccessoriRequestBean, ListinoAccessoriStandBean, ParametriACostiUnitariBean, ParametriBean,
    PreventivoBean
} from "@/types/preventivo.ts";
import {CondizioniFornituraPreventiviBean, CondizioniStandardFornituraBean} from "@/types/fornitura.ts";

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
};
