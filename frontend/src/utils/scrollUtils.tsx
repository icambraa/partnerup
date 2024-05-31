export const smoothScroll = (targetY: number) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 100;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        window.scrollTo(0, startY + distance * progress);
        if (timeElapsed < duration) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
};