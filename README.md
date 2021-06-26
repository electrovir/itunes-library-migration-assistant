# itunes-library-migration-assistant

[![tests](https://github.com/electrovir/itunes-library-migration-assistant/workflows/tests/badge.svg)](https://github.com/electrovir/itunes-library-migration-assistant/actions)

Assists in moving files referenced in an iTunes library. Creates an library file updated with the new file locations.

[On NPM here.](http://npmjs.com/package/itunes-library-migration-assistant)

```bash
npm i itunes-library-migration-assistant
```

This only works in `Node.js`, not in the browser, as it uses the file system.

# Usage

## ES Modules

```typescript
import {migrateLibrary, MigrationOutput} from 'itunes-library-migration-assistant';

const migratedLibraryFilePath = migrateLibrary({
    libraryFilePath: 'path/to/library.xml',
    replacePaths: [
        {
            old: 'my/old/path/to/file',
            new: 'my/fancy/new/path/to/file',
        },
    ],
    options: {
        validationEnabled: true,
        loggingEnabled: false,
        checkReplacementPaths: true,
    },
    outputType: MigrationOutput.WriteToFile,
});
```

## CommonJS

```Javascript
const migration = require('itunes-library-migration-assistant');

const migratedLibraryFilePath = migration.migrateLibrary({
    libraryFilePath: 'path/to/library.xml',
    replacePaths: [
        {
            old: 'my/old/path/to/file',
            new: 'my/fancy/new/path/to/file',
        },
    ],
    options: {
        validationEnabled: true,
        loggingEnabled: false,
        checkReplacementPaths: true,
    },
    outputType: migration.MigrationOutput.WriteToFile,
});
```

## Details

Using `MigrationOutput.WriteToFile` (as used above) will _not_ overwrite the original `library.xml` file. The returned `migratedLibraryFilePath` is the new file path.

## More info

See types in `.d.ts` files for more info. There are lots of test files but those are excluded from the NPM package. They can instead be found in the [git repo, here](https://github.com/electrovir/itunes-library-migration-assistant).
