package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class CondizioniFornituraPreventiviBean {
  private UUID id;
  private String preventivoId;
  private String voce;
  private String testo;
  private boolean selezionato;
  private Integer ordine;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
