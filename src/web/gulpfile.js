﻿/// <binding BeforeBuild='lib' />
"use strict";

var gulp = require("gulp"),
    series = require('stream-series'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream;

var webroot = "./wwwroot/";

var paths = {
    ngModule: webroot + "ng/**/*.module.js",
    ngRoute: webroot + "ng/**/*.route.js",
    ngService: webroot + "ng/**/*.service.js",
    ngController: webroot + "ng/**/*.controller.js",
    script: webroot + "js/**/*.js",
    style: webroot + "css/**/*.css"
};

gulp.task('injector', function () {
    var moduleSrc = gulp.src(paths.ngModule, { read: false });
    var routeSrc = gulp.src(paths.ngRoute, { read: false });
    var serviceSrc = gulp.src(paths.ngService, { read: false });
    var controllerSrc = gulp.src(paths.ngController, { read: false });
    var scriptSrc = gulp.src(paths.script, { read: false });
    var styleSrc = gulp.src(paths.style, { read: false });

    gulp.src(webroot + 'views/*.html')
        .pipe(wiredep({
            bowerJson: require('./../../bower.json'),
            directory: webroot + 'vendor/',
            optional: 'configuration',
            goes: 'here',
            ignorePath: '..',
            overrides: {
                bootstrap: {
                    //main: ["dist/js/bootstrap.js", "dist/css/bootstrap.css"]
                    main: ["dist/css/bootstrap.css"]
                },
            }
        }))
        .pipe(inject(series(scriptSrc, moduleSrc, serviceSrc, controllerSrc, routeSrc), { ignorePath: '/wwwroot' }))
        .pipe(inject(series(styleSrc), { ignorePath: '/wwwroot' }))
        .pipe(gulp.dest(webroot + 'views'));
});