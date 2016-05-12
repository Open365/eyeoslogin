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
	"js/userInfo",
	"js/settings",
	"js/credentials"
], function (UserInfo, settings, Credentials) {
	suite("UserInfo", function () {
		var sut, cb;
		var credentials, credentialsStub, fakeCredentials;
		var $, localStorage, platformSettings;

		setup(function () {
			$ = {
				ajax: sinon.stub(),
				done: sinon.stub(),
				fail: sinon.stub()
			};

			$.ajax.returns($);
			$.done.returns($);

			localStorage = {
				setItem: sinon.stub()
			};

			platformSettings = {
				lang: "ca"
			};

			fakeCredentials = "fake credentials";
			credentials = new Credentials();
			credentialsStub = sinon.stub(credentials, "getRawCredentials").returns(fakeCredentials);

			cb = sinon.stub();
			sut =  new UserInfo(settings, credentials, $, localStorage, platformSettings);
		});

		suite("#getAndStore", function () {
			function exercise () {
				sut.getAndStore(cb);
			}
			test("should get the principal info", function () {
				var params = {
					dataType: "json",
					contentType: "application/json",
					type: "GET",
					url: settings.principal.url,
					headers: fakeCredentials
				};
				exercise();
				sinon.assert.calledWithExactly($.ajax, params);
			});

			test("should store the preferences on success", function () {
				var preferences = {
					lang: "bar"
				};
				exercise();
				$.done.callArgWith(0, {preferences: preferences});
				sinon.assert.calledWithExactly(localStorage.setItem, 'userInfo', JSON.stringify(preferences));
			});

			test("should set default values if no preferences are present", function () {
				exercise();
				$.done.callArgWith(0, {});
				sinon.assert.calledWithExactly(localStorage.setItem, 'userInfo', JSON.stringify(platformSettings));
			});

			test("shuld call callback on success", function () {
				exercise();
				$.done.callArgWith(0, {});
				sinon.assert.called(cb);
			});

			test("should set default values on error", function () {
				exercise();
				$.fail.callArg(0);
				sinon.assert.calledWithExactly(localStorage.setItem, 'userInfo', JSON.stringify(platformSettings));
			});

			test("shuld call callback on error", function () {
				exercise();
				$.fail.callArg(0);
				sinon.assert.called(cb);
			});

		});
	});
});
