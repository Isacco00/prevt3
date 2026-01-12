package it.prevt.backend.request.bean;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SortableFieldBean {
  public SortableFieldBean(SortableColumn field, boolean desc) {
    this.field = field;
    this.desc = desc;
  }

  private SortableColumn field;
  private boolean desc;
}
