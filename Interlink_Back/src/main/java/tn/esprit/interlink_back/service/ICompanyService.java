package tn.esprit.interlink_back.service;

import tn.esprit.interlink_back.entity.Company;
import java.util.List;

public interface ICompanyService {
    public List<Company> retrieveAllCompanies();
    public Company retrieveCompany(Long id);
    public Company addCompany(Company company);
    public void removeCompany(Long id);
    public Company modifyCompany(Company company);
}
