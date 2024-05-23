package com.partnerup.backend.controller;

import com.partnerup.backend.model.Report;
import com.partnerup.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
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

}
