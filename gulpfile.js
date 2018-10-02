const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const buffer = require('vinyl-buffer');
const connect = require('gulp-connect');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');

gulp.task('sass', function() {
	return gulp.src('./src/sass/**/*.scss')
	.pipe(sass({
		outputStyle: 'compressed'
	}).on('errors', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(gulp.dest('./dist/css'))
	.pipe(connect.reload());
});

gulp.task('js', function() {
	return gulp.src('./src/js/app.js')
	.pipe(minify({
		noSource: true
	}))
	.pipe(gulp.dest('./dist/js'))
	.pipe(connect.reload());
});

gulp.task('images:copy:optmization', function() {
	return gulp.src('./src/images/*')
	.pipe(imagemin())
	.pipe(gulp.dest('./dist/images'))
	.pipe(connect.reload());
});

gulp.task('icons:sprite:optmization', function() {
	const spriteData = gulp.src('./src/icons/**/*.png')
	.pipe(spritesmith({
		imgName: 'icons-sprite.png',
		cssName: 'icons-sprite.css'
	}));

	const iconStream = spriteData.img
	.pipe(buffer())
	.pipe(imagemin())
	.pipe(gulp.dest('./dist/css/sprite'));

	const sassStream = spriteData.css
	.pipe(gulp.dest('./dist/css/sprite'));

	return merge(iconStream, sassStream).pipe(connect.reload());;
});

gulp.task('html:copy', function() {
	return gulp.src('./src/**/*.html')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

gulp.task('server', function() {
	return connect.server({
		root: 'dist',
		livereload: true
	});
});

gulp.task('dist:clean', function() {
	return gulp.src('./dist', {
		read: false
	})
	.pipe(clean())
	.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('./src/js/app.js', ['js']);
	gulp.watch('./src/**/*.html', ['html:copy']);
	gulp.watch('./src/images/*', ['images:copy:optmization']);
	gulp.watch('./src/icons/**/*.png', ['icons:sprite:optmization']);
	gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('build', function() {
	return runSequence('dist:clean', 'js', 'images:copy:optmization', 'icons:sprite:optmization', 'sass', 'html:copy', function() {
		console.log('Finalizou o build');
	});
});

gulp.task('default', function() {
	return runSequence('build', 'watch', 'server');
});