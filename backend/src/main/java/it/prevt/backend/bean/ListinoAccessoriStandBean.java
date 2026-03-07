package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class ListinoAccessoriStandBean {
  private UUID id;
  private String nome;
  private BigDecimal costoUnitario;
  private BigDecimal ricaricoPercentuale;
  private BigDecimal prezzo;
  private String descrizione;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
