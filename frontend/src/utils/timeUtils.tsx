export function timeSince(date: number | Date) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return `hace ${interval} año${interval === 1 ? '' : 's'}`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return `hace ${interval} mes${interval === 1 ? '' : 'es'}`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return `hace ${interval} día${interval === 1 ? '' : 's'}`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return `hace ${interval} hora${interval === 1 ? '' : 's'}`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return `hace ${interval} minuto${interval === 1 ? '' : 's'}`;
    }
    return `hace ${Math.floor(seconds)} segundo${Math.floor(seconds) === 1 ? '' : 's'}`;
}