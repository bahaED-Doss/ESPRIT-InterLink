package tn.esprit.interlink_back.service;

import tn.esprit.interlink_back.entity.Company;

import java.util.List;
import java.util.Map;

public interface ICompanyService {
    public List<Company> retrieveAllCompanies();
    public Company retrieveCompany(Long id);
    public Company addCompany(Company company);
    public void removeCompany(Long id);
    public Company modifyCompany(Company company);
    // Modified method to search by Industry Sector, Country, and City with Sorting
    List<Company> searchCompanies(String industrySector, String location, String sortField, boolean ascending);

    Map<String, Integer> getProjectsPerCompany();

    // Get the distribution of companies by industry sector
    Map<String, Long> getCompaniesByIndustrySector();

    void enrichCompanyInfo(Company company);

    String fetchCompanyDescription(String companyName);
}
