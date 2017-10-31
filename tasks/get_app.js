const gulp = require('gulp');
const del = require('del');


gulp.task('getapp', () => {
    return gulp.src('../VSCode-win32-x64/resources/app/**/*')
        .pipe(gulp.dest('./out-vscode-min'));
});

gulp.task('getcodeoutline', ['getapp'], () => {
    return gulp.src('C:/Users/tgb/.vscode/extensions/patrys.vscode-code-outline-0.0.12/**/*')
        .pipe(gulp.dest('./out-vscode-min/extensions/code-outline'));
});

gulp.task('clean-modelica-plugin', ['getapp'], () => del([
    './out-vscode-min/extensions/vscode-modelica/build',
    './out-vscode-min/extensions/vscode-modelica/src',
    './out-vscode-min/extensions/vscode-modelica/binding.gyp',
    './out-vscode-min/extensions/vscode-modelica/*.lib',
    './out-vscode-min/extensions/vscode-modelica/*.cc',
    './out-vscode-min/extensions/vscode-modelica/*.h',
]));

gulp.task('getall', ['getapp', 'getcodeoutline', 'clean-modelica-plugin']);
