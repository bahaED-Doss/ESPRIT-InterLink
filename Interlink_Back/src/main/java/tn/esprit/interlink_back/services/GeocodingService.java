package tn.esprit.interlink_back.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.interlink_back.entity.Company;

@Service
public class GeocodingService {

    private static final String API_URL = "https://api.opencagedata.com/geocode/v1/json?q=%s&key=fa7a3faf59cf458fa9baced1f71e81bf";

    private final RestTemplate restTemplate;

    public GeocodingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void geocodeCompanyLocation(Company company) {
        if (company.getLocation() != null && !company.getLocation().isEmpty()) {
            String location = company.getLocation();
            String url = String.format(API_URL, location);
            try {
                // Call the external geocoding API
                GeocodingResponse response = restTemplate.getForObject(url, GeocodingResponse.class);
                if (response != null && response.getResults() != null && response.getResults().length > 0) {
                    // Assuming that the first result is the most accurate
                    double latitude = response.getResults()[0].getGeometry().getLat();
                    double longitude = response.getResults()[0].getGeometry().getLng();
                    company.setLatitude(latitude);
                    company.setLongitude(longitude);
                }
            } catch (Exception e) {
                // Handle exception (API issues, etc.)
                System.err.println("Error geocoding company location: " + e.getMessage());
            }
        }
    }

    // Geocoding Response classes (adjust based on your API's actual response format)
    public static class GeocodingResponse {
        private GeocodingResult[] results;

        public GeocodingResult[] getResults() {
            return results;
        }

        public void setResults(GeocodingResult[] results) {
            this.results = results;
        }
    }

    public static class GeocodingResult {
        private GeocodingGeometry geometry;

        public GeocodingGeometry getGeometry() {
            return geometry;
        }

        public void setGeometry(GeocodingGeometry geometry) {
            this.geometry = geometry;
        }
    }

    public static class GeocodingGeometry {
        private double lat;
        private double lng;

        public double getLat() {
            return lat;
        }

        public void setLat(double lat) {
            this.lat = lat;
        }

        public double getLng() {
            return lng;
        }

        public void setLng(double lng) {
            this.lng = lng;
        }
    }
}
