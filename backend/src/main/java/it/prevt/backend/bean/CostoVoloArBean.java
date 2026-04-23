package it.prevt.backend.bean;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CostoVoloArBean {
  private UUID id;
  private String tipologia;
  private BigDecimal costoVoloAr;
  private Boolean attivo;
}
