export const now = () => new Date();
export const infinity = () => {
    const PERIOD = 1000;
    const _now = now();
    _now.setFullYear(_now.getFullYear() + PERIOD);
    return _now;
};
export const epochStart = () => new Date(0);
export const dbFormat = (date: Date) => date.toISOString();