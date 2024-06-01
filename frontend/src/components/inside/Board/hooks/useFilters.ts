import { useState, useCallback } from 'react';

const useFilters = () => {
    const [selectedRole, setSelectedRole] = useState<string | null | undefined>(null);
    const [selectedRange, setSelectedRange] = useState<string | null | undefined>(null);
    const [filterData, setFilterData] = useState<{ rol?: string; rango?: string }>({});

    const handleFilterChange = useCallback((id: string, value: string | undefined | null) => {
        if (id === 'rol') {
            setSelectedRole(value);
            setFilterData(prev => ({ ...prev, rol: value ?? undefined }));
        } else if (id === 'rango') {
            setSelectedRange(value);
            setFilterData(prev => ({ ...prev, rango: value ?? undefined }));
        }
    }, []);

    return {
        selectedRole,
        selectedRange,
        filterData,
        handleFilterChange
    };
};

export default useFilters;
