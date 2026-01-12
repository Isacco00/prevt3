package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class CostiRetroilluminazioneBean {
  private UUID id;
  private BigDecimal altezza;
  private BigDecimal costoAlMetro;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
