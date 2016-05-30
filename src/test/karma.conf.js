/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

module.exports = function(config) {
  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['requirejs', 'mocha', 'chai', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
	    {pattern: 'src/js/**/*.js', included: false},
	    {pattern: 'src/test/**/*.test.js', included: false},
		{pattern: 'src/vendor/**/*.js', included: false},
		{pattern: 'src/test/utils/*.js', included: false},
		{pattern: 'bower_components/**/*.js', included: false},
		'src/test/mocha.conf.js',
		'src/test/test-main.js'
    ],

    // list of files / patterns to exclude
    exclude: [
	    'src/js/main.js'
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'Chrome'
    ],

	customLaunchers: {
	  Chrome_ci: {
		  base: 'Chrome',
		  flags: ['--no-sandbox']
	  }
	},


	  // Which plugins to enable
	  plugins: [
		  'karma-requirejs',
		  'karma-mocha',
		  'karma-chai',
		  'karma-sinon',
		  'karma-chrome-launcher',
          'karma-coverage'
	  ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
      reporters: ['progress', 'coverage'],
      preprocessors: {
          'src/js/**/*.js': ['coverage']
      },
      coverageReporter: {
          reporters:[
              {type: 'lcovonly', dir : 'build/reports/', subdir: '.'},
              {type: 'cobertura', dir : 'build/reports/', subdir: '.'}
          ]
      }
  });
	config.browsers = ['Chrome_ci'];
};
