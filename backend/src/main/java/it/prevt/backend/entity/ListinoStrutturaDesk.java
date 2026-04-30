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
@Table(name = "listino_struttura_desk")
public class ListinoStrutturaDesk {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "layout_desk", nullable = false)
    private BigDecimal layoutDesk;

    @Column(name = "superficie", nullable = false)
    private BigDecimal superficie = BigDecimal.ZERO;

    @Column(name = "numero_pezzi", nullable = false)
    private Integer numeroPezzi = 0;

    @Column(name = "costo_unitario", nullable = false)
    private BigDecimal costoUnitario = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean attivo = true;

    @Column(name = "ricarico_percentuale")
    private BigDecimal ricaricoPercentuale;

    @Column(name = "prezzo")
    private BigDecimal prezzo;

    @Column(name = "descrizione")
    private String descrizione;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
