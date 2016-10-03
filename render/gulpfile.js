var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var spritesmith = require('gulp.spritesmith');
var concatCss = require('gulp-concat-css');
var merge = require('merge-stream');

gulp.task('sprite-templ-1', function () {
  var spriteData = gulp.src('templates/assets/templ-1/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    cssOpts: {
      cssSelector: function (sprite) {
        return '.sp-' + sprite.name;
      }
    }
  }));
  var imgStream = spriteData.img
    .pipe(gulp.dest('assets/templ-1'));
  var cssStream = spriteData.css
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('assets/templ-1'));
  return merge(imgStream, cssStream);
});

gulp.task('minify-js', function () {
  return gulp.src('templates/assets/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('assets'))
    .on('error', function(err) {
      console.error('Error in compress task', err.toString());
    });
});

gulp.task('minify-css', function() {
  return gulp.src('templates/assets/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('assets'));
});

gulp.task('default', ['minify-js', 'minify-css', 'sprite-templ-1']);
gulp.task('watch', ['default'], function () {
  gulp.watch(['templates/**/*.js'], ['minify-js']);
  gulp.watch(['templates/**/*.css'], ['minify-css']);
});