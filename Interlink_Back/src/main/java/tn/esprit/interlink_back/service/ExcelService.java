package tn.esprit.interlink_back.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.interlink_back.entity.Project;
import tn.esprit.interlink_back.repository.ProjectRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelService {

    @Autowired
    private ProjectRepository projectRepository;

    public byte[] generateAllProjectsExcel() throws IOException {
        // Create workbook and sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Projects");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Project Title", "Description", "Start Date", "End Date", "Status", "Technologies Used", "Company", "Milestones"};
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Get all projects
        List<Project> projects = projectRepository.findAll();
        int rowIndex = 1;

        // Loop through the projects and add rows to the Excel sheet
        for (Project project : projects) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(project.getTitle());
            row.createCell(1).setCellValue(project.getDescription());
            row.createCell(2).setCellValue(project.getStartDate().toString());
            row.createCell(3).setCellValue(project.getEndDate().toString());
            row.createCell(4).setCellValue(project.getStatus().toString());
            row.createCell(5).setCellValue(project.getTechnologiesUsed());

            // Add company name
            if (project.getCompany() != null) {
                row.createCell(6).setCellValue(project.getCompany().getName());
            } else {
                row.createCell(6).setCellValue("Not assigned");
            }

            // Add milestones (just a simple string representation)
            StringBuilder milestones = new StringBuilder();
            project.getMilestones().forEach(milestone -> milestones.append(milestone.getName()).append("; "));
            row.createCell(7).setCellValue(milestones.toString());
        }

        // Write to ByteArrayOutputStream
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        workbook.write(byteArrayOutputStream);
        workbook.close();

        // Return Excel as byte array
        return byteArrayOutputStream.toByteArray();
    }
}
