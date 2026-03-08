package it.prevt.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "listino_servizi_prezzo_unitario")
public class ListinoServiziPrezzoUnitario {

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
  private BigDecimal costo = BigDecimal.ZERO;

  @Column(name = "ricarico_percentuale", nullable = false)
  private BigDecimal ricaricoPercentuale = BigDecimal.ZERO;

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
