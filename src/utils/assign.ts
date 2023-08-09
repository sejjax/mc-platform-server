export function assign<T extends object>(to: T, from: Partial<T>): void {
    for (const key in from) {
        const value = from[key];

        if (value !== undefined) {
            to[key] = value as T[Extract<keyof T, string>];
        }
    }
}
