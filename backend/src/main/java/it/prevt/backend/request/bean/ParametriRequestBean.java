package it.prevt.backend.request.bean;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParametriRequestBean extends AbstractSearchRequestBean {

  private String tipo;
  private Boolean attivo;

}
