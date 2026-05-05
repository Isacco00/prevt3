package it.prevt.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;


@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "preventivi_servizi",
       uniqueConstraints = @UniqueConstraint(name = "ux_preventivi_servizi_preventivo_id", columnNames = "preventivo_id"))
public class PreventivoServizi {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private UUID id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "preventivo_id", nullable = false)
    private Preventivo preventivo;

    private Boolean montaggioSmontaggio = false;
    private Boolean certificazioni = false;
    private Boolean istruzioniAssistenza = false;

    private Integer personaleMont = 0;
    private BigDecimal costoOrarioMont = new BigDecimal("20");
    private Integer giorniMontaggio = 0;
    private BigDecimal oreLavoroCantxperMont = BigDecimal.ZERO;
    private BigDecimal kmArMont = BigDecimal.ZERO;

    @Column(name = "punto_partenza")
    private String puntoPartenza;
    @Column(name = "punto_arrivo")
    private String puntoArrivo;
    @Column(name = "rientro_dopomont", nullable = false)
    private Boolean rientroDopomont = true;
    @Column(name = "giorni_viaggio", nullable = false)
    private Integer giorniViaggio = 0;
    @Column(name = "pernottamenti_viaggio", nullable = false)
    private Integer pernottamentiViaggio = 0;
    @Column(name = "tempo_viaggio_ar_mont", nullable = false)
    private BigDecimal tempoViaggioArMont = BigDecimal.ZERO;
    @Column(name = "costo_orario_viaggio", nullable = false)
    private BigDecimal costoOrarioViaggio = BigDecimal.ZERO;
    @Column(name = "noleggio_mezzo", nullable = false)
    private String noleggioMezzo = "No";
    @Column(name = "giorni_noleggio", nullable = false)
    private Integer giorniNoleggio = 0;
    @Column(name = "costo_pedaggi", nullable = false)
    private BigDecimal costoPedaggi = BigDecimal.ZERO;
    @Column(name = "costo_volo_pp", nullable = false)
    private BigDecimal costoVoloPp = BigDecimal.ZERO;
    @Column(name = "costo_treno_pp", nullable = false)
    private BigDecimal costoTrenoPp = BigDecimal.ZERO;

    private Boolean consegCant = false;
    private String voloMont = "NO";
    private Boolean trenoMont = false;
    private BigDecimal oreViaggioTrasfertaMont = BigDecimal.ZERO;
    private Boolean viaggioAutoComMont = false;
    private String extraCostiTrasfertaMont = "NO";
    private BigDecimal extraKmTraspFurgMont = BigDecimal.ZERO;
    private BigDecimal extraKmTraspTirMont = BigDecimal.ZERO;
    private BigDecimal ricaricoMontaggio = new BigDecimal("30");
    private BigDecimal scontoMontaggio = BigDecimal.ZERO;

    private BigDecimal totCostOreMont = BigDecimal.ZERO;
    private BigDecimal totCostKmMont = BigDecimal.ZERO;
    private Integer numVitti = 0;
    private Integer numAlloggi = 0;
    private BigDecimal totCostVittall = BigDecimal.ZERO;
    private BigDecimal totCostoVoloAr = BigDecimal.ZERO;
    private BigDecimal totCostoTreno = BigDecimal.ZERO;
    private BigDecimal totCostoTrasfPers = BigDecimal.ZERO;
    private BigDecimal totCostiAuto = BigDecimal.ZERO;
    @Column(name = "tot_cost_noleggio", nullable = false)
    private BigDecimal totCostNoleggio = BigDecimal.ZERO;
    private BigDecimal totCostiExtraTrasfMont = BigDecimal.ZERO;
    private BigDecimal totCostiExtraKmTraspFurgMont = BigDecimal.ZERO;
    private BigDecimal totCostiExtraKmTraspTirMont = BigDecimal.ZERO;
    private BigDecimal totCostiConsegnaCantiere = BigDecimal.ZERO;
    private BigDecimal totaleCostoMontaggio = BigDecimal.ZERO;
    private BigDecimal preventivoMontaggio = BigDecimal.ZERO;
    private BigDecimal totalePrezzoListinoMont = BigDecimal.ZERO;
    private BigDecimal totalePrezzoNettoMont = BigDecimal.ZERO;
    private BigDecimal margineMont = BigDecimal.ZERO;
    private BigDecimal marginalitaMont = BigDecimal.ZERO;

    private Integer personaleSmon = 0;
    private BigDecimal costoOrarioSmon = new BigDecimal("20");
    private Integer giorniSmontaggioViaggio = 0;
    private BigDecimal oreLavoroCantxperSmon = BigDecimal.ZERO;
    private BigDecimal kmArSmon = BigDecimal.ZERO;
    @Column(name = "punto_partenza_smon")
    private String puntoPartenzaSmon;
    @Column(name = "punto_arrivo_smon")
    private String puntoArrivoSmon;
    @Column(name = "rientro_doposmont", nullable = false)
    private Boolean rientroDoposmont = true;
    @Column(name = "giorni_viaggio_smon", nullable = false)
    private Integer giorniViaggioSmon = 0;
    @Column(name = "pernottamenti_viaggio_smon", nullable = false)
    private Integer pernottamentiViaggioSmon = 0;
    @Column(name = "tempo_viaggio_ar_smon", nullable = false)
    private BigDecimal tempoViaggioArSmon = BigDecimal.ZERO;
    @Column(name = "costo_orario_viaggio_smon", nullable = false)
    private BigDecimal costoOrarioViaggioSmon = BigDecimal.ZERO;
    @Column(name = "noleggio_mezzo_smon", nullable = false)
    private String noleggioMezzoSmon = "No";
    @Column(name = "giorni_noleggio_smon", nullable = false)
    private Integer giorniNoleggioSmon = 0;
    @Column(name = "costo_pedaggi_smon", nullable = false)
    private BigDecimal costoPedaggiSmon = BigDecimal.ZERO;
    @Column(name = "costo_volo_pp_smon", nullable = false)
    private BigDecimal costoVoloPpSmon = BigDecimal.ZERO;
    @Column(name = "costo_treno_pp_smon", nullable = false)
    private BigDecimal costoTrenoPpSmon = BigDecimal.ZERO;
    @Column(name = "ritiro_cant", nullable = false)
    private Boolean ritiroCant = false;
    private String voloSmon = "NO";
    private Boolean trenoSmon = false;
    private BigDecimal oreViaggioTrasfertaSmon = BigDecimal.ZERO;
    private Boolean viaggioAutoComSmon = false;
    private String extraCostiTrasfertaSmon = "NO";
    private BigDecimal extraKmTraspFurgSmon = BigDecimal.ZERO;
    private BigDecimal extraKmTraspTirSmon = BigDecimal.ZERO;

    private BigDecimal totCostOreSmon = BigDecimal.ZERO;
    private BigDecimal totCostKmSmon = BigDecimal.ZERO;
    private Integer numVittiSmon = 0;
    private Integer numAlloggiSmon = 0;
    private BigDecimal totCostVittallSmon = BigDecimal.ZERO;
    private BigDecimal totCostoVoloArSmon = BigDecimal.ZERO;
    private BigDecimal totCostoTrenoSmon = BigDecimal.ZERO;
    private BigDecimal totCostoTrasfPersSmon = BigDecimal.ZERO;
    private BigDecimal totCostiAutoSmon = BigDecimal.ZERO;
    @Column(name = "tot_cost_noleggio_smon", nullable = false)
    private BigDecimal totCostNoleggioSmon = BigDecimal.ZERO;
    @Column(name = "tot_costi_ritiro_cantiere", nullable = false)
    private BigDecimal totCostiRitiroCantiere = BigDecimal.ZERO;
    private BigDecimal totCostiExtraTrasfSmon = BigDecimal.ZERO;
    private BigDecimal totCostiExtraKmTraspFurgSmon = BigDecimal.ZERO;
    private BigDecimal totCostiExtraKmTraspTirSmon = BigDecimal.ZERO;
    private BigDecimal totaleCostoSmontaggio = BigDecimal.ZERO;
    private BigDecimal preventivoSmontaggio = BigDecimal.ZERO;
    private BigDecimal totalePrezzoListinoSmon = BigDecimal.ZERO;
    private BigDecimal totalePrezzoNettoSmon = BigDecimal.ZERO;
    private BigDecimal margineSmon = BigDecimal.ZERO;
    private BigDecimal marginalitaSmon = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
