export function sanitizeLocation(location: string): string {
    return location.replace('%20', ' ');
}
