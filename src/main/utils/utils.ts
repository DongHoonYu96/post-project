export function objectToMap<T = any>(obj: { [key: string]: T }): Map<string, T> {
    return new Map(Object.entries(obj));
}