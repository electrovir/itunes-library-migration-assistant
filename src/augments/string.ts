export function decodeLocation(location: string): string {
    if (location.startsWith('http')) {
        return location;
    }

    return decodeURI(location)
        .replace(/%23/g, '#')
        .replace(/%3B/g, ';')
        .replace(/^file:\/\/\//, '/');
}

export function encodeLocation(location: string): string {
    if (location.startsWith('http')) {
        return location;
    }

    return encodeURI(location.replace(/^\//, 'file:///').replace(/;/g, '%3B').replace(/#/g, '%23'));
}
