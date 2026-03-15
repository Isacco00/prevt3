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
@Table(name = "parametri_a_costi_unitari")
public class ParametriACostiUnitari {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String parametro;

    @Column(name = "unita_misura", nullable = false)
    private String unitaMisura;

    @Column(nullable = false)
    private BigDecimal valore = BigDecimal.ZERO;

    @Column(name = "ricarico_percentuale")
    private BigDecimal ricaricoPercentuale;

    @Column(name = "prezzo")
    private BigDecimal prezzo;

    @Column(name = "descrizione")
    private String descrizione;

    @Column(nullable = false)
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
