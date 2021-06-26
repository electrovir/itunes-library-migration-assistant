import {testGroup} from 'test-vir';
import {api} from '../api/api';
import {ReplacePath} from '../api/api-types';
import {InvalidApiInputError} from '../errors/invalid-api-input-error';
import {getSampleFilePath} from './file-paths';

testGroup({
    tests: (runTest) => {
        const mockReplacePaths: Readonly<Readonly<ReplacePath>[]> = [
            {old: 'empty-path', new: 'empty-path'},
        ];

        runTest({
            expectError: {
                errorClass: InvalidApiInputError,
                errorMessage: /Error in "libraryFilePath"/,
            },
            description: 'for empty libraryFilePath',
            test: () => {
                api({
                    libraryFilePath: '',
                    replacePaths: mockReplacePaths,
                });
            },
        });

        runTest({
            expectError: {
                errorClass: InvalidApiInputError,
                errorMessage: /Error in "libraryFilePath"/,
            },
            description: 'for missing library file',
            test: () => {
                api({
                    libraryFilePath: 'this-is-not-a-real-file.invalid-extension',
                    replacePaths: mockReplacePaths,
                });
            },
        });

        runTest({
            expectError: {
                errorClass: InvalidApiInputError,
                errorMessage: /Error in "replacePaths"/,
            },
            description: 'for empty replace paths',
            test: () => {
                api({
                    libraryFilePath: getSampleFilePath('library-example.xml'),
                    replacePaths: [],
                });
            },
        });

        runTest({
            expectError: {
                errorClass: InvalidApiInputError,
                errorMessage: /Error in "replacePaths"/,
            },
            description: 'for empty replace paths',
            test: () => {
                api({
                    libraryFilePath: getSampleFilePath('library-example.xml'),
                    replacePaths: [
                        {old: '', new: ''},
                        {old: 'old-thing', new: 'new-thing'},
                    ],
                });
            },
        });
    },
});
