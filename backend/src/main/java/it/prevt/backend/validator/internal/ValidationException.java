package it.prevt.backend.validator.internal;

import java.util.List;

public class ValidationException extends RuntimeException {

  private final List<ValidationMessage> errors;

  public ValidationException(List<ValidationMessage> errors) {
    super("Validation failed");
    this.errors = errors;
  }

  public List<ValidationMessage> getErrors() {
    return errors;
  }

}