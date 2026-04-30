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
  private String nomeVariabile;
  private String unitaMisura;
  private BigDecimal valore;
  private BigDecimal ricaricoPercentuale;
  private BigDecimal prezzo;
  private String descrizione;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
