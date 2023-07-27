// eslint-disable-next-line @typescript-eslint/ban-types
export function assign<T extends {}>(to: T, from: Partial<T>): void {
    for (const key in from) {
        const value = from[key];

        if (value !== undefined) {
            to[key] = value as T[Extract<keyof T, string>];
        }
    }
}
