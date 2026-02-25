type SortableColumn =
    'LISTINO_ACCESSORI_DESK_NAME'
    | 'LISTINO_ACCESSORI_STAND_NAME'
    | 'PARAMETRI_COSTI_UNITARI_PARAMETRO'
    | 'PARAMETRI_COSTI_RETROILLUMINAZIONE_ALTEZZA'
    | 'COSTI_STRUTTURA_ESPOSITORI_LAYOUT_ESPOSITORE'
    | 'LISTINO_ACCESSORI_ESPOSITORI_NOME'
    | 'CONDIZIONI_STANDARD_FORNITURA_ORDINE'
    | 'CONDIZIONI_FORNITURA_PREVENTIVI_ORDINE'
    | 'ALTRI_BENI_SERVIZI_CREATED_AT'
    | 'USER_LIST_CREATED_AT'
    | 'PARAMETRI_TIPO'
    | 'PARAMETRI_ORDINE'
    | 'PARAMETRI_NOME'
    | 'PARAMETRI_VALORE';

export interface SortableFieldBean {
    field: SortableColumn;
    desc: boolean;
}

export interface AbstractSearchRequestBean {
    firstResult?: number;
    maxResult?: number;
    sortFields?: SortableFieldBean[];
}

export type ISODateString = string;
