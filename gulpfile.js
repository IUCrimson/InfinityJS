var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    wrap = require('gulp-wrap'),
    del = require('del');
	
/** Clears out dist folder and runs all build- jobs. */
gulp.task('default', ['clean', 'build-core', 'build-angular'], function () {});

/** Concatinates and minifies core InfinityJS src files into the dist folder. */
gulp.task('build-core', function(){
		return gulp.src(['./src/infinityjs.js', './src/infinityjs-ui.js', './src/*.js'])
		.pipe(concat('infinityjs.js'))
		.pipe(wrap('(function(container){ \n\n <%= contents %> \n })();'))
		.pipe(gulp.dest('./dist'))
		.pipe(uglify())
		.pipe(rename('infinityjs.min.js'))
		.pipe(gulp.dest('./dist'));
});

/** Concatinates and minifies just AngularJS src files into the dist folder. */
gulp.task('build-angular', function(){
	return gulp.src('./src/angular/*.js')		
		.pipe(gulp.dest('./dist/angular'))
		.pipe(uglify())		
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/angular'));		
});

/** Removes all files from the dist folder. */
gulp.task('clean', function(cb) {	
    del('./dist/**/*.js', { force: true }, cb);
});
