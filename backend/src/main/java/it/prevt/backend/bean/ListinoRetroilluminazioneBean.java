package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class ListinoRetroilluminazioneBean {
  private UUID id;
  private BigDecimal altezza;
  private BigDecimal costoAlMetro;
  private BigDecimal ricaricoPercentuale;
  private BigDecimal prezzo;
  private String descrizione;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
