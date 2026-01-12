package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class CostiStrutturaEspositoriLayoutBean {
  private UUID id;
  private String layoutEspositore;
  private BigDecimal costoUnitario;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
