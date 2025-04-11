package tn.esprit.interlink_back.controller;

import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.dtos.ProjectStatisticsDTO;
import tn.esprit.interlink_back.entity.Company;
import tn.esprit.interlink_back.entity.Enums.MilestoneStatus;
import tn.esprit.interlink_back.entity.Milestone;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.repository.CompanyRepository;
import tn.esprit.interlink_back.service.ExcelService;
import tn.esprit.interlink_back.service.IProjectService;
import tn.esprit.interlink_back.service.PdfService;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private final IProjectService projectService;
    @Autowired
    private CompanyRepository companyRepository;


    @Autowired
    private PdfService pdfService;

    @Autowired
    private ExcelService excelService;

    public ProjectController(IProjectService projectService, PdfService pdfService) {
        this.projectService = projectService;
        this.pdfService = pdfService;
    }

    @GetMapping("/retrieve-all-projects")
    public List<Project> getAllProjects() {
        return projectService.retrieveAllProjects();
    }

    @GetMapping("/project-by-id/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) {
        Project project = projectService.retrieveProject(projectId);
        return project != null ? ResponseEntity.ok(project) : ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/add-project", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> addProject(@RequestBody Project project) {
        Project savedProject = projectService.addProject(project);
        return ResponseEntity.ok(savedProject);
    }



    @PutMapping("/modify-project/{projectId}")
    public ResponseEntity<Project> updateProject(@PathVariable Long projectId, @RequestBody Project projectDetails) {
        Project existingProject = projectService.retrieveProject(projectId);
        if (existingProject == null) {
            return ResponseEntity.notFound().build();
        }

        existingProject.setTitle(projectDetails.getTitle());
        existingProject.setDescription(projectDetails.getDescription());
        existingProject.setStartDate(projectDetails.getStartDate());
        existingProject.setEndDate(projectDetails.getEndDate());
        existingProject.setStatus(projectDetails.getStatus());

        if (projectDetails.getTechnologiesUsed() != null && !projectDetails.getTechnologiesUsed().isEmpty()) {
            existingProject.setTechnologiesUsed(String.join(",", projectDetails.getTechnologiesUsed()));
        }

        return ResponseEntity.ok(projectService.modifyProject(existingProject));
    }

    @DeleteMapping("/remove-project/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.removeProject(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{projectId}/progress")
    public ResponseEntity<Integer> getProjectProgress(@PathVariable Long projectId) {
        int progress = projectService.calculateProjectProgress(projectId);
        return ResponseEntity.ok(progress);
    }

    @PutMapping("/{projectId}/milestone/{milestoneId}/update-status")
    public ResponseEntity<Milestone> updateMilestoneStatus(
            @PathVariable Long projectId,
            @PathVariable Long milestoneId,
            @RequestBody String status) {
        try {
            MilestoneStatus milestoneStatus = MilestoneStatus.valueOf(status.toUpperCase());
            Milestone updatedMilestone = projectService.updateMilestoneStatus(projectId, milestoneId, milestoneStatus);
            return ResponseEntity.ok(updatedMilestone);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/search")
    public List<Project> searchProjects(@RequestParam String keyword) {
        return projectService.searchProjects(keyword);
    }

    @GetMapping("/statistics/status")
    public ResponseEntity<List<ProjectStatisticsDTO>> getProjectStatistics() {
        return ResponseEntity.ok(projectService.getProjectStatusStatistics());
    }

    // New endpoint to generate a PDF of the project details
    @GetMapping("/generate-pdf-all-projects")
    public ResponseEntity<ByteArrayResource> generateAllProjectsPdf() {
        try {
            byte[] pdfContent = pdfService.generateAllProjectsPdf();

            if (pdfContent == null || pdfContent.length == 0) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=projects.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdfContent.length)
                    .body(new ByteArrayResource(pdfContent));
        } catch (Exception e) {
            logger.error("Error generating PDF for all projects", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }

    }
    @GetMapping("/generate-projects-excel")
    public ResponseEntity<byte[]> generateAllProjectsExcel() {
        try {
            // Generate Excel file as byte array
            byte[] excelContent = excelService.generateAllProjectsExcel();

            // Return Excel file as downloadable response
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=projects.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelContent);
        } catch (Exception e) {
            // Handle error
            return ResponseEntity.status(500).body(null);
        }
    }
}
