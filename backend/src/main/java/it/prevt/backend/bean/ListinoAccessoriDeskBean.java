package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class ListinoAccessoriDeskBean {
  private UUID id;
  private String nome;
  private BigDecimal costoUnitario;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
