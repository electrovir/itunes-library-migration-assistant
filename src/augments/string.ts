export function sanitizeLocation(location: string): string {
    return decodeURI(location).replace(/^file:\/\/\//, '/');
}
