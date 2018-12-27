const gulp = require('gulp');
const del = require('del');
const decompress = require('gulp-decompress');

gulp.task('getapp', () => {
  return gulp.src('../VSCode-win32-x64/resources/app/**/*')
    .pipe(gulp.dest('./out-vscode-min'));
});

gulp.task('getcodeoutline', ['getapp'], () => {
  return gulp.src('C:/Users/tgb/.vscode/extensions/patrys.vscode-code-outline-0.0.12/**/*')
    .pipe(gulp.dest('./out-vscode-min/extensions/code-outline'));
});

gulp.task('getmodelica:1', () => {
  return gulp.src('../vscode-modelica/*.vsix')
    .pipe(decompress({
      strip: 0
    }))
    .pipe(gulp.dest('./jfdi'));
});

gulp.task('getmodelica:2', ['getmodelica:1', 'getapp'], () => {
  return gulp.src('./jfdi/extension/**/*')
    .pipe(gulp.dest('./out-vscode-min/extensions/vscode-modelica'));
});

gulp.task('getmodelica:3', ['getmodelica:2'], () => del([
  './out-vscode-min/extensions/vscode-modelica/build',
  './out-vscode-min/extensions/vscode-modelica/src',
  './out-vscode-min/extensions/vscode-modelica/node_modules/@tom-bancroft/modelica-lang-backend/dist',
  './out-vscode-min/extensions/vscode-modelica/out/**/*.d.ts',
  './out-vscode-min/extensions/vscode-modelica/binding.gyp',
  './out-vscode-min/extensions/vscode-modelica/*.lib',
  './out-vscode-min/extensions/vscode-modelica/*.cc',
  './out-vscode-min/extensions/vscode-modelica/*.h',
]));


gulp.task('getmodelica:4', ['getmodelica:3'], () => {
  return gulp.src('./out-vscode-min/extensions/vscode-modelica/node_modules/@tom-bancroft/modelica-lang-backend/dist-min/**/*')
    .pipe(gulp.dest('./out-vscode-min/extensions/vscode-modelica/node_modules/@tom-bancroft/modelica-lang-backend/dist'));
});

gulp.task('getall', ['getcodeoutline', 'getmodelica:4']);
