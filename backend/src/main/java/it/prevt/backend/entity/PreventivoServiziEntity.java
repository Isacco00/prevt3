package it.prevt.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.util.UUID;


@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "preventivi_servizi",
       uniqueConstraints = @UniqueConstraint(name = "ux_preventivi_servizi_preventivo_id", columnNames = "preventivo_id"))
public class PreventivoServiziEntity {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private UUID id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "preventivo_id", nullable = false)
    private PreventivoEntity preventivo;

    private Boolean montaggioSmontaggio = false;
    private Boolean certificazioni = false;
    private Boolean istruzioniAssistenza = false;

    private Integer personaleMont = 0;
    private BigDecimal costoOrarioMont = new BigDecimal("20");
    private Integer giorniMontaggio = 0;
    private BigDecimal oreLavoroCantxperMont = BigDecimal.ZERO;
    private BigDecimal kmArMont = BigDecimal.ZERO;
    private Boolean consegCant = false;
    private String voloMont = "NO";
    private Boolean trenoMont = false;
    private BigDecimal oreViaggioTrasfertaMont = BigDecimal.ZERO;
    private Boolean viaggioAutoComMont = false;
    private String extraCostiTrasfertaMont = "NO";
    private BigDecimal extraKmTraspFurgMont = BigDecimal.ZERO;
    private BigDecimal extraKmTraspTirMont = BigDecimal.ZERO;
    private BigDecimal ricaricoMontaggio = new BigDecimal("30");

    private BigDecimal totCostOreMont = BigDecimal.ZERO;
    private BigDecimal totCostKmMont = BigDecimal.ZERO;
    private Integer numVitti = 0;
    private Integer numAlloggi = 0;
    private BigDecimal totCostVittall = BigDecimal.ZERO;
    private BigDecimal totCostoVoloAr = BigDecimal.ZERO;
    private BigDecimal totCostoTreno = BigDecimal.ZERO;
    private BigDecimal totCostoTrasfPers = BigDecimal.ZERO;
    private BigDecimal totCostiAuto = BigDecimal.ZERO;
    private BigDecimal totCostiExtraTrasfMont = BigDecimal.ZERO;
    private BigDecimal totCostiExtraKmTraspFurgMont = BigDecimal.ZERO;
    private BigDecimal totCostiExtraKmTraspTirMont = BigDecimal.ZERO;
    private BigDecimal totCostiConsegnaCantiere = BigDecimal.ZERO;
    private BigDecimal totaleCostoMontaggio = BigDecimal.ZERO;
    private BigDecimal preventivoMontaggio = BigDecimal.ZERO;

    private Integer personaleSmon = 0;
    private BigDecimal costoOrarioSmon = new BigDecimal("20");
    private Integer giorniSmontaggioViaggio = 0;
    private BigDecimal oreLavoroCantxperSmon = BigDecimal.ZERO;
    private BigDecimal kmArSmon = BigDecimal.ZERO;
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
    private BigDecimal totCostiExtraTrasfSmon = BigDecimal.ZERO;
    private BigDecimal totCostiExtraKmTraspFurgSmon = BigDecimal.ZERO;
    private BigDecimal totCostiExtraKmTraspTirSmon = BigDecimal.ZERO;
    private BigDecimal totaleCostoSmontaggio = BigDecimal.ZERO;
    private BigDecimal preventivoSmontaggio = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
