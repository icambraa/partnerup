package com.partnerup.backend.controller;

import com.partnerup.backend.model.Report;
import com.partnerup.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody Report report) {
        if (report.getReporterId() == null || report.getAnuncioId() == null || report.getReason() == null) {
            return ResponseEntity.badRequest().body("Los campos reporterId, anuncioId y reason son obligatorios.");
        }
        Report newReport = reportService.createReport(report);
        return ResponseEntity.ok(newReport);
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReportStatus(@PathVariable Long id, @RequestBody Report updatedReport) {
        Report report = reportService.getReportById(id);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        report.setStatus(updatedReport.getStatus());
        reportService.updateReport(report);
        return ResponseEntity.ok(report);
    }
}