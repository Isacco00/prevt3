package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.DashboardBean;
import it.prevt.backend.manager.DashboardManager;
import it.prevt.backend.service.rest.RestServiceDashboard;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RestServiceDashboardImpl implements RestServiceDashboard {

    private final DashboardManager manager;

    @Override
    public DashboardBean loadDashboard() {
        return manager.loadDashboard();
    }
}
