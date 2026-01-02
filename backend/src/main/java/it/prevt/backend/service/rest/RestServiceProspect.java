package it.prevt.backend.service.rest;

import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.bean.UserBean;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(RestServicePath.PROSPECT)
@PreAuthorize("isAuthenticated()")
public interface RestServiceProspect {

  @GetMapping("/getProspectList")
  List<ProspectBean> getProspectList();

  @PostMapping("/saveProspect")
  ProspectBean saveProspect(@RequestBody ProspectBean dto, Authentication authentication);

}
