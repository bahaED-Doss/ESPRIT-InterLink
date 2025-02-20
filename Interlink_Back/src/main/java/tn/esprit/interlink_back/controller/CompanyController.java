package tn.esprit.interlink_back.controller;

import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Company;
import tn.esprit.interlink_back.service.ICompanyService;

import java.util.List;

@RestController
@RequestMapping("/company")
public class CompanyController {

    public final ICompanyService companyService;
    public CompanyController(ICompanyService companyService) {
        this.companyService = companyService;
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
    public Company modifyCompany(@RequestBody Company company) {
        return companyService.modifyCompany(company);
    }
}
