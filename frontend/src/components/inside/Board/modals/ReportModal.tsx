import React from 'react';

interface ReportModalProps {
    showReportModal: boolean;
    setShowReportModal: (show: boolean) => void;
    reportMessage: string;
    setReportMessage: (message: string) => void;
    handleReportSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
                                                     showReportModal,
                                                     setShowReportModal,
                                                     reportMessage,
                                                     setReportMessage,
                                                     handleReportSubmit
                                                 }) => {
    if (!showReportModal) return null;

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">
                        Reportar Anuncio
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowReportModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleReportSubmit}>
                        <div className="mb-3">
                            <label htmlFor="reportMessage" className="form-label">Motivo del Reporte</label>
                            <textarea className="form-control" id="reportMessage" rows={3} required value={reportMessage} onChange={(e) => setReportMessage(e.target.value)}></textarea>
                        </div>
                        <div className="modal-footer" style={{ marginTop: '20px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)} style={{ marginRight: '10px' }}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">Enviar Reporte</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
