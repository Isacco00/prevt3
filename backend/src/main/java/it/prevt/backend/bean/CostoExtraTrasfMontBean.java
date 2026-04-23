package it.prevt.backend.bean;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CostoExtraTrasfMontBean {
  private UUID id;
  private String livello;
  private BigDecimal costoExtraMont;
  private Boolean attivo;
}
