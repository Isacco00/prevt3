package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class ParametriACostiUnitariBean {
  private UUID id;
  private String parametro;
  private String unitaMisura;
  private BigDecimal valore;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
