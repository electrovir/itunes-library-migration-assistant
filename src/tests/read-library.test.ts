import {existsSync} from 'fs';
import {testGroup} from 'test-vir';
import {readLibraryFile} from '../migration/reading/read-library';
import {getOutputFilePath, getSampleFilePath} from './file-paths';

testGroup({
    tests: (runTest) => {
        runTest({
            description: 'can read small sample library',
            test: () => {
                readLibraryFile({path: getSampleFilePath('library-example.xml')});
            },
        });

        const testFullLibraryPath = getOutputFilePath('library.xml');

        if (existsSync(testFullLibraryPath)) {
            runTest({
                description: 'can read full library',
                test: () => {
                    readLibraryFile({path: getOutputFilePath('library.xml')});
                },
            });
        } else {
            console.info(
                `Put your library into ${testFullLibraryPath} to test the parser against it`,
            );
        }
    },
});
