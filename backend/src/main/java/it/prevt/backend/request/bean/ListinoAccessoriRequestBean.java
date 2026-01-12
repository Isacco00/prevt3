package it.prevt.backend.request.bean;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ListinoAccessoriRequestBean extends AbstractSearchRequestBean {

  private Boolean attivo;
  private String preventivoId;
}
