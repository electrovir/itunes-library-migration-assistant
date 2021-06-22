import {existsSync} from 'fs';
import {testGroup} from 'test-vir';
import {readLibrary} from '../migration/reading/read-library';
import {getOutputFilePath, getSampleFilePath} from './file-paths';

testGroup({
    tests: (runTest) => {
        runTest({
            description: 'can read small sample library',
            test: () => {
                readLibrary(getSampleFilePath('library-example.xml'));
            },
        });

        const testFullLibraryPath = getOutputFilePath('library.xml');

        if (existsSync(testFullLibraryPath)) {
            runTest({
                description: 'can read full library',
                test: () => {
                    readLibrary(getOutputFilePath('library.xml'));
                },
            });
        } else {
            console.info(
                `Put your library into ${testFullLibraryPath} to test the parser against it`,
            );
        }
    },
});
