package tn.esprit.interlink_back.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Company;
import tn.esprit.interlink_back.repository.CompanyRepository;
import tn.esprit.interlink_back.services.GeocodingService;
import tn.esprit.interlink_back.services.ICompanyService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompanyServiceImpl implements ICompanyService {

    private final CompanyRepository companyRepository;
    private final GeocodingService geocodingService; // Add this

    public CompanyServiceImpl(CompanyRepository companyRepository, GeocodingService geocodingService) {
        this.companyRepository = companyRepository;
        this.geocodingService = geocodingService;
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
        geocodingService.geocodeCompanyLocation(company);
        enrichCompanyInfo(company); // ✅ Add this
        return companyRepository.save(company);
    }

    @Override
    public Company modifyCompany(Company company) {
        geocodingService.geocodeCompanyLocation(company);
        enrichCompanyInfo(company); // ✅ Add this
        return companyRepository.save(company);
    }


    @Override
    public void removeCompany(Long id) {
        companyRepository.deleteById(id);
    }


    // Modified method to search by Industry Sector, Country, and City with Sorting
    @Override
    public List<Company> searchCompanies(String industrySector, String location, String sortField, boolean ascending) {
        Sort sort = ascending ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();

        // Default empty strings to avoid null issues
        if (industrySector == null) industrySector = "";
        if (location == null) location = "";

        return companyRepository.searchCompanies(industrySector, location, sort);
    }


    @Override
    public Map<String, Integer> getProjectsPerCompany() {
        List<Company> companies = companyRepository.findAll();
        Map<String, Integer> result = new HashMap<>();
        for (Company company : companies) {
            result.put(company.getName(), company.getProjects() != null ? company.getProjects().size() : 0);
        }
        return result; // ✅ Returns a simple object
    }

    @Override
    public Map<String, Long> getCompaniesByIndustrySector() {
        List<Company> companies = companyRepository.findAll();
        Map<String, Long> result = new HashMap<>();
        for (Company company : companies) {
            result.put(company.getIndustrySector(), result.getOrDefault(company.getIndustrySector(), 0L) + 1);
        }
        return result; // ✅ Returns a simple object
    }

    @Override
    public void enrichCompanyInfo(Company company) {
        if (company.getWebsite() == null || company.getWebsite().isEmpty()) {
            company.setWebsite("https://www." + company.getName().toLowerCase().replaceAll("\\s+", "") + ".com");
        }

        company.setLogoUrl("https://logo.clearbit.com/" + company.getWebsite().replace("https://", ""));

        // 👇 This line makes it truly dynamic
        company.setDescription(fetchCompanyDescription(company.getName()));
    }

    @Override
    public String fetchCompanyDescription(String companyName) {
        try {
            String url = "https://api.duckduckgo.com/?q=" + URLEncoder.encode(companyName, "UTF-8") + "&format=json";
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
            br.close();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(response.toString());
            return jsonNode.get("Abstract").asText();
        } catch (Exception e) {
            return "No description available.";
        }
    }


}
