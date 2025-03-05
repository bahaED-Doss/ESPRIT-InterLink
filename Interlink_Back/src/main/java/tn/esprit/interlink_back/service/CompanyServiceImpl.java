package tn.esprit.interlink_back.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Company;
import tn.esprit.interlink_back.repository.CompanyRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    // Modified method to search by Industry Sector, Country, and City with Sorting
    @Override
    public List<Company> searchCompanies(String industrySector, String country, String city, String sortField, boolean ascending) {
        Sort sort = ascending ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();

        // Ensure null values are replaced with empty strings
        if (industrySector == null) industrySector = "";
        if (country == null) country = "";
        if (city == null) city = "";

        return companyRepository.searchCompanies(industrySector, country, city, sort);
    }
    @Override
    public Map<String, Integer> getProjectsPerCompany() {
        List<Company> companies = companyRepository.findAll();
        return companies.stream()
                .collect(Collectors.toMap(Company::getName, company -> company.getProjects() != null ? company.getProjects().size() : 0));
    }

    @Override
    public Map<String, Long> getCompaniesByIndustrySector() {
        return companyRepository.findAll().stream()
                .collect(Collectors.groupingBy(Company::getIndustrySector, Collectors.counting()));
    }

}

