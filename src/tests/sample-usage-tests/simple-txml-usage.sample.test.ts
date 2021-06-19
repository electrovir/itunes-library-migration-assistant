import {readFileSync} from 'fs';
import {testGroup} from 'test-vir';
import {parse, TParseOptions} from 'txml';
import {getSampleFilePath} from '../file-paths';

testGroup({
    description: 'simple txml usage',
    tests: (runTest) => {
        runTest({
            description: 'parse a simple xml file into json',
            test: () => {
                const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
                const simpleJson = parse(readFileSync(simpleExampleFilePath).toString());
            },
        });

        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const libraryJson = parse(readFileSync(sampleLibraryFilePath).toString());
            },
        });

        runTest({
            description: 'read example library file with options',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const txmlOptions: TParseOptions = {
                    keepComments: true,
                    keepWhitespace: true,
                };
                const libraryJson = parse(
                    readFileSync(sampleLibraryFilePath).toString(),
                    txmlOptions,
                );
            },
        });
    },
});
