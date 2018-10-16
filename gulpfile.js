var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var replace = require('gulp-html-replace');
var includer = require('gulp-htmlincluder');
var gulpif = require("gulp-if");
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var rev = require('gulp-rev-append');
var spritesmith = require("gulp-spritesmith");

gulp.task('html', function() {
    gulp.src('dev/**/*.html')
    	.pipe(plumber())
    	.pipe(includer())
    	.pipe(replace({
            js: 'js/all.js',
			css: 'css/style.css?rev=@@hash'
    	}))
        .pipe(rev())
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream());
});

gulp.task('less', function () {
	gulp.src('dev/less/general.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(plumber.stop())
		.pipe(gulp.dest('dev/css/imports'));
});

gulp.task('css', function () {
	gulp.src('dev/css/imports/*.css')
		.pipe(plumber())
    	.pipe(concatCss("style.css"))
    	.pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
        .pipe(rename('style.css'))
        .pipe(plumber.stop())
    	.pipe(gulp.dest('build/css'))
    	.pipe(browserSync.stream());
});

gulp.task('js', function() {
    gulp.src('dev/js/concat/*.js')
      	.pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());
});

gulp.task('img', function() {
    gulp.src('dev/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.stream())
});

gulp.task('sprite', function () {
    gulp.src('dev/sprites/*.png')
        .pipe(spritesmith({
                    imgName: 'sprite.png',
                    styleName: 'sprite.css',
                    imgPath: '../img/sprite.png'
                }))
        .pipe(gulpif('*.png', gulp.dest('dev/img')))
        .pipe(gulpif('*.css', gulp.dest('dev/css/imports')));
});

gulp.task('lib', function() {
    gulp.src('dev/lib/**/*')
        .pipe(gulp.dest('build/lib/'))
        .pipe(browserSync.stream());
});

gulp.task('font', function() {
    gulp.src('dev/fonts/**/*')
        .pipe(gulp.dest('build/fonts/'))
        .pipe(browserSync.stream());
});

gulp.task('php', function() {
    gulp.src('dev/php/**/*')
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });
});

gulp.task('default', function() {
	gulp.start('html', 'css', 'less', 'js', 'img', 'sprite', 'lib', 'font', 'php', 'browser-sync');

	gulp.watch(['dev/**/*.html'], function() {
		gulp.start('html');
	});
    gulp.watch(['dev/less/**/*.less'], function() {
        gulp.start('less');
    });
	gulp.watch(['dev/css/imports/*.css'], function() {
		gulp.start('css');
	});
	gulp.watch(['dev/js/concat/*.js'], function() {
		gulp.start('js');
	});
	gulp.watch(['dev/img/**/*'], function() {
		gulp.start('img');
	});
	gulp.watch(['dev/sprites/*'], function() {
		gulp.start('sprite');
	});
    gulp.watch(['dev/lib/**/*'], function() {
        gulp.start('lib');
    });
    gulp.watch(['dev/fonts/**/*'], function() {
        gulp.start('font');
    });
    gulp.watch(['dev/php/**/*'], function() {
        gulp.start('php');
    });
});
