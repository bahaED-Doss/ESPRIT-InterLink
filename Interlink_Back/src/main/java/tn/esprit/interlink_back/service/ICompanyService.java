package tn.esprit.interlink_back.service;

import tn.esprit.interlink_back.entity.Company;
import java.util.List;
import java.util.Optional;

public interface ICompanyService {
    List<Company> getAllCompanies();
    Optional<Company> getCompanyById(Long id);
    Company createCompany(Company company);
    Optional<Company> updateCompany(Long id, Company companyDetails);
    void deleteCompany(Long id);
}

