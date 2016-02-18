/**
 * REQUIRES
 */
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var assign = require('lodash.assign');
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

/**
 * Browserify Options
 */
var customOpts = {
  entries: ['./src/js/app.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// Add Transformations
b.transform('babelify', {presets: 'es2015'});

gulp.task('js:app', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, gutil.colors.red('BROWSERIFY ERROR')))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.reload({stream: true}));
}
/**
 * Vendors Task
 */
gulp.task('js:vendors',[], function(){
  return gulp.src('./src/js/vendors/*.js')
    .pipe(concat('vendors.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});
/**
 * Browser-Sync Task
 */
gulp.task('browserSync', function(){
  browserSync({
    server: {
      baseDir: './build'
    }
  });
});

/**
 * HTML task
 */
gulp.task('html', function(){
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream: true}));
});
/**
 * Images Task
 */
 gulp.task('images', function(){
   return gulp.src('./src/images/*.*')
     .pipe(gulp.dest('./build/images/'));
 });

/**
 * Style Task
 */
gulp.task('styles', function(){
  return gulp.src('./src/sass/style.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}))
      // .on('error', errorlog)
      .on('error', gutil.log.bind(gutil, gutil.colors.red('SCSS ERROR')))
      .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
      }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * Watch Task
 */
gulp.task('watch', function(){
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/sass/**/*.scss', ['styles']);
  gulp.watch('src/images/*.*', ['images'])
});

gulp.task('default',['styles', 'html', 'images', 'watch', 'browserSync', 'js:app', 'js:vendors']);
