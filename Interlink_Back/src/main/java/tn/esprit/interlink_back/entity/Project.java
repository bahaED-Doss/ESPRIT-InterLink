package tn.esprit.interlink_back.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("projectId")
    private Long projectId;

    @JsonProperty("title")
    private String title;

    @JsonProperty("description")
    private String description;

    @JsonProperty("status")
    private String status; // e.g., "Active", "Completed", "On-Hold"

    @JsonProperty("technologiesUsed")
    private String technologiesUsed;

    @JsonProperty("startDate")
    private LocalDate startDate;

    @JsonProperty("endDate")
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore  // Use @JsonIgnore instead of @JsonManagedReference
    @JoinColumn(name = "company_id")
    private Company company;


    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Milestone> milestones = new ArrayList<>();

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "manager_id")
    private User projectManager;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    public User getProjectManager() {
        return projectManager;
    }

    public Long getProjectId() {
        return projectId;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTechnologiesUsed() {
        return technologiesUsed;
    }

    public void setTechnologiesUsed(String technologiesUsed) {
        this.technologiesUsed = technologiesUsed;
    }
    public List<Milestone> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<Milestone> milestones) {
        this.milestones = milestones;
    }
    public Company getCompany() {
        return company;
    }
    public void setCompany(Company company) {this.company = company;}





}
