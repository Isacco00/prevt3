package it.prevt.backend.bean;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class MarginalitaPerProspectBean {

  private UUID id;
  private BigDecimal marginalita;
  private String tipoProspect;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;

}
