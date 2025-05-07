package tn.esprit.interlink_back.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import tn.esprit.interlink_back.entity.Enums.Role;

import java.time.LocalDate;

import java.util.*;

@Entity
@Table(name = "user") // Ensure the table name is "user"
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    @Column(nullable = true)
    private String googleId; // To store Google's unique ID
    @Column(nullable = true, unique = true)
    private String githubId; // Stocke l'ID unique GitHub
    @Column(nullable = true)
    private String photoUrl;
    @Column(nullable = true)
    private String facebook;

    @Column(nullable = true)
    private String githubLink;

    @Column(nullable = true)
    private String linkedin;

    @Column(nullable = true)
    private String instagram;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;

    private boolean enabled = true;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
    @Enumerated(EnumType.STRING)
    private Provider provider;
    // Student-specific fields
    @Column(nullable = true)
    private String levelOfStudy;

    @Column(nullable = true)
    private String phoneNumber;

    // HR-specific fields
    @Column(nullable = true)
    private String companyName;
    @Column(nullable = true)
    private String companyIdentifier;
    @Column(nullable = true)
    private String industrySector;
    @Column(nullable = true)
    private String companyAddress;
    @Column(nullable = true)
    private String city;
    @Column(nullable = true)
    private String country;
    // Company (For HR Users)
    @ManyToOne
    @JoinColumn(name = "company_id")
    @JsonBackReference
    private Company company;

    @Column(nullable = true)
    private String contactNumber;

    // Project Manager-specific fields
    @Column(nullable = true)
    private String department;
    @Column(nullable = true)
    private int yearsOfExperience;
    //@Lob
    //@Column(nullable = true)
    // private byte[] faceDescriptor;  // To store the face embedding (binary data)
    // New field for Face Descriptor
    @Column(nullable = true)
    private String faceDescriptor;
    @Column(nullable = true)
    private Boolean inactivityLogoutEnabled;  // New field for inactivity logout
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Skill> skills;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Documentt> documentts;

    // Convert the Set to a List when returning skills
    public List<Skill> getSkills() {
        if (skills == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(skills);
    }

    // Setter that accepts a List and stores it as a Set
    public void setSkills(List<Skill> skills) {
        if (skills != null) {
            this.skills = new HashSet<>(skills);
        } else {
            this.skills = null;
        }
    }
    // Getters and Setters for inactivityLogoutEnabled
    public Boolean getInactivityLogoutEnabled() {
        return inactivityLogoutEnabled;
    }

    public void setInactivityLogoutEnabled(Boolean inactivityLogoutEnabled) {
        this.inactivityLogoutEnabled = inactivityLogoutEnabled;
    }


    // Constructors
    public User() {}

    public User(String firstName, String lastName, LocalDate dateOfBirth, String gender,
                String email, String password, Role role, String githubId, String  photoUrl) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.role = role;
        this.githubId = githubId;
        this.photoUrl = photoUrl;
    }

    public User(String githubId, String firstName, String s, String email, String photoUrl, Role role) {
        this.githubId = githubId;
        this.firstName = firstName;
        this.lastName = s;
        this.email = email;
        this.photoUrl = photoUrl;
        this.role = role;
    }

    // Getters and Setters
    public String getFaceDescriptor() {
        return faceDescriptor;
    }

    public void setFaceDescriptor(String faceDescriptor) {
        this.faceDescriptor = faceDescriptor;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getGithubId() {
        return githubId;
    }
    public boolean isEnabled() {
        return enabled;
    }
    public void setGithubId(String githubId) {
        this.githubId = githubId;
    }
    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getGithubLink() {
        return githubLink;
    }

    public void setGithubLink(String githubLink) {
        this.githubLink = githubLink;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getLevelOfStudy() {
        return levelOfStudy;
    }

    public void setLevelOfStudy(String levelOfStudy) {
        this.levelOfStudy = levelOfStudy;
    }



    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyIdentifier() {
        return companyIdentifier;
    }

    public void setCompanyIdentifier(String companyIdentifier) {
        this.companyIdentifier = companyIdentifier;
    }

    public String getIndustrySector() {
        return industrySector;
    }

    public void setIndustrySector(String industrySector) {
        this.industrySector = industrySector;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }



    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }



    // ToString method
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", gender='" + gender + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                '}';
    }

    // Equals and HashCode methods (important for entity comparison)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }

    public Provider getProvider() {
        return provider;
    }

    public void setProvider(Provider provider) {
        this.provider = provider;
    }
    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }


}
