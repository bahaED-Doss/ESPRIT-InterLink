package tn.esprit.interlink_back.services;


import tn.esprit.interlink_back.entity.Application;

import java.util.List;

public interface IApplicationService {
    public Application addApplication(Application application);
    public void deleteApplication(long idApplication);
    public Application updateApplication(Application application);
    public List<Application> allApplication();
    public Application findApplicationById(long idApplication);
}
