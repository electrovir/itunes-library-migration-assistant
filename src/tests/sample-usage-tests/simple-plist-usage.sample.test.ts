import {readFileSync} from 'fs';
import {parse} from 'plist';
import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../file-paths';

testGroup({
    description: 'simple xml-js usage',
    tests: (runTest) => {
        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const libraryJson = parse(readFileSync(sampleLibraryFilePath).toString());
                console.log(JSON.stringify(libraryJson, null, 4));
            },
        });
    },
});
