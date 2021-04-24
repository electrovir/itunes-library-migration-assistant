import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../file-paths';
import {parseLibrary} from '../library-parser';

testGroup((runTest) => {
    runTest({
        description: 'read output from txml',
        test: () => {
            const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
            const libraryJson = parseLibrary(sampleLibraryFilePath);
        },
    });
});
