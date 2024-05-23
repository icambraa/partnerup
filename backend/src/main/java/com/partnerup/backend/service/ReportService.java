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

}
