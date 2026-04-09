import {ProspectBean} from "@/types/prospect.ts";
import {AbstractSearchRequestBean} from "@/types/index.ts";
import {ParametriBean} from "@/types/parametri.ts";

export type PreventivoSectionKey =
    | 'stand'
    | 'storage'
    | 'desk'
    | 'espositori'
    | 'servizi'
    | 'altriBeniServizi'
    | 'condizioniFornitura';

export interface LayoutDeskBean {
    layout: string;
    quantity: number;
}
export interface PreventivoBean {
    id: string;
    prospect?: Partial<ProspectBean>;
    numeroPreventivo: string;
    titolo: string;
    descrizione: string;

    larghezza: number;
    altezza: number;
    profondita: number;

    costoMq: number;
    costoMc: number;
    costoFisso: number;

    status: string;
    dataScadenza: string;
    note: string;

    createdAt: string;
    updatedAt: string;
    coefficienteNoleggio: ParametriBean;

    layout: string;
    distribuzione: number;
    complessita: string;

    superficieStampa: number;
    sviluppoLineare: number;
    numeroPezzi: number;

    costoStruttura: number;
    costoGrafica: number;
    costoPremontaggio: number;
    costoTotale: number;
    totale: number;

    bifaccialita: number;
    retroilluminazione: number;

    larghezzaStorage: number;
    profonditaStorage: number;
    altezzaStorage: number;
    layoutStorage: string;

    numeroPorte: string;
    deskQta: number;
    layoutDesk: LayoutDeskBean[];

    portaScorrevole: number;
    ripianoSuperiore: number;
    ripianoInferiore: number;
    tecaPlexiglass: number;
    fronteLuminoso: number;
    borsa: number;

    superficieStampaStorage: number;
    sviluppoMetriLineariStorage: number;
    numeroPezziStorage: number;

    superficieStampaDesk: number;
    numeroPezziDesk: number;

    espositoriConfig: string;
    complementiConfig: string;

    borsaStandard: number;
    bauleTrolley: number;
    staffaMonitor: number;
    mensola: number;
    spotLight: number;
    kitFaro50w: number;
    kitFaro100w: number;
    quadroElettrico16a: number;
    nicchia: number;
    pedana: number;

    qtaTipo30: number;
    qtaTipo50: number;
    qtaTipo100: number;

    numeroPezziEspositori: number;
    superficieStampaEspositori: number;

    ripiano30x30: number;
    ripiano50x50: number;
    ripiano100x50: number;

    tecaPlexiglass30x30x30: number;
    tecaPlexiglass50x50x50: number;
    tecaPlexiglass100x50x30: number;

    retroilluminazione30x30x100h: number;
    retroilluminazione50x50x100h: number;
    retroilluminazione100x50x100h: number;

    servizioMontaggioSmontaggio: boolean;
    servizioCertificazioni: boolean;
    servizioIstruzioniAssistenza: boolean;

    extraPercComplex: number;
    extraStandComplesso: number;
    costoRetroilluminazione: number;

    accessoriStandConfig: string;

    borsaEspositori: number;
    premontaggio: boolean;
    premontaggioStorage: boolean;
    premontaggioDesk: boolean;
    premontaggioEspositori: boolean;

    graficaCordinoAttiva: boolean;
    graficaStorageAttiva: boolean;
    scontoStrutturaGlobale: number;
    scontoGraficaGlobale: number;
    scontoRetroilluminazioneGlobale: number;
    scontoAccessoriGlobale: number;
    scontoPremontaggiGlobale: number;
    scontoServiziGlobale: number;
    scontoAltriBeniGlobale: number;
    scontoStrutturaTerra: number;
    scontoGraficaCordino: number;
    scontoRetroilluminazione: number;
    scontoAccessoriVendita: number;
    scontoAccessoriNoleggio: number;
    scontoPremontaggio: number;
    scontoExtraStandComplesso: number;

    marginalitaStrutturaStorage: number;
    marginalitaGraficaStorage: number;
    marginalitaPremontaggioStorage: number;
    scontoStrutturaStorage: number;
    scontoGraficaStorage: number;
    scontoPremontaggioStorage: number;

    marginalitaStrutturaDesk: number;
    marginalitaGraficaDesk: number;
    marginalitaPremontaggioDesk: number;
    marginalitaAccessoriDesk: number;

    marginalitaStrutturaEspositori: number;
    marginalitaGraficaEspositori: number;
    marginalitaPremontaggioEspositori: number;
    marginalitaAccessoriEspositori: number;

    totalePreventivo: number;
    totaleCosti: number;
}

export interface ListinoAccessoriRequestBean extends AbstractSearchRequestBean {
    attivo?: boolean;
    preventivoId?: string
    parametri?: string[];
}
