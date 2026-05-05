package it.prevt.backend.bean;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreventivoServiziBean {

  private UUID id;
  private String preventivoId;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
  private Boolean montaggioSmontaggio;
  private Boolean certificazioni;
  private Boolean istruzioniAssistenza;

  private Integer personaleMont;
  private BigDecimal costoOrarioMont;
  private Integer giorniMontaggio;
  private BigDecimal oreLavoroCantxperMont;
  private BigDecimal kmArMont;
  private String puntoPartenza;
  private String puntoArrivo;
  private Boolean rientroDopomont;
  private Integer giorniViaggio;
  private Integer pernottamentiViaggio;
  private BigDecimal tempoViaggioArMont;
  private BigDecimal costoOrarioViaggio;
  private String noleggioMezzo;
  private Integer giorniNoleggio;
  private BigDecimal costoPedaggi;
  private BigDecimal costoVoloPp;
  private BigDecimal costoTrenoPp;
  private Boolean consegCant;
  private String voloMont;
  private Boolean trenoMont;
  private BigDecimal oreViaggioTrasfertaMont;
  private Boolean viaggioAutoComMont;
  private String extraCostiTrasfertaMont;
  private BigDecimal extraKmTraspFurgMont;
  private BigDecimal extraKmTraspTirMont;
  private BigDecimal ricaricoMontaggio;
  private BigDecimal scontoMontaggio;

  private BigDecimal totCostOreMont;
  private BigDecimal totCostKmMont;
  private Integer numVitti;
  private Integer numAlloggi;
  private BigDecimal totCostVittall;
  private BigDecimal totCostoVoloAr;
  private BigDecimal totCostoTreno;
  private BigDecimal totCostoTrasfPers;
  private BigDecimal totCostiAuto;
  private BigDecimal totCostNoleggio;
  private BigDecimal totCostiExtraTrasfMont;
  private BigDecimal totCostiExtraKmTraspFurgMont;
  private BigDecimal totCostiExtraKmTraspTirMont;
  private BigDecimal totCostiConsegnaCantiere;
  private BigDecimal totaleCostoMontaggio;
  private BigDecimal preventivoMontaggio;
  private BigDecimal totalePrezzoListinoMont;
  private BigDecimal totalePrezzoNettoMont;
  private BigDecimal margineMont;
  private BigDecimal marginalitaMont;

  private Integer personaleSmon;
  private BigDecimal costoOrarioSmon;
  private Integer giorniSmontaggioViaggio;
  private BigDecimal oreLavoroCantxperSmon;
  private BigDecimal kmArSmon;
  private String puntoPartenzaSmon;
  private String puntoArrivoSmon;
  private Boolean rientroDoposmont;
  private Integer giorniViaggioSmon;
  private Integer pernottamentiViaggioSmon;
  private BigDecimal tempoViaggioArSmon;
  private BigDecimal costoOrarioViaggioSmon;
  private String noleggioMezzoSmon;
  private Integer giorniNoleggioSmon;
  private BigDecimal costoPedaggiSmon;
  private BigDecimal costoVoloPpSmon;
  private BigDecimal costoTrenoPpSmon;
  private Boolean ritiroCant;
  private String voloSmon;
  private Boolean trenoSmon;
  private BigDecimal oreViaggioTrasfertaSmon;
  private Boolean viaggioAutoComSmon;
  private String extraCostiTrasfertaSmon;
  private BigDecimal extraKmTraspFurgSmon;
  private BigDecimal extraKmTraspTirSmon;

  private BigDecimal totCostOreSmon;
  private BigDecimal totCostKmSmon;
  private Integer numVittiSmon;
  private Integer numAlloggiSmon;
  private BigDecimal totCostVittallSmon;
  private BigDecimal totCostoVoloArSmon;
  private BigDecimal totCostoTrenoSmon;
  private BigDecimal totCostoTrasfPersSmon;
  private BigDecimal totCostiAutoSmon;
  private BigDecimal totCostNoleggioSmon;
  private BigDecimal totCostiRitiroCantiere;
  private BigDecimal totCostiExtraTrasfSmon;
  private BigDecimal totCostiExtraKmTraspFurgSmon;
  private BigDecimal totCostiExtraKmTraspTirSmon;
  private BigDecimal totaleCostoSmontaggio;
  private BigDecimal preventivoSmontaggio;
  private BigDecimal totalePrezzoListinoSmon;
  private BigDecimal totalePrezzoNettoSmon;
  private BigDecimal margineSmon;
  private BigDecimal marginalitaSmon;
}
