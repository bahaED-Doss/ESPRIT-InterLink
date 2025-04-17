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
import java.io.IOException;
import java.util.List;

import com.itextpdf.text.pdf.*;

@Service
public class PdfService {

    @Autowired
    private ProjectRepository projectRepository;

    // Custom colors
    private static final BaseColor TITLE_COLOR = new BaseColor(0, 102, 204); // Blue
    private static final BaseColor HEADER_COLOR = new BaseColor(255, 153, 0); // Orange
    private static final BaseColor TABLE_HEADER_COLOR = new BaseColor(230, 230, 230); // Light gray

    public byte[] generateAllProjectsPdf() throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, byteArrayOutputStream);

        // Add footer with page numbers
        writer.setPageEvent(new PdfPageEventHelper() {
            public void onEndPage(PdfWriter writer, Document document) {
                ColumnText.showTextAligned(writer.getDirectContent(), Element.ALIGN_CENTER,
                        new Phrase("Page " + document.getPageNumber(),
                                FontFactory.getFont(FontFactory.HELVETICA, 10)),
                        300, 30, 0);
            }
        });

        document.open();

        // Add header logo
        try {
            Image logo = Image.getInstance(new ClassPathResource("static/logo.png").getURL());
            logo.scaleToFit(100, 50);
            logo.setAbsolutePosition(40, 750); // Position (x,y)
            writer.getDirectContent().addImage(logo);
        } catch (Exception e) {
            // Handle missing logo silently
        }

        // Title
        Paragraph title = new Paragraph("All Projects Report",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, TITLE_COLOR));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Project list
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            addProjectSection(document, project);
        }

        // Signature
        addSignature(document);

        document.close();
        return byteArrayOutputStream.toByteArray();
    }

    private void addProjectSection(Document document, Project project) throws DocumentException {
        // Project title
        Paragraph projectTitle = new Paragraph(project.getTitle(),
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
        projectTitle.setSpacingBefore(15);
        document.add(projectTitle);

        // Details
        document.add(createDetailRow("Description:", project.getDescription()));
        document.add(createDetailRow("Dates:", project.getStartDate() + " - " + project.getEndDate()));
        document.add(createDetailRow("Status:", String.valueOf(project.getStatus()), getStatusColor(String.valueOf(project.getStatus()))));
        document.add(createDetailRow("Technologies:", project.getTechnologiesUsed()));

        // Milestones table
        document.add(new Paragraph("Milestones:",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, HEADER_COLOR)));

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(5);

        // Table header
        addTableHeader(table, "Milestone Name", "Status");

        // Table rows
        for (Milestone milestone : project.getMilestones()) {
            String status = (milestone.getStatus() != null) ? milestone.getStatus().toString() : "N/A";
            addTableRow(table, milestone.getName(), status);
        }

        document.add(table);
    }

    private void addSignature(Document document) throws DocumentException {
        try {
            document.add(new Chunk("\n\n"));
            Paragraph signatureTitle = new Paragraph("Project Manager Signature:",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
            document.add(signatureTitle);

            Image signature = Image.getInstance(new ClassPathResource("static/signature.png").getFile().getAbsolutePath());
            signature.scaleToFit(300, 200);
            signature.setAlignment(Element.ALIGN_LEFT);
            document.add(signature);
        } catch (Exception e) {
            document.add(new Paragraph("Signature: [Image not found]"));
        }
    }

    // Helper methods
    private Paragraph createDetailRow(String label, String value) {
        return createDetailRow(label, value, BaseColor.BLACK);
    }

    private Paragraph createDetailRow(String label, String value, BaseColor color) {
        Paragraph p = new Paragraph();
        p.add(new Chunk(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.DARK_GRAY)));
        p.add(new Chunk(value, FontFactory.getFont(FontFactory.HELVETICA, 10, color)));
        return p;
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header,
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
            cell.setBackgroundColor(TABLE_HEADER_COLOR);
            cell.setPadding(5);
            table.addCell(cell);
        }
    }

    private void addTableRow(PdfPTable table, String... values) {
        for (String value : values) {
            table.addCell(new Phrase(value,
                    FontFactory.getFont(FontFactory.HELVETICA, 10)));
        }
    }

    private BaseColor getStatusColor(String status) {
        if (status == null) return BaseColor.BLACK;

        // Convert status to lowercase safely
        String statusLower = status.toLowerCase();

        return switch (statusLower) {
            case "completed" -> new BaseColor(0, 128, 0); // Green
            case "in progress" -> new BaseColor(255, 165, 0); // Orange
            default -> BaseColor.BLACK;
        };
    }

    // Inner class for footer
    // Inside PdfService.java

// ...

    private static class FooterPageEventHelper extends PdfPageEventHelper { // Renamed inner class
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            ColumnText.showTextAligned(
                    writer.getDirectContent(),
                    Element.ALIGN_CENTER,
                    new Phrase("Page " + document.getPageNumber(),
                            FontFactory.getFont(FontFactory.HELVETICA, 10)),
                    300, 30, 0
            );
        }
    }
}