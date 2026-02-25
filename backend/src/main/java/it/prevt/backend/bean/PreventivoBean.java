package it.prevt.backend.bean;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class PreventivoBean {
  private UUID id;
  private ProspectBean prospect;
  private String numeroPreventivo;
  private String titolo;
  private String descrizione;
  private BigDecimal larghezza;
  private BigDecimal altezza;
  private BigDecimal costoMq;
  private BigDecimal costoMc;
  private BigDecimal costoFisso;
  private String status;
  private LocalDate dataScadenza;
  private String note;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
  private BigDecimal profondita;
  private String layout;
  private Integer distribuzione;
  private String complessita;
  private BigDecimal superficieStampa;
  private BigDecimal sviluppoLineare;
  private BigDecimal numeroPezzi;
  private BigDecimal costoStruttura;
  private BigDecimal costoGrafica;
  private BigDecimal costoPremontaggio;
  private BigDecimal costoTotale;
  private BigDecimal totale;
  private BigDecimal bifaccialita;
  private BigDecimal retroilluminazione;
  private BigDecimal larghezzaStorage;
  private BigDecimal profonditaStorage;
  private BigDecimal altezzaStorage;
  private String layoutStorage;
  private String numeroPorte;
  private Integer deskQta;
  private List<LayoutDeskBean> layoutDesk;
  private Integer portaScorrevole;
  private Integer ripianoSuperiore;
  private Integer ripianoInferiore;
  private Integer tecaPlexiglass;
  private Integer fronteLuminoso;
  private Integer borsa;

  private BigDecimal superficieStampaStorage;
  private BigDecimal sviluppoMetriLineariStorage;
  private BigDecimal numeroPezziStorage;

  private BigDecimal superficieStampaDesk;
  private BigDecimal numeroPezziDesk;

  private String espositoriConfig;
  private String complementiConfig;
  private Integer borsaStandard;
  private Integer bauleTrolley;
  private Integer staffaMonitor;
  private Integer mensola;
  private Integer spotLight;
  private Integer kitFaro50w;
  private Integer kitFaro100w;
  private Integer quadroElettrico16a;
  private Integer nicchia;
  private Integer pedana;

  private Integer qtaTipo30;
  private Integer qtaTipo50;
  private Integer qtaTipo100;

  private BigDecimal numeroPezziEspositori;
  private BigDecimal superficieStampaEspositori;

  private Integer ripiano30x30;
  private Integer ripiano50x50;
  private Integer ripiano100x50;

  private Integer tecaPlexiglass30x30x30;
  private Integer tecaPlexiglass50x50x50;
  private Integer tecaPlexiglass100x50x30;

  private Integer retroilluminazione30x30x100h;
  private Integer retroilluminazione50x50x100h;
  private Integer retroilluminazione100x50x100h;

  private boolean servizioMontaggioSmontaggio;
  private boolean servizioCertificazioni;
  private boolean servizioIstruzioniAssistenza;

  private BigDecimal extraPercComplex;
  private BigDecimal extraStandComplesso;
  private BigDecimal costoRetroilluminazione;

  private String accessoriStandConfig;

  private Integer borsaEspositori;
  private boolean premontaggio;
  private boolean premontaggioStorage;

  private BigDecimal marginalitaStruttura;
  private BigDecimal marginalitaGrafica;
  private BigDecimal marginalitaRetroilluminazione;
  private BigDecimal marginalitaAccessori;
  private BigDecimal marginalitaPremontaggio;

  private BigDecimal marginalitaStrutturaStorage;
  private BigDecimal marginalitaGraficaStorage;
  private BigDecimal marginalitaPremontaggioStorage;

  private BigDecimal marginalitaStrutturaDesk;
  private BigDecimal marginalitaGraficaDesk;
  private BigDecimal marginalitaPremontaggioDesk;
  private BigDecimal marginalitaAccessoriDesk;

  private BigDecimal marginalitaStrutturaEspositori;
  private BigDecimal marginalitaGraficaEspositori;
  private BigDecimal marginalitaPremontaggioEspositori;
  private BigDecimal marginalitaAccessoriEspositori;

  private BigDecimal totalePreventivo;
  private BigDecimal totaleCosti;

}
