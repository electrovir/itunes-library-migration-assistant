import {join} from 'path';

export const repoRoot = __dirname.replace(/(dist|src)$/, '');

export function getSampleFilePath(relativeToSampleDirPath: string): string {
    const path = join(repoRoot, 'samples', relativeToSampleDirPath);

    return path;
}
