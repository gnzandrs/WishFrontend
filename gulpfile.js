var gulp = require('gulp')
var browserify = require('browserify')
var jadeify = require('jadeify')
var babelify = require('babelify')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat-css')
var minify = require('gulp-minify-css')
var uglify = require('gulp-uglify')
var connect = require('gulp-connect')

gulp.task('build', ['js', 'css'])

gulp.task('js', function() {
  return browserify({
    entries: [/*'./assets/js/vendor/modernizr.js'*/, './src/client/index.js'/*, './assets/js/foundation.min.js'*/], //punto de entrada js
    transform: [
      [ babelify, { presets: ["es2015"] } ] ,
      [ jadeify ]
    ] //transformaciones
  })
  .bundle()
  .pipe(source('index.js')) // archivo destino
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./public/')) // en dónde va a estar el archivo destino
})

gulp.task('css', function() {
  return gulp.src('./src/client/index.css') // entry point de styl
    .pipe(concat('index.css'))
    .pipe(minify())
    .pipe(gulp.dest('./public'))
})

gulp.task('connect', function () {
  connect.server({
    root: 'public',
    //livereload: true,
    port: 3000
  });
})

gulp.task('watch', ['build', 'connect'], function () {
  gulp.watch(['src/client/**/**/*.jade', 'src/client/**/**/*.js'], ['build'])
})
