package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class ListinoStrutturaDeskBean {
  private UUID id;
  private BigDecimal layoutDesk;
  private BigDecimal superficie;
  private Integer numeroPezzi;
  private BigDecimal costoUnitario;
  private BigDecimal ricaricoPercentuale;
  private BigDecimal prezzo;
  private String descrizione;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
