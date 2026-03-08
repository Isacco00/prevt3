package it.prevt.backend.bean;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ListinoServiziPrezzoUnitarioBean {
  private UUID id;
  private String parametro;
  private String unitaMisura;
  private BigDecimal costo;
  private BigDecimal ricaricoPercentuale;
  private BigDecimal prezzo;
  private String descrizione;
  private boolean attivo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
