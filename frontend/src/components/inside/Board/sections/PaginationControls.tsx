import React from 'react';

interface PaginationControlsProps {
    handleNextPage: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ handleNextPage }) => {
    return (
        <div className="pagination-controls text-center">
            <button onClick={handleNextPage} style={{ position: 'relative', left: '-40px' }}>
                <i className="bi bi-chevron-compact-down"></i>
            </button>
        </div>
    );
};

export default PaginationControls;
