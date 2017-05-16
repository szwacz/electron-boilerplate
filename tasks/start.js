const childProcess = require('child_process');
const gulp = require('gulp');

const electron = process.env.ELECTRON_PATH ? process.env.ELECTRON_PATH : require('electron');
console.log('Using Electron at path:', electron)

gulp.task('start', ['build', 'watch'], () => {
  childProcess.spawn(electron, ['.'], { stdio: 'inherit' })
  .on('close', () => {
    // User closed the app. Kill the host process.
    process.exit();
  });
});
