package tn.esprit.interlink_back.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    // This is the path where the files will be stored
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + File.separator + fileName);

        // Create directories if needed
        Files.createDirectories(path.getParent());
        file.transferTo(path);

        // Return a relative path that the client can use
        return "/uploads/" + fileName;
    }

    public File getFile(String fileName) {
        Path filePath = Paths.get(uploadDir + File.separator + fileName);
        return filePath.toFile();
    }
}
