package com.partnerup.backend.service;

import com.partnerup.backend.model.Report;
import com.partnerup.backend.repository.ReportRepository;
import com.partnerup.backend.service.ReportService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private ReportService reportService;

    @Test
    public void testCreateReport() {
        Report report = new Report();
        when(reportRepository.save(any(Report.class))).thenReturn(report);

        Report result = reportService.createReport(report);

        assertNotNull(result);
        verify(reportRepository).save(report);
    }

    @Test
    public void testGetAllReports() {
        Report report = new Report();
        when(reportRepository.findAll()).thenReturn(Arrays.asList(report));

        List<Report> result = reportService.getAllReports();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(reportRepository).findAll();
    }

    @Test
    public void testGetReportById() {
        Long id = 1L;
        Report report = new Report();
        when(reportRepository.findById(id)).thenReturn(Optional.of(report));

        Report result = reportService.getReportById(id);

        assertNotNull(result);
        assertEquals(report, result);
        verify(reportRepository).findById(id);
    }

    @Test
    public void testUpdateReport() {
        Report report = new Report();
        when(reportRepository.save(any(Report.class))).thenReturn(report);

        Report result = reportService.updateReport(report);

        assertNotNull(result);
        verify(reportRepository).save(report);
    }

    @Test
    public void testUpdateReportsStatusByAnuncioId() {
        Long anuncioId = 1L;
        Report report = new Report();
        report.setStatus("oldStatus");
        List<Report> reports = Arrays.asList(report);

        when(reportRepository.findByAnuncioId(anuncioId)).thenReturn(reports);

        reportService.updateReportsStatusByAnuncioId(anuncioId, "newStatus");

        assertEquals("newStatus", report.getStatus());
        verify(reportRepository).findByAnuncioId(anuncioId);
        verify(reportRepository, times(reports.size())).save(report);
    }
}
