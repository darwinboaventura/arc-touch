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

gulp.task('sass', function() {
	gulp.src('./src/sass/app.scss')
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
	gulp.src('./src/js/app.js')
	.pipe(minify({
		noSource: true
	}))
	.pipe(gulp.dest('./dist/js'))
	.pipe(connect.reload());
});

gulp.task('images:copy:optmization', function() {
	gulp.src('./src/images/*')
	.pipe(imagemin())
	.pipe(gulp.dest('./dist/images'))
	.pipe(connect.reload());
});

gulp.task('icons:sprite:optmization', function() {
	const spriteData = gulp.src('./src/icons/**/*.png')
	.pipe(spritesmith({
		imgName: 'icons-sprite.png',
		cssName: 'icons-sprite.scss'
	}));

	if (spriteData.img && spriteData.css) {
		const iconStream = spriteData.img
		.pipe(buffer())
		.pipe(imagemin())
		.pipe(gulp.dest('./src/sass/sprite'));

		const sassStream = spriteData.css
		.pipe(gulp.dest('./src/sass/sprite'));

		return merge(iconStream, sassStream)
		.pipe(connect.reload());
	}
});

gulp.task('html:copy', function() {
	gulp.src('./src/**/*.html')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

gulp.task('server', function() {
	connect.server({
		root: 'dist',
		livereload: true
	});
});

gulp.task('dist:clean', function() {
	gulp.src('./dist', {
		read: false
	})
	.pipe(clean());
});

gulp.task('watch', function() {
	gulp.watch('./src/js/app.js', ['js']);
	gulp.watch('./src/**/*.html', ['html:copy']);
	gulp.watch('./src/sass/app.scss', ['sass']);
	gulp.watch('./src/images/*', ['images:copy:optmization']);
	gulp.watch('./src/icons/**/*.png', ['icons:sprite:optmization']);
});

gulp.task('build', ['dist:clean', 'js', 'html:copy', 'icons:sprite:optmization', 'images:copy:optmization', 'sass'], function() {
	console.log('Build executado com sucesso, seus arquivos estão na pasta ./dist');
});

gulp.task('default', ['server', 'watch']);