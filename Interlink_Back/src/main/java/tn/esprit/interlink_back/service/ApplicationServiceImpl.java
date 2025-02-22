package tn.esprit.interlink_back.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Application;
import tn.esprit.interlink_back.repository.ApplicationRepository;

import java.util.List;
@AllArgsConstructor
@Slf4j
@Service
public class ApplicationServiceImpl implements IApplicationService {
    ApplicationRepository applicationRepository;

    @Override
    public Application addApplication(Application application) {
        return applicationRepository.save(application);
    }

    @Override
    public void deleteApplication(long idApplication) {
        applicationRepository.deleteById(idApplication);
    }

    @Override
    public Application updateApplication(Application application) {
        return applicationRepository.save(application);
    }

    @Override
    public List<Application> allApplication() {
        return applicationRepository.findAll();
    }

    @Override
    public Application findApplicationById(long idApplication) {
        return applicationRepository.findById(idApplication).get();
    }
}
