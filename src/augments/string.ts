export function decodeLocation(location: string): string {
    if (location.startsWith('http')) {
        // leave actual URLs encoded
        return location;
    }

    return decodeURI(location)
        .replace(/%23/g, '#')
        .replace(/%3B/g, ';')
        .replace(/^file:\/\/\//, '/')
        .replace(/%3F/g, '?');
}

export function encodeLocation(location: string): string {
    if (location.startsWith('http')) {
        return location;
    }

    return encodeURI(
        location
            .replace(/\?/g, '%3F')
            .replace(/^\//, 'file:///')
            .replace(/;/g, '%3B')
            .replace(/#/g, '%23'),
    );
}
