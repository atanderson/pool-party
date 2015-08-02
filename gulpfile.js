var gulp = require('gulp'),
concat = require('gulp-concat'),
sass = require('gulp-sass'),
importCss = require('gulp-import-css'),
browserify = require('gulp-browserify');

gulp.task('browserify', function(){
    gulp.src('./src/js/*')
        .pipe(concat('bundle.js'))
        .pipe(browserify({'transform': 'reactify'}))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('scss', function(){
    gulp.src('./src/scss/*')
        .pipe(sass())
        .pipe(importCss())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('move', function(){
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'));
    gulp.src('./bower_components/bootstrap/js/modal.js')
        .pipe(gulp.dest('./build/js'))
    gulp.src(['./bower_components/keyrune/fonts/*', './src/vendor/mana/fonts/*', './bower_components/bootstrap/fonts/*'])
        .pipe(gulp.dest('./build/fonts'))
});

gulp.task('img', function(){
    gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./build/img'))
});

gulp.task('build', [
    'browserify',
    'scss',
    'img',
    'move'
]);

gulp.task('default', ['build']);

gulp.task('watch', function(){
    gulp.watch('./src/**/*', ['build']);
});