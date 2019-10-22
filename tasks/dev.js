const { src, dest, series, task, parallel } = require('gulp');
const clean = require('gulp-clean');
//const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const sourceMaps = require('gulp-sourcemaps');
const merge = require('merge2');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
//const autoprefixer = require("gulp-autoprefixer");
//const cache = require('gulp-cache');
//const imagemin = require('gulp-imagemin');
//const webpackStream = require("webpack-stream");
//const fileinclude = require('gulp-file-include');
const webpackStream = require("webpack-stream");

// 清除目录
task('clean', function() {
    return src(['dist/js/*', 'dist/css/*']).pipe(clean());
});

const tsConfig = {
    target: "ES5",
    module: "commonjs",
    declaration: true
};

// index.js
task('build', function() {
    /*return src(['src/!**!/!*.ts'])
        .pipe(webpackStream(webpackConfig, require('webpack'), function(err, stats) {}))
        .pipe(dest('dist'));*/

    let result = src([
        "src/index.ts"
    ])
        .pipe(sourceMaps.init())
        .pipe(ts(tsConfig));

    return merge([
        result.dts.pipe(replace(/\/\/\/\s<reference\spath=(.*)\/>/g, ""))
            .pipe(concat("index.d.ts"))
            .pipe(sourceMaps.write("."))
            .pipe(dest("dist")),

        result.js.pipe(replace(/\/\/\/\s<reference\spath=(.*)\/>/g, ""))
            .pipe(concat("index.js"))
            .pipe(sourceMaps.write("."))
            .pipe(dest("dist"))
    ]);
});