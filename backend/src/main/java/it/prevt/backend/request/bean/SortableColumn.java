package it.prevt.backend.request.bean;

import lombok.Getter;
import lombok.Setter;

@Getter
public enum SortableColumn {

  LISTINO_ACCESSORI_DESK_NAME("nome", "u"), LISTINO_ACCESSORI_STAND_NAME("nome",
      "u"), PARAMETRI_COSTI_UNITARI_PARAMETRO("parametro",
      "u"), PARAMETRI_COSTI_RETROILLUMINAZIONE_ALTEZZA("altezza",
      "u"), COSTI_STRUTTURA_ESPOSITORI_LAYOUT_ESPOSITORE("layoutEspositore",
      "u"), LISTINO_ACCESSORI_ESPOSITORI_NOME("nome", "u"), CONDIZIONI_FORNITURA_PREVENTIVI_ORDINE(
      "ordine", "u"), CONDIZIONI_STANDARD_FORNITURA_ORDINE("ordine", "u"),
  ;

  SortableColumn(String fieldName, String classAlias) {
    this.fieldName = fieldName;
    this.classAlias = classAlias;
  }

  private final String fieldName;
  private final String classAlias;
}
