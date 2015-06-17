# gulp-copy

Copy source files to new destination and use that destination as new source

Automatically creates needed folders before proceeding. Ability to remove 'prefixes' from path>

## Usage
    var gulpCopy = require('gulp-copy');

    return gulp.src(sourceFiles)
      .pipe(gulpCopy(outputPath, options));

### Options

    prefix: integer, defining how many parts of the path (separated by /) should be ignored as they are prefixes
    flatten: boolean, flattens files to one single output directory.


## Releases

### 0.0.2 Streams release
* use nodejs streams to write files (instead of cp command)
* fix callback issues (which probably will fix the too many open files bug)

### 0.0.1 Initial release
* initial code
