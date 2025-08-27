export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      costi_retroilluminazione: {
        Row: {
          altezza: number
          costo_al_metro: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          altezza: number
          costo_al_metro: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          altezza?: number
          costo_al_metro?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parametri: {
        Row: {
          attivo: boolean
          created_at: string
          descrizione: string | null
          id: string
          nome: string
          ordine: number | null
          tipo: string
          updated_at: string
          user_id: string
          valore: number | null
          valore_chiave: string | null
          valore_testo: string | null
        }
        Insert: {
          attivo?: boolean
          created_at?: string
          descrizione?: string | null
          id?: string
          nome: string
          ordine?: number | null
          tipo: string
          updated_at?: string
          user_id: string
          valore?: number | null
          valore_chiave?: string | null
          valore_testo?: string | null
        }
        Update: {
          attivo?: boolean
          created_at?: string
          descrizione?: string | null
          id?: string
          nome?: string
          ordine?: number | null
          tipo?: string
          updated_at?: string
          user_id?: string
          valore?: number | null
          valore_chiave?: string | null
          valore_testo?: string | null
        }
        Relationships: []
      }
      preventivi: {
        Row: {
          alt_storage: number | null
          altezza: number
          baule_trolley: number | null
          bifaccialita: number | null
          borsa: number | null
          borsa_stand: number | null
          complementi_config: string | null
          complessita: string | null
          costo_fisso: number
          costo_grafica: number | null
          costo_mc: number
          costo_mq: number
          costo_premontaggio: number | null
          costo_retroilluminazione: number | null
          costo_struttura: number | null
          costo_totale: number | null
          created_at: string
          data_scadenza: string | null
          descrizione: string | null
          desk_qta: number | null
          distribuzione: number | null
          espositori_config: string | null
          extra_perc_complex: number | null
          extra_stand_complesso: number | null
          fronte_luminoso: number | null
          id: string
          kit_faro_100w: number | null
          kit_faro_50w: number | null
          larg_storage: number | null
          larghezza: number
          layout: string | null
          layout_desk: string | null
          layout_storage: string | null
          mensola: number | null
          nicchia: number | null
          note: string | null
          numero_pezzi: number | null
          numero_pezzi_desk: number | null
          numero_pezzi_espositori: number | null
          numero_pezzi_storage: number | null
          numero_porte: string | null
          numero_preventivo: string
          pedana: number | null
          porta_scorrevole: number | null
          prof_storage: number | null
          profondita: number | null
          prospect_id: string | null
          qta_tipo100: number | null
          qta_tipo30: number | null
          qta_tipo50: number | null
          quadro_elettrico_16a: number | null
          retroilluminazione: number | null
          retroilluminazione_100x50x100h: number | null
          retroilluminazione_30x30x100h: number | null
          retroilluminazione_50x50x100h: number | null
          ripiano_100x50: number | null
          ripiano_30x30: number | null
          ripiano_50x50: number | null
          ripiano_inferiore: number | null
          ripiano_superiore: number | null
          servizio_certificazioni: boolean | null
          servizio_istruzioni_assistenza: boolean | null
          servizio_montaggio_smontaggio: boolean | null
          spot_light: number | null
          staffa_monitor: number | null
          status: string
          superficie_stampa: number | null
          superficie_stampa_desk: number | null
          superficie_stampa_espositori: number | null
          superficie_stampa_storage: number | null
          sviluppo_lineare: number | null
          sviluppo_metri_lineari_storage: number | null
          teca_plexiglass: number | null
          teca_plexiglass_100x50x30: number | null
          teca_plexiglass_30x30x30: number | null
          teca_plexiglass_50x50x50: number | null
          titolo: string
          totale: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alt_storage?: number | null
          altezza: number
          baule_trolley?: number | null
          bifaccialita?: number | null
          borsa?: number | null
          borsa_stand?: number | null
          complementi_config?: string | null
          complessita?: string | null
          costo_fisso?: number
          costo_grafica?: number | null
          costo_mc?: number
          costo_mq?: number
          costo_premontaggio?: number | null
          costo_retroilluminazione?: number | null
          costo_struttura?: number | null
          costo_totale?: number | null
          created_at?: string
          data_scadenza?: string | null
          descrizione?: string | null
          desk_qta?: number | null
          distribuzione?: number | null
          espositori_config?: string | null
          extra_perc_complex?: number | null
          extra_stand_complesso?: number | null
          fronte_luminoso?: number | null
          id?: string
          kit_faro_100w?: number | null
          kit_faro_50w?: number | null
          larg_storage?: number | null
          larghezza: number
          layout?: string | null
          layout_desk?: string | null
          layout_storage?: string | null
          mensola?: number | null
          nicchia?: number | null
          note?: string | null
          numero_pezzi?: number | null
          numero_pezzi_desk?: number | null
          numero_pezzi_espositori?: number | null
          numero_pezzi_storage?: number | null
          numero_porte?: string | null
          numero_preventivo: string
          pedana?: number | null
          porta_scorrevole?: number | null
          prof_storage?: number | null
          profondita?: number | null
          prospect_id?: string | null
          qta_tipo100?: number | null
          qta_tipo30?: number | null
          qta_tipo50?: number | null
          quadro_elettrico_16a?: number | null
          retroilluminazione?: number | null
          retroilluminazione_100x50x100h?: number | null
          retroilluminazione_30x30x100h?: number | null
          retroilluminazione_50x50x100h?: number | null
          ripiano_100x50?: number | null
          ripiano_30x30?: number | null
          ripiano_50x50?: number | null
          ripiano_inferiore?: number | null
          ripiano_superiore?: number | null
          servizio_certificazioni?: boolean | null
          servizio_istruzioni_assistenza?: boolean | null
          servizio_montaggio_smontaggio?: boolean | null
          spot_light?: number | null
          staffa_monitor?: number | null
          status?: string
          superficie_stampa?: number | null
          superficie_stampa_desk?: number | null
          superficie_stampa_espositori?: number | null
          superficie_stampa_storage?: number | null
          sviluppo_lineare?: number | null
          sviluppo_metri_lineari_storage?: number | null
          teca_plexiglass?: number | null
          teca_plexiglass_100x50x30?: number | null
          teca_plexiglass_30x30x30?: number | null
          teca_plexiglass_50x50x50?: number | null
          titolo: string
          totale?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alt_storage?: number | null
          altezza?: number
          baule_trolley?: number | null
          bifaccialita?: number | null
          borsa?: number | null
          borsa_stand?: number | null
          complementi_config?: string | null
          complessita?: string | null
          costo_fisso?: number
          costo_grafica?: number | null
          costo_mc?: number
          costo_mq?: number
          costo_premontaggio?: number | null
          costo_retroilluminazione?: number | null
          costo_struttura?: number | null
          costo_totale?: number | null
          created_at?: string
          data_scadenza?: string | null
          descrizione?: string | null
          desk_qta?: number | null
          distribuzione?: number | null
          espositori_config?: string | null
          extra_perc_complex?: number | null
          extra_stand_complesso?: number | null
          fronte_luminoso?: number | null
          id?: string
          kit_faro_100w?: number | null
          kit_faro_50w?: number | null
          larg_storage?: number | null
          larghezza?: number
          layout?: string | null
          layout_desk?: string | null
          layout_storage?: string | null
          mensola?: number | null
          nicchia?: number | null
          note?: string | null
          numero_pezzi?: number | null
          numero_pezzi_desk?: number | null
          numero_pezzi_espositori?: number | null
          numero_pezzi_storage?: number | null
          numero_porte?: string | null
          numero_preventivo?: string
          pedana?: number | null
          porta_scorrevole?: number | null
          prof_storage?: number | null
          profondita?: number | null
          prospect_id?: string | null
          qta_tipo100?: number | null
          qta_tipo30?: number | null
          qta_tipo50?: number | null
          quadro_elettrico_16a?: number | null
          retroilluminazione?: number | null
          retroilluminazione_100x50x100h?: number | null
          retroilluminazione_30x30x100h?: number | null
          retroilluminazione_50x50x100h?: number | null
          ripiano_100x50?: number | null
          ripiano_30x30?: number | null
          ripiano_50x50?: number | null
          ripiano_inferiore?: number | null
          ripiano_superiore?: number | null
          servizio_certificazioni?: boolean | null
          servizio_istruzioni_assistenza?: boolean | null
          servizio_montaggio_smontaggio?: boolean | null
          spot_light?: number | null
          staffa_monitor?: number | null
          status?: string
          superficie_stampa?: number | null
          superficie_stampa_desk?: number | null
          superficie_stampa_espositori?: number | null
          superficie_stampa_storage?: number | null
          sviluppo_lineare?: number | null
          sviluppo_metri_lineari_storage?: number | null
          teca_plexiglass?: number | null
          teca_plexiglass_100x50x30?: number | null
          teca_plexiglass_30x30x30?: number | null
          teca_plexiglass_50x50x50?: number | null
          titolo?: string
          totale?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preventivi_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prospects: {
        Row: {
          cap: string | null
          citta: string | null
          codice_fiscale: string | null
          created_at: string
          email: string | null
          id: string
          indirizzo: string | null
          partita_iva: string
          provincia: string | null
          ragione_sociale: string
          telefono: string | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cap?: string | null
          citta?: string | null
          codice_fiscale?: string | null
          created_at?: string
          email?: string | null
          id?: string
          indirizzo?: string | null
          partita_iva: string
          provincia?: string | null
          ragione_sociale: string
          telefono?: string | null
          tipo?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cap?: string | null
          citta?: string | null
          codice_fiscale?: string | null
          created_at?: string
          email?: string | null
          id?: string
          indirizzo?: string | null
          partita_iva?: string
          provincia?: string | null
          ragione_sociale?: string
          telefono?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_by_admin: {
        Args: {
          email: string
          first_name: string
          last_name: string
          password: string
          user_role?: string
        }
        Returns: string
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
