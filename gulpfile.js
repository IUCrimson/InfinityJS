var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    wrap = require('gulp-wrap'),
    del = require('del');

var PATH = {
    dist: './dist',
    exampleJs: './examples/InfinityJS.UIModel/htmlforms/custom/infinityjs/js'
};
	
/** Clears out dist folder and runs all build- jobs. */
gulp.task('default', ['clean', 'build-core', 'build-angular'], function () {});

/** Concatinates and minifies core InfinityJS src files into the dist folder. */
gulp.task('build-core', function(){
		return gulp.src(['./src/infinityjs.js', './src/infinityjs-ui.js', './src/*.js'])
		.pipe(concat('infinityjs.js'))
		.pipe(wrap('(function(container){ \n\n <%= contents %> \n })();'))
		.pipe(gulp.dest(PATH.dist))
        .pipe(gulp.dest(PATH.exampleJs))
		.pipe(uglify())
		.pipe(rename('infinityjs.min.js'))
        .pipe(gulp.dest(PATH.dist))
		.pipe(gulp.dest(PATH.exampleJs));
});

/** Concatinates and minifies just AngularJS src files into the dist folder. */
gulp.task('build-angular', function(){
	return gulp.src('./src/angular/*.js')		
		.pipe(gulp.dest(PATH.dist + '/angular'))
        .pipe(gulp.dest(PATH.exampleJs))
		.pipe(uglify())		
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(PATH.dist + '/angular'))
		.pipe(gulp.dest(PATH.exampleJs));
});

/** Removes all files from the dist folder. */
gulp.task('clean', function(cb) {	
    del('./dist/**/*.js', { force: true }, cb);
});
