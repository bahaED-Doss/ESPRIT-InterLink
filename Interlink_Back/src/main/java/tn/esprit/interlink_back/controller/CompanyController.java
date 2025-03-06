package tn.esprit.interlink_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Company;
import tn.esprit.interlink_back.service.GeocodingService;
import tn.esprit.interlink_back.service.ICompanyService;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/company")
public class CompanyController {

    public final ICompanyService companyService;
    private final GeocodingService geocodingService;

    public CompanyController(ICompanyService companyService, GeocodingService geocodingService) {
        this.companyService = companyService;
        this.geocodingService = geocodingService;
    }


    @GetMapping("/retrieve-all-companies")
    public List<Company> getAllCompanies() {
        return companyService.retrieveAllCompanies();
    }

    @GetMapping("/retrieve-company/{company-id}")
    public Company retrieveCompany(@PathVariable("company-id") Long id) {
        return companyService.retrieveCompany(id);
    }

    @PostMapping("/add-company")
    public Company addCompany(@RequestBody Company company) {
        System.out.println("Received Company: " + company);
        return companyService.addCompany(company);
    }

    @DeleteMapping("/remove-company/{id}")
    public void removeCompany(@PathVariable("id") Long id) {
        companyService.removeCompany(id);
    }

    @PutMapping("/modify-company")
    public ResponseEntity<Company> modifyCompany(@RequestBody Company company) {
        Optional<Company> existingCompanyOptional = Optional.ofNullable(companyService.retrieveCompany(company.getCompanyId()));

        if (existingCompanyOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Company existingCompany = existingCompanyOptional.get();

        // Only update fields that were provided in request
        if (company.getName() != null) existingCompany.setName(company.getName());
        if (company.getLocation() != null) existingCompany.setLocation(company.getLocation());
        if (company.getEmail() != null) existingCompany.setEmail(company.getEmail());
        if (company.getCity() != null) existingCompany.setCity(company.getCity());
        if (company.getCountry() != null) existingCompany.setCountry(company.getCountry());
        if (company.getPhone() != null) existingCompany.setPhone(company.getPhone());
        if (company.getIndustrySector() != null) existingCompany.setIndustrySector(company.getIndustrySector());

        Company updatedCompany = companyService.modifyCompany(existingCompany);
        geocodingService.geocodeCompanyLocation(company);
        return ResponseEntity.ok(updatedCompany);
    }

    // New method to handle advanced search functionality
    @GetMapping("/search-companies")
    public List<Company> searchCompanies(
            @RequestParam(required = false) String industrySector,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "name") String sortField,
            @RequestParam(defaultValue = "true") boolean ascending
    ) {
        return companyService.searchCompanies(industrySector, country, city, sortField, ascending);
    }
    @GetMapping("/projects-per-company")
    public Map<String, Integer> getProjectsPerCompany() {
        return companyService.getProjectsPerCompany();
    }

    @GetMapping("/companies-by-industry-sector")
    public ResponseEntity<Map<String, Long>> getCompaniesByIndustrySector() {
        Map<String, Long> data = companyService.getCompaniesByIndustrySector();
        return ResponseEntity.ok(new LinkedHashMap<>(data));
    }

    @PostMapping("/geocode-company-location")
    public ResponseEntity<Company> geocodeCompanyLocation(@RequestBody Company company) {
        geocodingService.geocodeCompanyLocation(company);
        return ResponseEntity.ok(company);
    }
}
