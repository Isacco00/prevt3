package it.prevt.backend.request.bean;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AbstractSearchRequestBean {
  private Integer firstResult;
  private Integer maxResult;
  private List<SortableFieldBean> sortFields;

}
