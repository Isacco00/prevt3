package it.prevt.backend.validator.internal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidationMessage {

  private String field;
  private Object value;
  private String message;
  private String severity;

  public ValidationMessage(String field, Object value, String message, String severity) {
    this.field = field;
    this.value = value;
    this.message = message;
    this.severity = severity;
  }

  public static final String ERROR = "ERROR";
  public static final String WARNING = "WARNING";

}
