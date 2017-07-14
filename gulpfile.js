const autoprefixer = require('autoprefixer');
const browserify = require('browserify');
const del = require('del');
const gulp = require('gulp');
const babili = require('gulp-babili');
const connect = require('gulp-connect');
const eslint = require('gulp-eslint');
// const htmlValidator = require('gulp-html-validator');
const htmlhint = require('gulp-htmlhint');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');
const vulcanize = require('gulp-vulcanize');
const merge = require('merge-stream');
const run = require('run-sequence');
const buffer = require('vinyl-buffer');
const sourceStream = require('vinyl-source-stream');

const Server = require('karma').Server;

// const ENV = util.env.production ? 'prod' : 'dev';
const PATHS = {
	// dest: {
	// 	all: 'build',
	// 	env: 'build/' + ENV
	// },
	dest: {
		all: 'dist',
		reports: 'dist/reports'
	},
	markup: {
		all: 'src/**/*.{html,svg}',
		entrypoint: 'src/index.html'
	},
	public: 'src/public/**/*',
	scripts: {
		all: ['*.js', 'src/**/*.js', 'test/**/*.js'],
		dest: 'main.js',
		elements: 'src/!(scripts)/**/*.js',
		entrypoint: 'src/scripts/main.js',
		modules: 'src/scripts/**/*.js'
	},
	styles: ['src/!(styles)/**/*.scss', 'src/styles/main.scss']
	// validator: {
	// 	// dest: 'build/validator/' + ENV,
	// 	// entrypoint: `build/${ ENV }/index.html`
	// 	dest: 'dist/validator',
	// 	entrypoint: 'dist/index.html'
	// }
};

const OPTIONS_BROWSERIFY = {
	debug: true,
	entries: PATHS.scripts.entrypoint,
	transform: [ ['babelify'] ]
};
const OPTIONS_CONNECT = {
	root: PATHS.dest.all
};
// const OPTIONS_HTML_VALIDATOR = {
// 	format: 'html'
// };
const OPTIONS_HTMLMIN = {
	collapseWhitespace: true,
	minifyCSS: true,
	minifyJS: true,
	removeComments: true
};
const OPTIONS_SASS = {
	errLogToConsole: true,
	outputStyle: util.env.production ? 'compressed' : 'expanded'
};
const OPTIONS_VULCANIZE = {
	excludes: [PATHS.scripts.dest],
	stripComments: true
};

// const VALIDATOR_URL = '//validator.w3.org/nu';

function ifDev(fn, ...args) {
	return util.env.production ? util.noop() : fn.apply(null, args);
}

function ifProd(fn, ...args) {
	return util.env.production ? fn.apply(null, args) : util.noop();
}

gulp.task('build', ['build:markup', 'build:public', 'build:scripts:elements', 'build:scripts:modules', 'build:styles']);

gulp.task('build:markup', () => {
	return gulp.src(PATHS.markup.entrypoint)
		.pipe(vulcanize(OPTIONS_VULCANIZE))
		.pipe(replace(' by-vulcanize=""', ''))
		.pipe(ifProd(htmlmin, OPTIONS_HTMLMIN))
		.pipe(gulp.dest(PATHS.dest.all));
});

gulp.task('build:public', () => {
	return gulp.src(PATHS.public)
		// .pipe(ifProd(minify))
		.pipe(gulp.dest(PATHS.dest.all));
});

gulp.task('build:scripts:elements', () => {
	return gulp.src(PATHS.scripts.elements)
		.pipe(ifProd(babili))
		.pipe(gulp.dest(PATHS.dest.all));
});

gulp.task('build:scripts:modules', () => {
	return browserify(OPTIONS_BROWSERIFY).bundle()
		.pipe(sourceStream(PATHS.scripts.dest))
		.pipe(buffer())
		.pipe(ifDev(sourcemaps.init, { loadMaps: true }))
		.pipe(ifProd(babili))
		.on('error', util.log)
		.pipe(ifDev(sourcemaps.write))
		.pipe(gulp.dest(PATHS.dest.all));
});

gulp.task('build:styles', () => {
	const tasks = PATHS.styles.map(path => {
		return gulp.src(path)
			.pipe(ifDev(sourcemaps.init))
			.pipe(sass(OPTIONS_SASS).on('error', sass.logError))
			.pipe(postcss([autoprefixer()]))
			.pipe(ifDev(sourcemaps.write))
			.pipe(gulp.dest(PATHS.dest.all));
	});

	return merge(tasks);
});

gulp.task('build:watch', ['build', 'serve'], () => {
	gulp.watch(PATHS.markup.all, ['build:markup']);
	gulp.watch(PATHS.public, ['build:public']);
	gulp.watch(PATHS.scripts.elements, ['build:scripts:elements']);
	gulp.watch(PATHS.scripts.modules, ['build:scripts:modules']);
	gulp.watch(PATHS.styles, ['build:styles']);
});

gulp.task('clean', () => del(PATHS.dest.all));

gulp.task('clean:reports', () => del(PATHS.dest.reports));

gulp.task('default', done => run('clean', 'build', done));

gulp.task('deploy', done => run('test', 'build', done));

gulp.task('dev', done => run('clean', 'build:watch', done));

gulp.task('lint', done => run('lint:markup', 'lint:scripts', 'lint:styles', done));

gulp.task('lint:markup', () => {
	return gulp.src(PATHS.markup.all)
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter());
});

gulp.task('lint:scripts', () => {
	return gulp.src(PATHS.scripts.all, { dot: true })
		.pipe(eslint('eslintrc.js'))
		.pipe(eslint.format());
});

gulp.task('lint:styles', () => {
	return gulp.src(PATHS.styles)
		.pipe(sassLint())
		.pipe(sassLint.format());
});

gulp.task('lint:watch', ['lint'], () => {
	gulp.watch(PATHS.markup.all, ['lint:markup']);
	gulp.watch(PATHS.scripts.all, ['lint:scripts']);
	gulp.watch(PATHS.styles, ['lint:styles']);
});

gulp.task('serve', () => connect.server(OPTIONS_CONNECT));

gulp.task('tdd', ['clean:reports'], done => {
	new Server({
		configFile: __dirname + '/karma.conf.js'
	}, () => done()).start();
});

gulp.task('test', ['clean:reports', 'lint'], done => {
	new Server({
		autoWatch: false,
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, () => done()).start();
});

// gulp.task('test:watch', ['build', 'serve', 'test'], () => {
// 	gulp.watch(PATHS.markup.all, ['lint:markup']);
// 	gulp.watch(PATHS.scripts.all, ['lint:scripts', 'tdd:single']); // ??
// 	gulp.watch(PATHS.styles, ['lint:styles']);
// });

// gulp.task('validate', ['build'], () => {
// 	return gulp.src(PATHS.validator.entrypoint)
// 		.pipe(htmlValidator(OPTIONS_HTML_VALIDATOR))
// 		.pipe(replace(/href="(?!http)/g, `href="${ VALIDATOR_URL }/`))
// 		.pipe(gulp.dest(PATHS.validator.dest));
// });
