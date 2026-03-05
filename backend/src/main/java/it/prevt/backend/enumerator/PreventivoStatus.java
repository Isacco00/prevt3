package it.prevt.backend.enumerator;

import jakarta.persistence.AttributeConverter;
import lombok.Getter;

@Getter
public enum PreventivoStatus {

  BOZZA("bozza"),
  INVIATO("inviato"),
  ACCETTATO("accettato"),
  IN_REVISIONE("in_revisione"),
  RIFIUTATO("rifiutato"),
  CANCELLATO("cancellato");

  private final String dbValue;

  PreventivoStatus(String dbValue) {
    this.dbValue = dbValue;
  }

  @Override
  public String toString() {
    return dbValue;
  }

  public static PreventivoStatus fromDb(String value) {
    for (PreventivoStatus s : values()) {
      if (s.dbValue.equals(value)) {
        return s;
      }
    }
    throw new IllegalArgumentException("Unknown status: " + value);
  }

  @jakarta.persistence.Converter(autoApply = true)
  public static class Converter implements AttributeConverter<PreventivoStatus, String> {

    @Override
    public String convertToDatabaseColumn(PreventivoStatus status) {
      return status == null ? null : status.getDbValue();
    }

    @Override
    public PreventivoStatus convertToEntityAttribute(String dbData) {
      return dbData == null ? null : PreventivoStatus.fromDb(dbData);
    }
  }
}