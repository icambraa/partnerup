export interface FilterSectionProps {
    selectedRole: string | null | undefined;
    selectedRange: string | null | undefined;
    handleFilterChange: (id: string, value: string | undefined | null) => void;
    setShowModal: (show: boolean) => void;
}
