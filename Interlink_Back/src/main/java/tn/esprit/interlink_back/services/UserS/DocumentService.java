package tn.esprit.interlink_back.services.UserS;

import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Documentt;
import tn.esprit.interlink_back.repository.DocumentRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.Document;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;

import com.itextpdf.layout.element.*;

import java.io.InputStream;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    // Sauvegarder un documentt
    public Documentt saveDocument(Documentt documentt) {
        return documentRepository.save(documentt);
    }

    // Récupérer les documents d'un utilisateur
    public List<Documentt> getDocumentsByUser(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    // Supprimer un document
    public void deleteDocument(Long documentId) {
        documentRepository.deleteById(documentId);
    }

    public void updateDocument(Long id, Documentt documentt) {
    }
    // Generates a default "Demande de stage" or "Journal de stage" document.
    public byte[] generateDefaultDocument(String documentType, String studentFullName, String studentClass) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

// Ensure the first page exists
        pdf.addNewPage(); // This ensures the page is created

// 1) Add the logo at the top-left (or top-right)
        try (InputStream logoStream = getClass().getResourceAsStream("/images/esprit_logo.jpg")) {
            if (logoStream != null) {
                ImageData logoData = ImageDataFactory.create(logoStream.readAllBytes());
                Image logo = new Image(logoData);
                logo.setWidth(100);  // Adjust as needed
                logo.setFixedPosition(pdf.getNumberOfPages(), 250, 790); // Position at the top-right
                document.add(logo);
            }
        } catch (Exception e) {
            System.err.println("Logo not found or cannot be loaded: " + e.getMessage());
        }

// 2) Add the date in top-right
        Paragraph dateParagraph = new Paragraph("Tunis, le : " + LocalDate.now())
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(20);
        document.add(dateParagraph);

        // 3) Add some spacing
        document.add(new Paragraph(" ")); // blank line

        if ("stageRequest".equals(documentType)) {
            // *** DEMANDE DE STAGE ***

            // Title: "A l’aimable attention de la Direction Générale"
            Text titleText = new Text("A l’aimable attention de la Direction Générale\n")
                    .setBold()
                    .setFontSize(12);
            Paragraph titleParagraph = new Paragraph(titleText);
            document.add(titleParagraph);

            // Objet: Demande de Stage
            Text objetText = new Text("Objet: Demande de Stage").setBold();
            Paragraph objetParagraph = new Paragraph(objetText)
                    .setMarginTop(5);
            document.add(objetParagraph);

            // Intro paragraphs
            document.add(new Paragraph("Madame, Monsieur,").setMarginTop(10));

            document.add(new Paragraph(
                    "L’Ecole Supérieure Privée d’Ingénierie et de Technologies, ESPRIT , est un établissement "
                            + "d’enseignement supérieur privé ayant pour objet principal, la formation d’ingénieurs dans les "
                            + "domaines des technologies de l’information et de la communication.\n"
                            + "\nNotre objectif consiste à former des ingénieurs opérationnels au terme de leur formation.\n"
                            + "\nDès lors, nous encourageons nos élèves à mettre en pratique le savoir et les compétences qu’ils "
                            + "ont acquis au cours de leur cursus universitaire.\n"
                            + "\nC’est également dans le but de les amener à s’intégrer dans l’environnement de l’entreprise que "
                            + "nous vous demandons de bien vouloir accepter :\n"
            ));

            // Indent the mention of student name & class
            Paragraph studentParagraph = new Paragraph(
                    "L’étudiant(e) :  " + studentFullName + "\n"
                            + "Inscrit(e) en :  " + studentClass + "\n");
            studentParagraph.setMarginLeft(40);
            document.add(studentParagraph);

            document.add(new Paragraph(
                    "Pour effectuer un stage obligatoire, au sein de votre honorable société.\n\n"
                            + "Nous restons à votre entière disposition pour tout renseignement complémentaire.\n\n"
                            + "En vous remerciant pour votre précieux soutien, nous vous prions d’agréer, Madame, Monsieur, "
                            + "l’expression de nos salutations distinguées.\n"
            ));

            // Add signature image at the bottom right
            try (InputStream signatureStream = getClass().getResourceAsStream("/images/signature.png")) {
                if (signatureStream != null) {
                    ImageData signatureData = ImageDataFactory.create(signatureStream.readAllBytes());
                    Image signatureImage = new Image(signatureData);
                    signatureImage.setWidth(100); // adjust size

                    // If you want it explicitly placed, do something like:
                    signatureImage.setFixedPosition(pdf.getNumberOfPages(), 400, 100);
                    pdf.addNewPage(); // or not, if you want it on the same page
                    // or just add as normal
                    document.add(signatureImage);
                }
            } catch (Exception e) {
                System.err.println("Signature not found or cannot be loaded: " + e.getMessage());
            }

        } else if ("stageJournal".equals(documentType)) {
            // *** JOURNAL DE STAGE ***
            document.add(new Paragraph("Journal de Stage").setBold().setFontSize(14));
            document.add(new Paragraph(
                    "Ce document est un exemple d’un template pour le journal de stage...\n"
                            + "Vous pouvez ajouter ici des tableaux, des sections journalières, etc."
            ));
        }
        // ... add more 'else if' for other default documents if needed

        // Close
        document.close();
        return baos.toByteArray();
    }

    // Generates a "Lettre d'affectation" using additional company details.
    public byte[] generateLetterOfAssignment(String studentFullName, String className, String companyName,
                                             String companyAddress, String companyEmail, String companyPhone,
                                             String stageStartDate, String stageEndDate) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Ensure that a new page is created before adding any content
        pdf.addNewPage();

        // 1) Add logo at the top-left
        try (InputStream logoStream = getClass().getResourceAsStream("/images/esprit_logo.jpg")) {
            if (logoStream != null) {
                ImageData logoData = ImageDataFactory.create(logoStream.readAllBytes());
                Image logo = new Image(logoData);
                logo.setWidth(100);  // Adjust as needed
                logo.setFixedPosition(pdf.getNumberOfPages(), 50, 790); // Position at the top-left
                document.add(logo);
            }
        } catch (Exception e) {
            System.err.println("Logo not found or cannot be loaded: " + e.getMessage());
        }

        // 2) Add date in top-right
        Paragraph dateParagraph = new Paragraph("Tunis, le : " + LocalDate.now())
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(20);
        document.add(dateParagraph);

        // 3) Add some spacing
        document.add(new Paragraph(" ")); // blank line

        // Title: "Lettre d'affectation"
        Text titleText = new Text("Lettre d'affectation")
                .setBold()
                .setFontSize(16);
        Paragraph titleParagraph = new Paragraph(titleText)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(titleParagraph);

        // Add company name in bold
        Text companyText = new Text("Suite à l’accord de la Société : " + companyName)
                .setBold()
                .setFontSize(12);
        document.add(new Paragraph(companyText).setMarginTop(10));

        // Student information
        document.add(new Paragraph("L’étudiant(e) : " + studentFullName));
        document.add(new Paragraph("Inscrit(e) en : " + className)); // level of study

        // Add stage period with start and end date
        document.add(new Paragraph("est affecté(e) à «" + companyName + "» pour effectuer un stage obligatoire, "
                + "et ce du " + stageStartDate + " au " + stageEndDate + ".")); // Add start and end dates

        document.add(new Paragraph("Par ailleurs, il/elle est assuré(e) auprès de la Star Assurances par le contrat N°331.102919"));

        // Add signature image at the bottom right
        try (InputStream signatureStream = getClass().getResourceAsStream("/images/signature.png")) {
            if (signatureStream != null) {
                ImageData signatureData = ImageDataFactory.create(signatureStream.readAllBytes());
                Image signatureImage = new Image(signatureData);
                signatureImage.setWidth(100); // adjust size
                signatureImage.setFixedPosition(pdf.getNumberOfPages(), 400, 370);
                document.add(signatureImage);
            }
        } catch (Exception e) {
            System.err.println("Signature not found or cannot be loaded: " + e.getMessage());
        }

        // Close the document
        document.close();

        // Return the generated PDF as byte array
        return baos.toByteArray();
    }

}