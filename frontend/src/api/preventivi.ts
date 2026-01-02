// src/api/preventivi.ts
import { api } from "@/api/index";

export const PreventiviAPI = {
    list: async () => (await api.get("/api/preventivi")).data,
    prospects: async () => (await api.get("/api/prospects")).data,
    parametri: async () => (await api.get("/api/parametri")).data,
    parametriCostiUnitari: async () => (await api.get("/api/parametri-costi-unitari")).data,
    costiRetroilluminazione: async () => (await api.get("/api/costi-retroilluminazione")).data,

    marginalitaProspect: async () => (await api.get("/api/marginalita-per-prospect")).data,

    accessoriStand: async () => (await api.get("/api/listini/accessori-stand")).data,
    accessoriDesk: async () => (await api.get("/api/listini/accessori-desk")).data,
    accessoriEspositori: async () => (await api.get("/api/listini/accessori-espositori")).data,

    costiStrutturaDesk: async () => (await api.get("/api/costi/struttura-desk-layout")).data,
    layoutCostsEspositori: async () => (await api.get("/api/costi/struttura-espositori-layout")).data,

    preventivoServizi: async (id: string) => (await api.get(`/api/preventivi/${id}/servizi`)).data,
    altriBeniServizi: async (id: string) => (await api.get(`/api/preventivi/${id}/altri-beni-servizi`)).data,

    serviceCosts: async () => (await api.get(`/api/parametri-costi-unitari/service-costs`)).data,
};
