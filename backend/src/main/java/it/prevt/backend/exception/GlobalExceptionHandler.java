package it.prevt.backend.exception;

import it.prevt.backend.validator.internal.ValidationException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ValidationException.class)
  public ResponseEntity<Map<String, Object>> handleValidationException(
      ValidationException ex) {

    Map<String, Object> response = new HashMap<>();
    response.put("errors", ex.getErrors());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

}
