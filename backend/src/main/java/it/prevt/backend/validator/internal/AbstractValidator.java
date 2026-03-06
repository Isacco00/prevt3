package it.prevt.backend.validator.internal;

public abstract class AbstractValidator<T> {

  protected ValidationMessages<T> messages;

  public ValidationMessages<T> validate(T object) {
    messages = new ValidationMessages<>();
    doValidate(object);
    return messages;
  }

  protected abstract void doValidate(T object);

  protected void addMessage(String field, Object value, String message) {
    messages.addErrorMessage(field, value, message);
  }
}
