const useHandleChange = (setFormData: React.Dispatch<React.SetStateAction<any>>, setCurrentPage: React.Dispatch<React.SetStateAction<number>>) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prevFormData: any) => ({ ...prevFormData, [id]: checked }));
        } else {
            setFormData((prevFormData: any) => ({ ...prevFormData, [id]: value }));
        }
        setCurrentPage(0);
    };

    return handleChange;
};

export default useHandleChange;
