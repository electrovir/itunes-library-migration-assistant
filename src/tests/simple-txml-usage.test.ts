import {readFileSync} from 'fs';
import {testGroup} from 'test-vir';
import {parse} from 'txml';
import {getSampleFilePath} from '../file-paths';

testGroup({
    description: 'simple txml usage',
    tests: (runTest) => {
        runTest({
            description: 'parse a simple xml file into json',
            test: () => {
                const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
                const simpleJson = parse(readFileSync(simpleExampleFilePath).toString());
                // console.log(JSON.stringify(simpleJson, null, 4));
            },
        });

        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const libraryJson = parse(readFileSync(sampleLibraryFilePath).toString());
                // console.log(JSON.stringify(libraryJson, null, 4));
            },
        });
    },
});
