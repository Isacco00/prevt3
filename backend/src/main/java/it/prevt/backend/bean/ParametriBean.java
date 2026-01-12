package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class ParametriBean {
  private UUID id;
  private String tipo;
  private String nome;
  private BigDecimal valore;
  private String valoreTesto;
  private String descrizione;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
  private String valoreChiave;
  private Integer ordine;
}
