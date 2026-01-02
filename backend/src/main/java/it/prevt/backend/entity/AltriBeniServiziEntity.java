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
@Table(name = "altri_beni_servizi")
public class AltriBeniServiziEntity {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "preventivo_id", nullable = false)
    private Preventivo preventivo;

    @Column(nullable = false)
    private String descrizione = "";

    @Column(name = "costo_unitario", nullable = false)
    private BigDecimal costoUnitario = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal marginalita = BigDecimal.ZERO;

    @Column(name = "prezzo_unitario", nullable = false)
    private BigDecimal prezzoUnitario = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal quantita = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal totale = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
