var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

var sassFiles = ['sass/reset.scss', 'sass/*.scss']

gulp.task('serve', ['sass'], function() {
	browserSync.init({
		proxy: 'http://127.0.0.1:8080/WordApi/Fabric',
		files: ['css/*.css', 'sass/*.scss']
	});

	gulp.watch('sass/*.scss', ['sass']);
	gulp.watch('*.html').on('change', browserSync.reload);
});


gulp.task('sass', function() {
	return gulp.src(sassFiles)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('css'))
		.pipe(browserSync.stream());
});


gulp.task('default', ['serve']);