package tn.esprit.interlink_back.entity;

import jakarta.persistence.*;

@Entity
public class Documentt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String documentType;  // Type de document (lettre d'affectation, demande de stage, etc.)
    private String fileName;      // Nom du fichier téléchargé
    private String filePath;      // Chemin d'accès au fichier
    private String description;   // Description du document

    @ManyToOne
    @JoinColumn(name = "user_id")  // Foreign key to User entity
    private User user;             // L'utilisateur qui a téléchargé le document

    public Documentt() {}

    public Documentt(String documentType, String fileName, String filePath, String description, User user) {
        this.documentType = documentType;
        this.fileName = fileName;
        this.filePath = filePath;
        this.description = description;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
