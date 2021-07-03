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

    return (
        encodeURI(
            location
                // force multiline with this comment :P
                .replace(/\?/g, '%3F')
                .replace(/^\//, 'file:///')
                .replace(/#/g, '%23'),
        )
            /**
             * This last semicolon replacement is not in the exact opposite order as its decoding in
             * decodeLocation but apparently doing the exact opposite order above results in
             * non-identical outputs.
             */
            .replace(/;/g, '%3B')
    );
}
