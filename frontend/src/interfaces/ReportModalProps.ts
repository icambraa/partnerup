export interface ReportModalProps {
    showReportModal: boolean;
    setShowReportModal: (show: boolean) => void;
    reportMessage: string;
    setReportMessage: (message: string) => void;
    handleReportSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
