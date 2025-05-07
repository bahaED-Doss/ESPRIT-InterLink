package tn.esprit.interlink_back.service;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Milestone;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.repository.ProjectRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class PdfService {

    @Autowired
    private ProjectRepository projectRepository;

    private static final DeviceRgb TITLE_COLOR = new DeviceRgb(0, 102, 204);
    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(255, 153, 0);
    private static final DeviceRgb TABLE_HEADER_COLOR = new DeviceRgb(230, 230, 230);

    public byte[] generateAllProjectsPdf() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Footer event handler
        pdfDoc.addEventHandler(PdfDocumentEvent.END_PAGE, new FooterHandler());

        // Logo
        try {
            Image logo = new Image(ImageDataFactory.create(new ClassPathResource("static/logo.png").getURL()));
            logo.scaleToFit(100, 50);
            document.add(logo);
        } catch (Exception e) {
            // Logo missing
        }

        // Title
        Paragraph title = new Paragraph("All Projects Report")
                .setFontSize(18)
                .setFontColor(TITLE_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setMarginBottom(20);
        document.add(title);

        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            addProjectSection(document, project);
        }

        addSignature(document);

        document.close();
        return baos.toByteArray();
    }

    private void addProjectSection(Document document, Project project) {
        document.add(new Paragraph(project.getTitle())
                .setFontSize(14)
                .setBold()
                .setMarginTop(20));

        document.add(createDetail("Description: ", project.getDescription()));
        document.add(createDetail("Dates: ", project.getStartDate() + " - " + project.getEndDate()));
        document.add(createDetail("Status: ", String.valueOf(project.getStatus()), getStatusColor(project.getStatus())));
        document.add(createDetail("Technologies: ", project.getTechnologiesUsed()));

        document.add(new Paragraph("Milestones:")
                .setFontSize(12)
                .setBold()
                .setFontColor(HEADER_COLOR)
                .setMarginTop(10));

        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();

        // Header
        addTableHeader(table, "Milestone Name", "Status");

        // Rows
        for (Milestone milestone : project.getMilestones()) {
            String status = (milestone.getStatus() != null) ? milestone.getStatus().toString() : "N/A";
            table.addCell(new Cell().add(new Paragraph(milestone.getName())));
            table.addCell(new Cell().add(new Paragraph(status)));
        }

        document.add(table);
    }

    private void addSignature(Document document) {
        document.add(new Paragraph("\n\n"));
        document.add(new Paragraph("Project Manager Signature:").setBold());

        try {
            Image signature = new Image(ImageDataFactory.create(new ClassPathResource("static/signature.png").getURL()));
            signature.scaleToFit(200, 100);
            document.add(signature);
        } catch (Exception e) {
            document.add(new Paragraph("[Signature image not found]"));
        }
    }

    private Paragraph createDetail(String label, String value) {
        return createDetail(label, value, ColorConstants.BLACK);
    }

    private Paragraph createDetail(String label, String value, DeviceRgb color) {
        return new Paragraph()
                .add(new Text(label).setBold().setFontColor(ColorConstants.DARK_GRAY))
                .add(new Text(value).setFontColor(color))
                .setFontSize(10);
    }

    private void addTableHeader(Table table, String... headers) {
        for (String header : headers) {
            Cell cell = new Cell()
                    .add(new Paragraph(header).setBold())
                    .setBackgroundColor(TABLE_HEADER_COLOR)
                    .setPadding(5);
            table.addHeaderCell(cell);
        }
    }

    private DeviceRgb getStatusColor(String status) {
        if (status == null) return ColorConstants.BLACK;
        return switch (status.toLowerCase()) {
            case "completed" -> new DeviceRgb(0, 128, 0);        // Green
            case "in progress" -> new DeviceRgb(255, 165, 0);    // Orange
            default -> ColorConstants.BLACK;
        };
    }

    private static class FooterHandler implements IEventHandler {
        @Override
        public void handleEvent(Event event) {
            PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
            PdfCanvas canvas = new PdfCanvas(docEvent.getPage());
            canvas.beginText()
                    .setFontAndSize(PdfFontFactory.createFont(), 10)
                    .moveText(300, 30)
                    .showText("Page " + docEvent.getDocument().getPageNumber(docEvent.getPage()))
                    .endText();
        }
    }
}
