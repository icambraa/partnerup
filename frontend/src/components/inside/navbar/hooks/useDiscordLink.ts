const useDiscordLink = () => {
    const obtenerEnlaceDiscord = async (anuncioId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/anuncios/${anuncioId}/discord-link`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const discordLink = await response.text();
                return discordLink;
            } else {
                throw new Error('Failed to fetch Discord link');
            }
        } catch (error) {
            console.error('Error fetching Discord link:', error);
            return '';
        }
    };

    return { obtenerEnlaceDiscord };
};

export default useDiscordLink;
