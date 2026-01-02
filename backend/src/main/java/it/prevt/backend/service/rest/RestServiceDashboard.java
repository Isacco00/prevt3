package it.prevt.backend.service.rest;

import it.prevt.backend.bean.DashboardBean;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(RestServicePath.DASHBOARD)
@PreAuthorize("isAuthenticated()")
public interface RestServiceDashboard {

    @GetMapping("/loadDashboard")
    DashboardBean loadDashboard();
}
