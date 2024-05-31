import { useEffect, useRef, useCallback } from 'react';
import { Anuncio } from '../../../../interfaces/AnuncioInterface.ts';

const useFetchAnuncios = (
    setAnuncios: React.Dispatch<React.SetStateAction<Anuncio[]>>,
    currentPage: number,
    filterData: any,
    pageSize: number,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
    const isLoading = useRef(false);

    const fetchAnuncios = useCallback(async () => {
        if (isLoading.current) return;
        isLoading.current = true;
        try {
            const url = new URL('http://localhost:8080/api/anuncios');
            url.searchParams.append('page', currentPage.toString());
            url.searchParams.append('size', pageSize.toString());

            if (filterData.rol) {
                url.searchParams.append('rol', filterData.rol);
            }
            if (filterData.rango) {
                url.searchParams.append('rango', filterData.rango);
            }

            const response = await fetch(url);
            if (response.ok) {
                const { content, totalPages } = await response.json();
                setAnuncios(prevAnuncios => currentPage === 0 ? content : [...prevAnuncios, ...content]);
                setTotalPages(totalPages);
            } else {
                console.error('Error al obtener los anuncios');
            }
        } catch (error) {
            console.error('Error al obtener los anuncios', error);
        }
        isLoading.current = false;
    }, [currentPage, filterData, pageSize, setAnuncios, setTotalPages]);

    useEffect(() => {
        fetchAnuncios();
    }, [fetchAnuncios]);

    return fetchAnuncios;
};

export default useFetchAnuncios;
