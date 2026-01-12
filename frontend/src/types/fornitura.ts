export interface CondizioniStandardFornituraBean {
    id: string;
    voce: string;
    testoStandard: string;
    ordine: number;
    attivo: boolean;
}

export interface CondizioniFornituraPreventiviBean {
    id: string;
    preventivoId: string;
    voce: string;
    testo: string;
    selezionato: boolean;
    ordine: number;
    attivo: boolean;
}
