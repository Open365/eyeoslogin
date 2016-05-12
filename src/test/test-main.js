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

var allTestFiles = [];
var TEST_REGEXP = /test\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
	if (TEST_REGEXP.test(file)) {
		// Normalize paths to RequireJS module names.
		allTestFiles.push(file);
	}
});

require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base/',

	paths: {
		src: 'src',
		js: 'src/js',
		jquery: 'src/vendor/jquery-2.1.1.min',
		emile: 'src/vendor/emile',
		eyeosAuthClient: 'src/test/utils/fakeEyeosAuthClient',
		eyeRunRequestor: 'bower_components/eyeRunRequestor/build/eyeRunRequestor.min',
		operatingSystem : 'bower_components/operatingSystem/build/operatingSystem.min',
		urijs: 'bower_components/uri.js/src',
	},

	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});
