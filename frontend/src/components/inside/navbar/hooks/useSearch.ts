import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const useSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/profile/${encodeURIComponent(searchTerm)}`);
    };

    return {
        searchTerm,
        handleSearchChange,
        handleSearchSubmit,
    };
};

export default useSearch;
