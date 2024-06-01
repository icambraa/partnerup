import { useState, useCallback } from 'react';

const usePagination = (initialPage: number, pageSize: number) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(0);

    const handleNextPage = useCallback(() => {
        setCurrentPage(prevPage => prevPage + 1);
    }, []);

    const handlePreviousPage = useCallback(() => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    }, []);

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        pageSize,
        handleNextPage,
        handlePreviousPage
    };
};

export default usePagination;
