package com.partnerup.backend.controller;

import com.partnerup.backend.controller.ReportController;
import com.partnerup.backend.model.Report;
import com.partnerup.backend.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class ReportControllerTest {

    @Mock
    private ReportService reportService;

    @InjectMocks
    private ReportController reportController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(reportController).build();
    }

    @Test
    public void testCreateReport() throws Exception {
        Report report = new Report();
        report.setReporterId("testReporter");
        report.setAnuncioId(1L);
        report.setReason("testReason");

        when(reportService.createReport(any(Report.class))).thenReturn(report);

        mockMvc.perform(post("/api/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"reporterId\":\"testReporter\", \"anuncioId\":1, \"reason\":\"testReason\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reporterId").value("testReporter"))
                .andExpect(jsonPath("$.anuncioId").value(1))
                .andExpect(jsonPath("$.reason").value("testReason"));
    }

    @Test
    public void testGetAllReports() throws Exception {
        Report report = new Report();
        when(reportService.getAllReports()).thenReturn(Arrays.asList(report));

        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());
    }

    @Test
    public void testUpdateReportStatus() throws Exception {
        Long id = 1L;
        Report report = new Report();
        report.setId(id);
        report.setStatus("oldStatus");

        when(reportService.getReportById(id)).thenReturn(report);
        when(reportService.updateReport(any(Report.class))).thenReturn(report);

        mockMvc.perform(put("/api/reports/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"newStatus\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("newStatus"));
    }
}
