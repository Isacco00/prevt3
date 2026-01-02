import {ProspectBean} from "@/types/prospects";

interface Prospect {
    id: string;
    userId: string;
    ragione_sociale: string;
    partita_iva: string;
    codice_fiscale?: string;
    indirizzo: string;
    citta: string;
    cap: string;
    provincia: string;
    telefono?: string;
    email?: string;
    tipo: 'prospect' | 'cliente';
    tipo_prospect?: 'Professional' | 'Finale';
    created_at: string;
    updated_at: string;
}
