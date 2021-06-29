export function sanitizeLocation(location: string): string {
    return decodeURI(location)
        .replace(/%23/g, '#')
        .replace(/%3B/g, ';')
        .replace(/^file:\/\/\//, '/');
}
