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


'use strict';
define([
	"js/url"
], function (Url) {
	suite('url.test suite', function () {
		var sut, location;

		setup(function () {
			location = {
				search: '?dummy_name=dummy&another_dummy=dummy_value/'
			};

			sut = new Url();
		});


		suite('#getURLParameter', function () {
			test('should return the correct param', sinon.test(function () {
				var exp = sut.getURLParameter('another_dummy', location);
				assert.equal(exp, 'dummy_value');
			}));
		});

		suite('#removeURLParameters', function () {
			test('should return the url without get params', sinon.test(function () {
				var exp = sut.removeURLParameters("http://dummy.com?dummy_name=dummy_value&another_name=another_value");
				assert.equal(exp, "http://dummy.com");
			}));
		});
	});

});
