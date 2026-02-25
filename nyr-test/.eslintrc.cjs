const eslintConfig = require('../config/eslint.js')

module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true
	},
	extends: [
		'plugin:vue/vue3-recommended'
	],
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module'
	},
	rules: eslintConfig.rules
}
