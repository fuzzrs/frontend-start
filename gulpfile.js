// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// file path variables
const files = {
    sassPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js'
}

// Sass task
function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist')
    );
}

// JS task
function jsTask() {
    return src(files.jsPath)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('dist')
    );
}

// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask() {
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.')
    );
}

// Watch task
function watchTask() {
    watch([files.sassPath, files.jsPath],
        parallel(sassTask, jsTask));
}

// Default task
exports.default = series(
    parallel(sassTask, jsTask),
    cacheBustTask,
    watchTask
);