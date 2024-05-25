package com.partnerup.backend.service;

import com.partnerup.backend.model.Report;
import com.partnerup.backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id).orElse(null);
    }

    public Report updateReport(Report report) {
        return reportRepository.save(report);
    }

    public void updateReportsStatusByAnuncioId(Long anuncioId, String status) {
        List<Report> reports = reportRepository.findByAnuncioId(anuncioId);
        for (Report report : reports) {
            report.setStatus(status);
            reportRepository.save(report);
        }
    }
}
