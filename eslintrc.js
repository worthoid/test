module.exports = {
	env: {
		browser: true,
		es6: true,
		mocha: true,
		node: true
	},
	extends: 'eslint:recommended',
	globals: {
		expect: true,
		sinon: true
	},
	parserOptions: {
		sourceType: 'module',
	},
	rules: {
		'indent': ['error', 'tab'],
		'quotes': ['error', 'single'],
		'semi': ['error']
	}
};
