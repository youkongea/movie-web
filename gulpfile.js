/**
 * Created by unsad on 2017/4/17.
 */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const nodemon = require('gulp-nodemon');

gulp.task('server', function() {
  nodemon({
    script: 'app.js',
    ingore: ['gulpfile.js', 'node_modules/'],
    env: {
      'NODE_ENV': 'development'
    }
  }).on('start', function() {
    browserSync.init({
      proxy: 'http://localhost:8080',
      files: ['public/**/*.js', 'app/views/**/*', 'config/*'],
      port: 5000
    }, function() {
      console.log('browser refreshed');
    })
  })
});