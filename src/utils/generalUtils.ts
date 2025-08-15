export function debounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
    let timer: NodeJS.Timeout | null = null;
    return ((...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    }) as T;
}