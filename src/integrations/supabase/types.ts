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
      altri_beni_servizi: {
        Row: {
          costo_unitario: number
          created_at: string
          descrizione: string
          id: string
          marginalita: number
          preventivo_id: string
          prezzo_unitario: number
          quantita: number
          totale: number
          updated_at: string
        }
        Insert: {
          costo_unitario?: number
          created_at?: string
          descrizione?: string
          id?: string
          marginalita?: number
          preventivo_id: string
          prezzo_unitario?: number
          quantita?: number
          totale?: number
          updated_at?: string
        }
        Update: {
          costo_unitario?: number
          created_at?: string
          descrizione?: string
          id?: string
          marginalita?: number
          preventivo_id?: string
          prezzo_unitario?: number
          quantita?: number
          totale?: number
          updated_at?: string
        }
        Relationships: []
      }
      costi_extra_trasf_mont: {
        Row: {
          attivo: boolean
          costo_extra_mont: number
          created_at: string
          id: string
          livello: string
          updated_at: string
        }
        Insert: {
          attivo?: boolean
          costo_extra_mont?: number
          created_at?: string
          id?: string
          livello: string
          updated_at?: string
        }
        Update: {
          attivo?: boolean
          costo_extra_mont?: number
          created_at?: string
          id?: string
          livello?: string
          updated_at?: string
        }
        Relationships: []
      }
      costi_retroilluminazione: {
        Row: {
          altezza: number
          costo_al_metro: number
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          altezza: number
          costo_al_metro: number
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          altezza?: number
          costo_al_metro?: number
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      costi_struttura_desk_layout: {
        Row: {
          attivo: boolean
          costo_unitario: number
          created_at: string
          id: string
          layout_desk: string
          updated_at: string
        }
        Insert: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          layout_desk: string
          updated_at?: string
        }
        Update: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          layout_desk?: string
          updated_at?: string
        }
        Relationships: []
      }
      costi_struttura_espositori_layout: {
        Row: {
          attivo: boolean
          costo_unitario: number
          created_at: string
          id: string
          layout_espositore: string
          updated_at: string
        }
        Insert: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          layout_espositore: string
          updated_at?: string
        }
        Update: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          layout_espositore?: string
          updated_at?: string
        }
        Relationships: []
      }
      costi_volo_ar: {
        Row: {
          attivo: boolean
          costo_volo_ar: number
          created_at: string
          id: string
          tipologia: string
          updated_at: string
        }
        Insert: {
          attivo?: boolean
          costo_volo_ar?: number
          created_at?: string
          id?: string
          tipologia: string
          updated_at?: string
        }
        Update: {
          attivo?: boolean
          costo_volo_ar?: number
          created_at?: string
          id?: string
          tipologia?: string
          updated_at?: string
        }
        Relationships: []
      }
      listino_accessori_desk: {
        Row: {
          attivo: boolean
          costo_unitario: number
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      listino_accessori_espositori: {
        Row: {
          attivo: boolean
          costo_unitario: number
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      listino_accessori_stand: {
        Row: {
          attivo: boolean
          costo_unitario: number
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          attivo?: boolean
          costo_unitario?: number
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      marginalita_per_prospect: {
        Row: {
          attivo: boolean
          created_at: string
          id: string
          marginalita: number
          tipo_prospect: string
          updated_at: string
        }
        Insert: {
          attivo?: boolean
          created_at?: string
          id?: string
          marginalita?: number
          tipo_prospect: string
          updated_at?: string
        }
        Update: {
          attivo?: boolean
          created_at?: string
          id?: string
          marginalita?: number
          tipo_prospect?: string
          updated_at?: string
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
          valore?: number | null
          valore_chiave?: string | null
          valore_testo?: string | null
        }
        Relationships: []
      }
      parametri_a_costi_unitari: {
        Row: {
          attivo: boolean
          created_at: string
          id: string
          parametro: string
          unita_misura: string
          updated_at: string
          valore: number
        }
        Insert: {
          attivo?: boolean
          created_at?: string
          id?: string
          parametro: string
          unita_misura: string
          updated_at?: string
          valore?: number
        }
        Update: {
          attivo?: boolean
          created_at?: string
          id?: string
          parametro?: string
          unita_misura?: string
          updated_at?: string
          valore?: number
        }
        Relationships: []
      }
      preventivi: {
        Row: {
          accessori_stand_config: string | null
          alt_storage: number | null
          altezza: number
          baule_trolley: number | null
          bifaccialita: number | null
          borsa: number | null
          borsa_espositori: number | null
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
          marginalita_accessori: number | null
          marginalita_accessori_desk: number | null
          marginalita_accessori_espositori: number | null
          marginalita_grafica: number | null
          marginalita_grafica_desk: number | null
          marginalita_grafica_espositori: number | null
          marginalita_grafica_storage: number | null
          marginalita_premontaggio: number | null
          marginalita_premontaggio_desk: number | null
          marginalita_premontaggio_espositori: number | null
          marginalita_premontaggio_storage: number | null
          marginalita_retroilluminazione: number | null
          marginalita_struttura: number | null
          marginalita_struttura_desk: number | null
          marginalita_struttura_espositori: number | null
          marginalita_struttura_storage: number | null
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
          premontaggio: boolean | null
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
          accessori_stand_config?: string | null
          alt_storage?: number | null
          altezza: number
          baule_trolley?: number | null
          bifaccialita?: number | null
          borsa?: number | null
          borsa_espositori?: number | null
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
          marginalita_accessori?: number | null
          marginalita_accessori_desk?: number | null
          marginalita_accessori_espositori?: number | null
          marginalita_grafica?: number | null
          marginalita_grafica_desk?: number | null
          marginalita_grafica_espositori?: number | null
          marginalita_grafica_storage?: number | null
          marginalita_premontaggio?: number | null
          marginalita_premontaggio_desk?: number | null
          marginalita_premontaggio_espositori?: number | null
          marginalita_premontaggio_storage?: number | null
          marginalita_retroilluminazione?: number | null
          marginalita_struttura?: number | null
          marginalita_struttura_desk?: number | null
          marginalita_struttura_espositori?: number | null
          marginalita_struttura_storage?: number | null
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
          premontaggio?: boolean | null
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
          accessori_stand_config?: string | null
          alt_storage?: number | null
          altezza?: number
          baule_trolley?: number | null
          bifaccialita?: number | null
          borsa?: number | null
          borsa_espositori?: number | null
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
          marginalita_accessori?: number | null
          marginalita_accessori_desk?: number | null
          marginalita_accessori_espositori?: number | null
          marginalita_grafica?: number | null
          marginalita_grafica_desk?: number | null
          marginalita_grafica_espositori?: number | null
          marginalita_grafica_storage?: number | null
          marginalita_premontaggio?: number | null
          marginalita_premontaggio_desk?: number | null
          marginalita_premontaggio_espositori?: number | null
          marginalita_premontaggio_storage?: number | null
          marginalita_retroilluminazione?: number | null
          marginalita_struttura?: number | null
          marginalita_struttura_desk?: number | null
          marginalita_struttura_espositori?: number | null
          marginalita_struttura_storage?: number | null
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
          premontaggio?: boolean | null
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
      preventivi_servizi: {
        Row: {
          certificazioni: boolean | null
          conseg_cant: boolean | null
          costo_orario_mont: number | null
          costo_orario_smon: number | null
          created_at: string
          extra_costi_trasferta_mont: string | null
          extra_costi_trasferta_smon: string | null
          extra_km_trasp_furg_mont: number | null
          extra_km_trasp_furg_smon: number | null
          extra_km_trasp_tir_mont: number | null
          extra_km_trasp_tir_smon: number | null
          giorni_montaggio: number | null
          giorni_smontaggio_viaggio: number | null
          id: string
          istruzioni_assistenza: boolean | null
          km_ar_mont: number | null
          km_ar_smon: number | null
          montaggio_smontaggio: boolean | null
          num_alloggi: number | null
          num_alloggi_smon: number | null
          num_vitti: number | null
          num_vitti_smon: number | null
          ore_lavoro_cantxper_mont: number | null
          ore_lavoro_cantxper_smon: number | null
          ore_viaggio_trasferta_mont: number | null
          ore_viaggio_trasferta_smon: number | null
          personale_mont: number | null
          personale_smon: number | null
          preventivo_id: string
          preventivo_montaggio: number | null
          preventivo_smontaggio: number | null
          ricarico_montaggio: number | null
          tot_cost_km_mont: number | null
          tot_cost_km_smon: number | null
          tot_cost_ore_mont: number | null
          tot_cost_ore_smon: number | null
          tot_cost_vittall: number | null
          tot_cost_vittall_smon: number | null
          tot_costi_auto: number | null
          tot_costi_auto_smon: number | null
          tot_costi_consegna_cantiere: number | null
          tot_costi_extra_km_trasp_furg_mont: number | null
          tot_costi_extra_km_trasp_furg_smon: number | null
          tot_costi_extra_km_trasp_tir_mont: number | null
          tot_costi_extra_km_trasp_tir_smon: number | null
          tot_costi_extra_trasf_mont: number | null
          tot_costi_extra_trasf_smon: number | null
          tot_costo_trasf_pers: number | null
          tot_costo_trasf_pers_smon: number | null
          tot_costo_treno: number | null
          tot_costo_treno_smon: number | null
          tot_costo_volo_ar: number | null
          tot_costo_volo_ar_smon: number | null
          totale_costo_montaggio: number | null
          totale_costo_smontaggio: number | null
          treno_mont: boolean | null
          treno_smon: boolean | null
          updated_at: string
          viaggio_auto_com_mont: boolean | null
          viaggio_auto_com_smon: boolean | null
          volo_mont: string | null
          volo_smon: string | null
        }
        Insert: {
          certificazioni?: boolean | null
          conseg_cant?: boolean | null
          costo_orario_mont?: number | null
          costo_orario_smon?: number | null
          created_at?: string
          extra_costi_trasferta_mont?: string | null
          extra_costi_trasferta_smon?: string | null
          extra_km_trasp_furg_mont?: number | null
          extra_km_trasp_furg_smon?: number | null
          extra_km_trasp_tir_mont?: number | null
          extra_km_trasp_tir_smon?: number | null
          giorni_montaggio?: number | null
          giorni_smontaggio_viaggio?: number | null
          id?: string
          istruzioni_assistenza?: boolean | null
          km_ar_mont?: number | null
          km_ar_smon?: number | null
          montaggio_smontaggio?: boolean | null
          num_alloggi?: number | null
          num_alloggi_smon?: number | null
          num_vitti?: number | null
          num_vitti_smon?: number | null
          ore_lavoro_cantxper_mont?: number | null
          ore_lavoro_cantxper_smon?: number | null
          ore_viaggio_trasferta_mont?: number | null
          ore_viaggio_trasferta_smon?: number | null
          personale_mont?: number | null
          personale_smon?: number | null
          preventivo_id: string
          preventivo_montaggio?: number | null
          preventivo_smontaggio?: number | null
          ricarico_montaggio?: number | null
          tot_cost_km_mont?: number | null
          tot_cost_km_smon?: number | null
          tot_cost_ore_mont?: number | null
          tot_cost_ore_smon?: number | null
          tot_cost_vittall?: number | null
          tot_cost_vittall_smon?: number | null
          tot_costi_auto?: number | null
          tot_costi_auto_smon?: number | null
          tot_costi_consegna_cantiere?: number | null
          tot_costi_extra_km_trasp_furg_mont?: number | null
          tot_costi_extra_km_trasp_furg_smon?: number | null
          tot_costi_extra_km_trasp_tir_mont?: number | null
          tot_costi_extra_km_trasp_tir_smon?: number | null
          tot_costi_extra_trasf_mont?: number | null
          tot_costi_extra_trasf_smon?: number | null
          tot_costo_trasf_pers?: number | null
          tot_costo_trasf_pers_smon?: number | null
          tot_costo_treno?: number | null
          tot_costo_treno_smon?: number | null
          tot_costo_volo_ar?: number | null
          tot_costo_volo_ar_smon?: number | null
          totale_costo_montaggio?: number | null
          totale_costo_smontaggio?: number | null
          treno_mont?: boolean | null
          treno_smon?: boolean | null
          updated_at?: string
          viaggio_auto_com_mont?: boolean | null
          viaggio_auto_com_smon?: boolean | null
          volo_mont?: string | null
          volo_smon?: string | null
        }
        Update: {
          certificazioni?: boolean | null
          conseg_cant?: boolean | null
          costo_orario_mont?: number | null
          costo_orario_smon?: number | null
          created_at?: string
          extra_costi_trasferta_mont?: string | null
          extra_costi_trasferta_smon?: string | null
          extra_km_trasp_furg_mont?: number | null
          extra_km_trasp_furg_smon?: number | null
          extra_km_trasp_tir_mont?: number | null
          extra_km_trasp_tir_smon?: number | null
          giorni_montaggio?: number | null
          giorni_smontaggio_viaggio?: number | null
          id?: string
          istruzioni_assistenza?: boolean | null
          km_ar_mont?: number | null
          km_ar_smon?: number | null
          montaggio_smontaggio?: boolean | null
          num_alloggi?: number | null
          num_alloggi_smon?: number | null
          num_vitti?: number | null
          num_vitti_smon?: number | null
          ore_lavoro_cantxper_mont?: number | null
          ore_lavoro_cantxper_smon?: number | null
          ore_viaggio_trasferta_mont?: number | null
          ore_viaggio_trasferta_smon?: number | null
          personale_mont?: number | null
          personale_smon?: number | null
          preventivo_id?: string
          preventivo_montaggio?: number | null
          preventivo_smontaggio?: number | null
          ricarico_montaggio?: number | null
          tot_cost_km_mont?: number | null
          tot_cost_km_smon?: number | null
          tot_cost_ore_mont?: number | null
          tot_cost_ore_smon?: number | null
          tot_cost_vittall?: number | null
          tot_cost_vittall_smon?: number | null
          tot_costi_auto?: number | null
          tot_costi_auto_smon?: number | null
          tot_costi_consegna_cantiere?: number | null
          tot_costi_extra_km_trasp_furg_mont?: number | null
          tot_costi_extra_km_trasp_furg_smon?: number | null
          tot_costi_extra_km_trasp_tir_mont?: number | null
          tot_costi_extra_km_trasp_tir_smon?: number | null
          tot_costi_extra_trasf_mont?: number | null
          tot_costi_extra_trasf_smon?: number | null
          tot_costo_trasf_pers?: number | null
          tot_costo_trasf_pers_smon?: number | null
          tot_costo_treno?: number | null
          tot_costo_treno_smon?: number | null
          tot_costo_volo_ar?: number | null
          tot_costo_volo_ar_smon?: number | null
          totale_costo_montaggio?: number | null
          totale_costo_smontaggio?: number | null
          treno_mont?: boolean | null
          treno_smon?: boolean | null
          updated_at?: string
          viaggio_auto_com_mont?: boolean | null
          viaggio_auto_com_smon?: boolean | null
          volo_mont?: string | null
          volo_smon?: string | null
        }
        Relationships: []
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
          tipo_prospect: string | null
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
          tipo_prospect?: string | null
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
          tipo_prospect?: string | null
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
