package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
public class ProspectBean {

  private UUID id;
  private String ragioneSociale;
  private String partitaIva;
  private String codiceFiscale;
  private String indirizzo;
  private String citta;
  private String cap;
  private String provincia;
  private String telefono;
  private String email;
  private String tipo;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
  private String tipoProspect;

}
