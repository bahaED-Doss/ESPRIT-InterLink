package tn.esprit.interlink_back.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.interlink_back.entity.Documentt;
import tn.esprit.interlink_back.services.DocumentService;


import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // Récupérer les documents d'un utilisateur
    @GetMapping("/user/{userId}")
    public List<Documentt> getDocumentsByUser(@PathVariable Long userId) {
        return documentService.getDocumentsByUser(userId);
    }

    // Ajouter un nouveau documentt
    @RequestMapping(method = RequestMethod.POST, value = "/documents")
    public Documentt addDocument(@RequestBody Documentt documentt) {
        return documentService.saveDocument(documentt);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateDocument(@PathVariable Long id, @RequestBody Documentt documentt) {
        documentService.updateDocument(id, documentt);
        return ResponseEntity.ok().build();
    }
    // Supprimer un document
    @DeleteMapping("/{documentId}")
    public void deleteDocument(@PathVariable Long documentId) {
        documentService.deleteDocument(documentId);
    }
    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateDefaultDocument(@RequestParam String documentType,
                                                          @RequestParam String studentFullName,
                                                          @RequestParam String studentClass) {
        try {
            byte[] pdfBytes = documentService.generateDefaultDocument(documentType, studentFullName,studentClass);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", documentType + ".pdf");
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint for Lettre d'affectation
    @PostMapping("/letterOfAssignment")
    public ResponseEntity<byte[]> generateLetterOfAssignment(@RequestParam String studentFullName,
                                                             @RequestParam String className,
                                                             @RequestParam String companyName,
                                                             @RequestParam String companyAddress,
                                                             @RequestParam String companyEmail,
                                                             @RequestParam String companyPhone,
                                                             @RequestParam String stageStartDate,
                                                             @RequestParam String stageEndDate) {
        try {
            byte[] pdfBytes = documentService.generateLetterOfAssignment(studentFullName, className,
                    companyName, companyAddress, companyEmail, companyPhone, stageStartDate, stageEndDate);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "LetterOfAssignment.pdf");
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}