// Need to have a better solution in the future
const notBsModule = '\\/node_modules\\/(?!(@glennsl\\/bs\\-jest|bs\\-platform)\\/).*/';

module.exports = {
	verbose: true,
	testMatch: [ '<rootDir>/lib/es6/tests/*_test.bs.js' ],
	transform: {
		'.*\\.js': 'babel-jest'
	},
	moduleFileExtensions: [ 'js', 'json', 'ts' ],
	transformIgnorePatterns: [ notBsModule ]
};
