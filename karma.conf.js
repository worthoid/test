module.exports = config => {
	config.set({
		browserify: {
			debug: true,
			transform: [
				['babelify'],
				['browserify-istanbul']
			]
		},
		browsers: ['ChromeHeadless'],
		coverageReporter: {
			dir: 'build/coverage',
			reporters: [
				{ type: 'html' },
				{ type: 'text-summary' }
			]
		},
		files: ['src/**/*.js', 'test/**/*.js'],
		frameworks: ['browserify', 'mocha', 'sinon-chai'],
		preprocessors: {
			'src/elements/**/*.js': ['coverage'],
			'src/scripts/**/*.js': ['browserify'],
			'test/**/*.js': ['browserify']
		},
		reporters: ['coverage', 'mocha']
	});
};

// module.exports = config => {
// 	config.set({
// 		basePath: 'build',
// 		browserify: {
// 			debug: true,
// 			transform: [ ['babelify', { presets: 'es2015' }] ]
// 		},
// 		browsers: ['ChromeHeadless'],
// 		customContextFile: 'dev/index.html',
// 		files: [
// 			{ pattern: '../src/**/*.js', included: false, served: false },
// 			{ pattern: '../test/**/*.js', included: false, served: false },
// 			{ pattern: 'dev/**/*.css', watched: false, included: false, nocache: true },
// 			{ pattern: 'dev/**/*.js', watched: false, included: false, nocache: true }
// 		],
// 		frameworks: ['browserify', 'mocha', 'sinon-chai'],
// 		preprocessors: {
// 			'../src/**/*.js': ['coverage'],
// 			'../test/**/*.js': ['browserify']
// 		},
// 		proxies: {
// 			'/elements': '/base/dev/elements',
// 			'/scripts': '/base/dev/scripts',
// 			'/styles': '/base/dev/styles'
// 		},
// 		reporters: ['coverage', 'mocha']
// 	});
// };
