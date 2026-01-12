export interface ProspectBean {
    id: string;
    userId: string;
    ragioneSociale: string;
    partitaIva: string;
    codiceFiscale?: string;
    indirizzo: string;
    citta: string;
    cap: string;
    provincia: string;
    telefono?: string;
    email?: string;
    tipo: 'prospect' | 'cliente';
    tipo_prospect?: 'Professional' | 'Finale';
    createdAt: string;
    updatedAt: string;
}
