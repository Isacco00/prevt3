package it.prevt.backend.entity;

import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.enumerator.PreventivoStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "preventivo")
public class Preventivo {

  public static final List<PreventivoStatus> STATO_IN_CORSO = List.of(PreventivoStatus.BOZZA,
      PreventivoStatus.INVIATO, PreventivoStatus.ACCETTATO, PreventivoStatus.IN_REVISIONE,
      PreventivoStatus.RIFIUTATO);
  @Id
  @GeneratedValue
  @UuidGenerator
  @Column(nullable = false, updatable = false)
  private UUID id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "prospect_id")
  private Prospect prospect;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "coefficiente_noleggio_id")
  private Parametri coefficienteNoleggio;

  @Column(name = "numero_preventivo", nullable = false)
  private String numeroPreventivo;

  @Column(nullable = false)
  private String titolo;

  private String descrizione;

  @Column(nullable = false)
  private BigDecimal larghezza;

  @Column(nullable = false)
  private BigDecimal altezza;

  @Column(name = "costo_mq", nullable = false)
  private BigDecimal costoMq = BigDecimal.ZERO;

  @Column(name = "costo_mc", nullable = false)
  private BigDecimal costoMc = BigDecimal.ZERO;

  @Column(name = "costo_fisso", nullable = false)
  private BigDecimal costoFisso = BigDecimal.ZERO;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PreventivoStatus status = PreventivoStatus.BOZZA;

  @Column(name = "data_scadenza")
  private LocalDate dataScadenza;

  private String note;

  private BigDecimal profondita;
  private String layout;
  private Integer distribuzione;
  private String complessita;

  @Column(name = "superficie_stampa")
  private BigDecimal superficieStampa;

  @Column(name = "sviluppo_lineare")
  private BigDecimal sviluppoLineare;

  @Column(name = "numero_pezzi")
  private BigDecimal numeroPezzi;

  @Column(name = "costo_struttura")
  private BigDecimal costoStruttura = BigDecimal.ZERO;

  @Column(name = "costo_grafica")
  private BigDecimal costoGrafica = BigDecimal.ZERO;

  @Column(name = "costo_premontaggio")
  private BigDecimal costoPremontaggio = BigDecimal.ZERO;

  @Column(name = "costo_totale")
  private BigDecimal costoTotale = BigDecimal.ZERO;

  private BigDecimal totale = BigDecimal.ZERO;

  private BigDecimal bifaccialita = BigDecimal.ZERO;
  private BigDecimal retroilluminazione = BigDecimal.ZERO;

  @Column(name = "larg_storage")
  private BigDecimal largStorage = BigDecimal.ZERO;

  @Column(name = "prof_storage")
  private BigDecimal profStorage = BigDecimal.ZERO;

  @Column(name = "alt_storage")
  private BigDecimal altStorage = new BigDecimal("2.5");

  @Column(name = "layout_storage")
  private String layoutStorage = "0";

  @Column(name = "numero_porte")
  private String numeroPorte = "0";

  @Column(name = "desk_qta")
  private Integer deskQta = 0;

  @Column(name = "layout_desk")
  private String layoutDesk = "";

  @Column(name = "porta_scorrevole")
  private Integer portaScorrevole = 0;

  @Column(name = "ripiano_superiore")
  private Integer ripianoSuperiore = 0;

  @Column(name = "ripiano_inferiore")
  private Integer ripianoInferiore = 0;

  @Column(name = "teca_plexiglass")
  private Integer tecaPlexiglass = 0;

  @Column(name = "fronte_luminoso")
  private Integer fronteLuminoso = 0;

  private Integer borsa = 0;

  @Column(name = "superficie_stampa_storage")
  private BigDecimal superficieStampaStorage = BigDecimal.ZERO;

  @Column(name = "sviluppo_metri_lineari_storage")
  private BigDecimal sviluppoMetriLineariStorage = BigDecimal.ZERO;

  @Column(name = "numero_pezzi_storage")
  private BigDecimal numeroPezziStorage = BigDecimal.ZERO;

  @Column(name = "superficie_stampa_desk")
  private BigDecimal superficieStampaDesk = BigDecimal.ZERO;

  @Column(name = "numero_pezzi_desk")
  private BigDecimal numeroPezziDesk = BigDecimal.ZERO;

  @Column(name = "espositori_config")
  private String espositoriConfig = "{}";

  @Column(name = "complementi_config")
  private String complementiConfig = "{}";

  @Column(name = "borsa_stand")
  private Integer borsaStand = 0;

  @Column(name = "baule_trolley")
  private Integer bauleTrolley = 0;

  @Column(name = "staffa_monitor")
  private Integer staffaMonitor = 0;

  private Integer mensola = 0;

  @Column(name = "spot_light")
  private Integer spotLight = 0;

  @Column(name = "kit_faro_50w")
  private Integer kitFaro50w = 0;

  @Column(name = "kit_faro_100w")
  private Integer kitFaro100w = 0;

  @Column(name = "quadro_elettrico_16a")
  private Integer quadroElettrico16a = 0;

  private Integer nicchia = 0;
  private Integer pedana = 0;

  @Column(name = "qta_tipo30")
  private Integer qtaTipo30 = 0;

  @Column(name = "qta_tipo50")
  private Integer qtaTipo50 = 0;

  @Column(name = "qta_tipo100")
  private Integer qtaTipo100 = 0;

  @Column(name = "numero_pezzi_espositori")
  private BigDecimal numeroPezziEspositori = BigDecimal.ZERO;

  @Column(name = "superficie_stampa_espositori")
  private BigDecimal superficieStampaEspositori = BigDecimal.ZERO;

  @Column(name = "ripiano_30x30")
  private Integer ripiano30x30 = 0;

  @Column(name = "ripiano_50x50")
  private Integer ripiano50x50 = 0;

  @Column(name = "ripiano_100x50")
  private Integer ripiano100x50 = 0;

  @Column(name = "teca_plexiglass_30x30x30")
  private Integer tecaPlexiglass30x30x30 = 0;

  @Column(name = "teca_plexiglass_50x50x50")
  private Integer tecaPlexiglass50x50x50 = 0;

  @Column(name = "teca_plexiglass_100x50x30")
  private Integer tecaPlexiglass100x50x30 = 0;

  @Column(name = "retroilluminazione_30x30x100h")
  private Integer retroilluminazione30x30x100h = 0;

  @Column(name = "retroilluminazione_50x50x100h")
  private Integer retroilluminazione50x50x100h = 0;

  @Column(name = "retroilluminazione_100x50x100h")
  private Integer retroilluminazione100x50x100h = 0;

  @Column(name = "servizio_montaggio_smontaggio")
  private Boolean servizioMontaggioSmontaggio = false;

  @Column(name = "servizio_certificazioni")
  private Boolean servizioCertificazioni = false;

  @Column(name = "servizio_istruzioni_assistenza")
  private Boolean servizioIstruzioniAssistenza = false;

  @Column(name = "extra_perc_complex")
  private BigDecimal extraPercComplex = BigDecimal.ZERO;

  @Column(name = "extra_stand_complesso")
  private BigDecimal extraStandComplesso = BigDecimal.ZERO;

  @Column(name = "costo_retroilluminazione")
  private BigDecimal costoRetroilluminazione = BigDecimal.ZERO;

  @Column(name = "accessori_stand_config")
  private String accessoriStandConfig = "{}";

  @Column(name = "accessori_desk_config")
  private String accessoriDeskConfig = "{}";

  @Column(name = "borsa_espositori")
  private Integer borsaEspositori = 0;

  private Boolean premontaggio = true;

  @Column(name = "premontaggio_storage")
  private Boolean premontaggioStorage = false;

  @Column(name = "premontaggio_desk")
  private Boolean premontaggioDesk = false;

  @Column(name = "premontaggio_espositori")
  private Boolean premontaggioEspositori = false;

  @Column(name = "sconto_struttura_terra")
  private BigDecimal scontoStrutturaTerra;

  @Column(name = "grafica_cordino_attiva")
  private Boolean graficaCordinoAttiva = false;

  @Column(name = "sconto_grafica_cordino")
  private BigDecimal scontoGraficaCordino = BigDecimal.ZERO;

  @Column(name = "sconto_retroilluminazione")
  private BigDecimal scontoRetroilluminazione = BigDecimal.ZERO;

  @Column(name = "sconto_accessori_vendita")
  private BigDecimal scontoAccessoriVendita = BigDecimal.ZERO;

  @Column(name = "sconto_accessori_noleggio")
  private BigDecimal scontoAccessoriNoleggio = BigDecimal.ZERO;

  @Column(name = "sconto_premontaggio")
  private BigDecimal scontoPremontaggio = BigDecimal.ZERO;

  @Column(name = "sconto_extra_stand_complesso")
  private BigDecimal scontoExtraStandComplesso = BigDecimal.ZERO;


  @Column(name = "marginalita_struttura_storage")
  private BigDecimal marginalitaStrutturaStorage = new BigDecimal("50");

  @Column(name = "marginalita_grafica_storage")
  private BigDecimal marginalitaGraficaStorage = new BigDecimal("50");

  @Column(name = "marginalita_premontaggio_storage")
  private BigDecimal marginalitaPremontaggioStorage = new BigDecimal("50");

  @Column(name = "sconto_struttura_storage")
  private BigDecimal scontoStrutturaStorage = BigDecimal.ZERO;

  @Column(name = "sconto_grafica_storage")
  private BigDecimal scontoGraficaStorage = BigDecimal.ZERO;

  @Column(name = "sconto_premontaggio_storage")
  private BigDecimal scontoPremontaggioStorage = BigDecimal.ZERO;

  @Column(name = "grafica_storage_attiva")
  private Boolean graficaStorageAttiva = false;

  @Column(name = "sconto_struttura_globale")
  private BigDecimal scontoStrutturaGlobale = BigDecimal.ZERO;

  @Column(name = "sconto_grafica_globale")
  private BigDecimal scontoGraficaGlobale = BigDecimal.ZERO;

  @Column(name = "sconto_retroilluminazione_globale")
  private BigDecimal scontoRetroilluminazioneGlobale = BigDecimal.ZERO;

  @Column(name = "sconto_accessori_globale")
  private BigDecimal scontoAccessoriGlobale = BigDecimal.ZERO;

  @Column(name = "sconto_premontaggi_globale")
  private BigDecimal scontoPremontaggiGlobale = BigDecimal.ZERO;

  @Column(name = "sconto_servizi_globale")
  private BigDecimal scontoServiziGlobale = BigDecimal.ZERO;

  @Column(name = "sconto_altri_beni_globale")
  private BigDecimal scontoAltriBeniGlobale = BigDecimal.ZERO;

  @Column(name = "sconto_struttura_desk")
  private BigDecimal scontoStrutturaDesk = BigDecimal.ZERO;

  @Column(name = "sconto_grafica_desk")
  private BigDecimal scontoGraficaDesk = BigDecimal.ZERO;

  @Column(name = "sconto_premontaggio_desk")
  private BigDecimal scontoPremontaggioDesk = BigDecimal.ZERO;

  @Column(name = "sconto_accessori_desk")
  private BigDecimal scontoAccessoriDesk = BigDecimal.ZERO;

  @Column(name = "marginalita_struttura_desk")
  private BigDecimal marginalitaStrutturaDesk = new BigDecimal("50");

  @Column(name = "marginalita_grafica_desk")
  private BigDecimal marginalitaGraficaDesk = new BigDecimal("50");

  @Column(name = "marginalita_premontaggio_desk")
  private BigDecimal marginalitaPremontaggioDesk = new BigDecimal("50");

  @Column(name = "marginalita_accessori_desk")
  private BigDecimal marginalitaAccessoriDesk = new BigDecimal("50");

  @Column(name = "marginalita_struttura_espositori")
  private BigDecimal marginalitaStrutturaEspositori = new BigDecimal("50");

  @Column(name = "marginalita_grafica_espositori")
  private BigDecimal marginalitaGraficaEspositori = new BigDecimal("50");

  @Column(name = "marginalita_premontaggio_espositori")
  private BigDecimal marginalitaPremontaggioEspositori = new BigDecimal("50");

  @Column(name = "marginalita_accessori_espositori")
  private BigDecimal marginalitaAccessoriEspositori = new BigDecimal("50");

  @Column(name = "totale_preventivo")
  private BigDecimal totalePreventivo = BigDecimal.ZERO;

  @Column(name = "totale_costi")
  private BigDecimal totaleCosti = BigDecimal.ZERO;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;
}
