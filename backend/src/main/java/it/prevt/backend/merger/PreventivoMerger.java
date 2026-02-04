package it.prevt.backend.merger;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.prevt.backend.bean.LayoutDeskBean;
import it.prevt.backend.bean.PreventivoBean;
import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.entity.Prospect;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class PreventivoMerger extends AbstractMerger<PreventivoBean, Preventivo> {

  private static final ObjectMapper MAPPER = new ObjectMapper();

  public static String layoutDeskToJson(Map<String, Integer> map) {
    if (map == null || map.isEmpty()) {
      return "[]";
    }

    try {
      List<LayoutDeskBean> list = map.entrySet().stream()
          .map(e -> {
            LayoutDeskBean l = new LayoutDeskBean();
            l.setLayout(e.getKey());
            l.setQuantity(e.getValue());
            return l;
          })
          .toList();

      return MAPPER.writeValueAsString(list);

    } catch (Exception e) {
      return "[]";
    }
  }


  @Override
  protected void doMerge(PreventivoBean bean, Preventivo entity) {
  }

}
