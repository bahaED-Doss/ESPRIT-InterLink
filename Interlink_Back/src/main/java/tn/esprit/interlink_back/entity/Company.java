package tn.esprit.interlink_back.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("companyId")
    private Long companyId;

    @JsonProperty("name")  // Ensures correct mapping
    private String name;

    @JsonProperty("location")
    private String location;

    @JsonProperty("email")
    private String email;

    @JsonProperty("city")
    private String city;

    @JsonProperty("country")
    private String country;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("industrySector")
    private String industrySector;


    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> projects; // A company can have multiple projects


    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<User> employees; // HRs and other users linked to the company

}
