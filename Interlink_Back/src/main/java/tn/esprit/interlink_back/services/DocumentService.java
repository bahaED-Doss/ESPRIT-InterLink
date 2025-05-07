package tn.esprit.interlink_back.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Documentt;
import tn.esprit.interlink_back.repository.DocumentRepository;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;

@Service
public class DocumentService {
    @Autowired
    private DocumentRepository documentRepository;
    // Method to get documents by user ID
    // Sauvegarder un documentt
    public Documentt saveDocument(Documentt documentt) {
        return documentRepository.save(documentt);
    }

    // Récupérer les documents d'un utilisateur
    public Documentt getDocumentsByUser(Long userId) {
        return (Documentt) documentRepository.findByUserId(userId);
    }

    // Supprimer un document
    public void deleteDocument(Long documentId) {
        documentRepository.deleteById(documentId);
    }

    public void updateDocument(Long id, Documentt documentt) {
    }


    // Generates a "Lettre d'affectation" using additional company details.
    public byte[] generateLetterOfAssignment(String studentFullName, String className, String companyName,
                                             String companyAddress, String companyEmail, String companyPhone,
                                             String stageStartDate, String stageEndDate) throws Exception {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);

        document.open();

        // 1) Add logo at the top-left
        try (InputStream logoStream = getClass().getResourceAsStream("/images/esprit_logo.jpg")) {
            if (logoStream != null) {
                Image logo = Image.getInstance(org.apache.commons.io.IOUtils.toByteArray(logoStream));
                logo.scaleToFit(100, 100);
                logo.setAbsolutePosition(50, 750); // top-left
                document.add(logo);
            }
        } catch (Exception e) {
            System.err.println("Logo not found or cannot be loaded: " + e.getMessage());
        }

        // 2) Add date at the top-right
        Paragraph date = new Paragraph("Tunis, le : " + LocalDate.now(), FontFactory.getFont(FontFactory.HELVETICA, 12));
        date.setAlignment(Element.ALIGN_RIGHT);
        date.setSpacingBefore(20);
        document.add(date);

        document.add(new Paragraph(" ")); // spacing

        // 3) Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Paragraph title = new Paragraph("Lettre d'affectation", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(20);
        document.add(title);

        // 4) Company name
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Paragraph companyPara = new Paragraph("Suite à l’accord de la Société : " + companyName, boldFont);
        companyPara.setSpacingBefore(15);
        document.add(companyPara);

        // 5) Student info
        document.add(new Paragraph("L’étudiant(e) : " + studentFullName));
        document.add(new Paragraph("Inscrit(e) en : " + className));

        // 6) Stage period
        document.add(new Paragraph("est affecté(e) à «" + companyName + "» pour effectuer un stage obligatoire, "
                + "et ce du " + stageStartDate + " au " + stageEndDate + "."));

        document.add(new Paragraph("Par ailleurs, il/elle est assuré(e) auprès de la Star Assurances par le contrat N°331.102919"));

        // 7) Add signature image at the bottom right
        try (InputStream signatureStream = getClass().getResourceAsStream("/images/signature.png")) {
            if (signatureStream != null) {
                Image signature = Image.getInstance(org.apache.commons.io.IOUtils.toByteArray(signatureStream));
                signature.scaleToFit(100, 50);
                signature.setAbsolutePosition(400, 150); // bottom-right
                document.add(signature);
            }
        } catch (Exception e) {
            System.err.println("Signature not found or cannot be loaded: " + e.getMessage());
        }

        document.close();
        return baos.toByteArray();
    }
    public byte[] generateDefaultDocument(String documentType, String studentFullName, String studentClass) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        document.open();

        // Add logo
        try (InputStream logoStream = getClass().getResourceAsStream("/images/esprit_logo.jpg")) {
            if (logoStream != null) {
                Image logo = Image.getInstance(logoStream.readAllBytes());
                logo.scaleAbsolute(100f, 50f);
                logo.setAbsolutePosition(450, 770); // top-right corner
                document.add(logo);
            }
        }

        // Add date
        Paragraph date = new Paragraph("Tunis, le : " + LocalDate.now(), new Font(Font.FontFamily.HELVETICA, 12));
        date.setAlignment(Element.ALIGN_RIGHT);
        document.add(date);

        document.add(Chunk.NEWLINE); // spacing

        if ("stageRequest".equals(documentType)) {
            document.add(new Paragraph("A l’aimable attention de la Direction Générale", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
            document.add(new Paragraph("Objet: Demande de Stage", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Madame, Monsieur,"));
            document.add(new Paragraph("L’Ecole Supérieure Privée d’Ingénierie et de Technologies, ESPRIT , est un établissement "
                    + "d’enseignement supérieur privé ayant pour objet principal, la formation d’ingénieurs..."));

            Paragraph studentParagraph = new Paragraph();
            studentParagraph.setIndentationLeft(40);
            studentParagraph.add("L’étudiant(e) : " + studentFullName + "\n");
            studentParagraph.add("Inscrit(e) en : " + studentClass);
            document.add(studentParagraph);

            document.add(new Paragraph("Pour effectuer un stage obligatoire, au sein de votre honorable société..."));

            // Add signature
            try (InputStream sigStream = getClass().getResourceAsStream("/images/signature.png")) {
                if (sigStream != null) {
                    Image signature = Image.getInstance(sigStream.readAllBytes());
                    signature.scaleAbsolute(100f, 50f);
                    signature.setAbsolutePosition(400, 100); // bottom-right
                    document.add(signature);
                }
            }
        }

        document.close();
        return baos.toByteArray();
    }
}


