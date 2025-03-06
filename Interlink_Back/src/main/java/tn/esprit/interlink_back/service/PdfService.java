package tn.esprit.interlink_back.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Image;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.entity.Milestone;
import tn.esprit.interlink_back.repository.ProjectRepository;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class PdfService {

    @Autowired
    private ProjectRepository projectRepository;

    public byte[] generateAllProjectsPdf() throws DocumentException, IOException {
        // Create the document
        Document document = new Document();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, byteArrayOutputStream);
        document.open();

        // Add title
        document.add(new Paragraph("All Projects Overview", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
        document.add(new Chunk("\n"));

        // Retrieve all projects from the repository
        List<Project> projects = projectRepository.findAll();

        for (Project project : projects) {
            // Add project details
            document.add(new Paragraph("Project Title: " + project.getTitle(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("Description: " + project.getDescription()));
            document.add(new Paragraph("Start Date: " + project.getStartDate()));
            document.add(new Paragraph("End Date: " + project.getEndDate()));
            document.add(new Paragraph("Status: " + project.getStatus()));
            document.add(new Paragraph("Technologies Used: " + project.getTechnologiesUsed()));

            // Check if company exists and add it
            if (project.getCompany() != null) {
                document.add(new Paragraph("Company: " + project.getCompany().getName()));
            } else {
                document.add(new Paragraph("Company: Not assigned"));
            }

            // Add milestones for this project
            document.add(new Paragraph("Milestones:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            List<Milestone> milestones = project.getMilestones();
            for (Milestone milestone : milestones) {
                String milestoneStatus = (milestone.getStatus() != null) ? milestone.getStatus().toString() : "Status not set";
                document.add(new Paragraph("- " + milestone.getName() + " (Status: " + milestoneStatus + ")"));
            }

            // Add spacing between projects
            document.add(new Chunk("\n"));
        }

        // Add Project Manager's Signature at the end of the PDF
        document.add(new Chunk("\n\n"));
        document.add(new Paragraph("Project Manager Signature:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));

        try {
            // Load the image from classpath (resources/static folder)
            ClassPathResource imgPath = new ClassPathResource("static/signature.png"); // Path relative to resources
            File imgFile = imgPath.getFile();

            // Check if image exists before adding
            if (imgFile.exists()) {
                Image signatureImage = Image.getInstance(imgFile.getAbsolutePath());
                signatureImage.scaleToFit(300, 200); // Scale the image
                signatureImage.setAlignment(Element.ALIGN_LEFT);

                // Add image and project manager name
                document.add(signatureImage);
            } else {
                document.add(new Paragraph("Signature: (Image not found)"));
            }
        } catch (IOException e) {
            document.add(new Paragraph("Signature: (Error loading image)"));
        }

        // Close the document
        document.close();

        // Return PDF as byte array
        return byteArrayOutputStream.toByteArray();
    }
}
