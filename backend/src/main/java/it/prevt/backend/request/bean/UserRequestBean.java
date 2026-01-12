package it.prevt.backend.request.bean;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestBean extends AbstractSearchRequestBean {

  private List<String> userIdNot;
}
