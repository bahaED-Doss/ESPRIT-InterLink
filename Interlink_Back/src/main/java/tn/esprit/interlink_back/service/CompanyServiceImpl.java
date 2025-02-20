package tn.esprit.interlink_back.service;

import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Company;
import tn.esprit.interlink_back.repository.CompanyRepository;

import java.util.List;

@Service
public class CompanyServiceImpl implements ICompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public List<Company> retrieveAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public Company retrieveCompany(Long id) {
        return companyRepository.findById(id).orElse(null);
    }

    @Override
    public Company addCompany(Company company) {
        return companyRepository.save(company);
    }

    @Override
    public void removeCompany(Long id) {
        companyRepository.deleteById(id);
    }

    @Override
    public Company modifyCompany(Company company) {
        return companyRepository.save(company);
    }
}
