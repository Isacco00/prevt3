package it.prevt.backend.request.bean;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ListinoAccessoriRequestBean extends AbstractSearchRequestBean {

  private Boolean attivo;
  private String preventivoId;
  private List<String> parametri;
}
