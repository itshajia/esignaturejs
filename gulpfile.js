'use strict';
const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
// 载入所有任务文件
const hub = new HubRegistry(['tasks/*.js']);

// 注册分割文件任务
gulp.registry(hub);

// 默认执行构建
gulp.task('default', gulp.series('build'));