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

define([
	"js/call"
], function (Call) {
	suite("Call", function () {
		var sut, settings, url,
			jQueryMock;
		setup(function () {
			settings = {
				login: {
					url: {
						login: "fakeUrl",
						loginCaptcha: "fakeUrl"
					}
				},
				captcha: {
					url: {
						captcha: "fakeUrl"
					}
				}
			};
			url = "fake url"
			jQueryMock = sinon.mock($);
			sut = new Call(settings);
		});
		teardown(function () {
			jQueryMock.restore();
		});
		test("#post calls to $.ajax", function () {
			var data = {
					a: "fake data a",
					b: "fake data b"
				},
				aCallback = function () {},
				expectation = {
					type: "POST",
					url: url,
					contentType: "application/json",
					data: JSON.stringify(data),
					success: sinon.match.func,
					error: sinon.match.func
				};

			var exp = jQueryMock.expects('ajax').once().withExactArgs(expectation);

			sut.post(url, data, aCallback, aCallback);
			exp.verify();
		});
		test("#get calls to $.ajax", function () {
			var aCallback = function () {},
				expectation = {
					type: "GET",
					url: settings.captcha.url.captcha,
					success: sinon.match.func,
					error: sinon.match.func
				};

			var exp = jQueryMock.expects('ajax').once().withExactArgs(expectation);

			sut.get(aCallback, aCallback);
			exp.verify();
		});
	});
});
