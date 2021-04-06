import {parse, X2jOptions} from 'fast-xml-parser';
import {readFileSync} from 'fs';
import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../file-paths';

testGroup({
    description: 'simple fast xml usage',
    // fast-xml-parser doesn't preserve ordering of tags and has no events so it is utterly useless
    tests: (runTest) => {
        runTest({
            description: 'parse a simple xml file into json',
            test: () => {
                const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
                const parserOptions: Partial<X2jOptions> = {};
                const simpleJson = parse(
                    readFileSync(simpleExampleFilePath).toString(),
                    parserOptions,
                );
            },
        });

        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');

                const parserOptions: Partial<X2jOptions> = {
                    tagValueProcessor: (value: any): string => {
                        console.log('value:', value);
                        return value;
                    },
                } as const;
                const libraryJson = parse(
                    readFileSync(sampleLibraryFilePath).toString(),
                    parserOptions,
                );
            },
        });
    },
});
