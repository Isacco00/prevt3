package it.prevt.backend.bean;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AltriBeniServiziBean {
  private UUID id;
  private String preventivoId;
  private String descrizione;
  private BigDecimal costoUnitario;
  private BigDecimal marginalita;
  private BigDecimal prezzoUnitario;
  private BigDecimal quantita;
  private BigDecimal totale;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
