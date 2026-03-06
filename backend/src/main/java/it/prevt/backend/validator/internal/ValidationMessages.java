package it.prevt.backend.validator.internal;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;

@Getter
public class ValidationMessages<T> {

  private final List<ValidationMessage> errors = new ArrayList<>();

  public void addErrorMessage(String field, Object value, String message) {
    errors.add(new ValidationMessage(field, value, message, ValidationMessage.ERROR));
  }

  public boolean hasErrors() {
    return !errors.isEmpty();
  }

}
