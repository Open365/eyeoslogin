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
	'js/credentials',
	'eyeosAuthClient'
], function (Credentials, EyeosAuthClient) {
	suite("Credentials", function () {
		var sut, authClient, authClientMock;
		setup(function () {
			authClient = EyeosAuthClient;
			authClientMock = sinon.mock(authClient);
			sut = new Credentials(authClient);
		});
		teardown(function () {
			authClientMock.restore();
		});
		test("#checkCard calls to authClient.checkCard", function () {
			var successCallback = "fake success callback",
				errorCallback = "fake error callback",
				exp = authClientMock.expects("checkCard").once().withExactArgs(successCallback, errorCallback);
			sut.checkCard(successCallback, errorCallback);
			exp.verify();
		});
		test("#setToken calls to authClient.setToken", function () {
			var credentials = "fake credentials",
				exp = authClientMock.expects("setToken").once().withExactArgs(credentials);
			sut.setToken(credentials);
			exp.verify();
		});

		test("#getCredentials calls to authClient.getHeaders", function () {
			var exp = authClientMock.expects("getHeaders").once().withExactArgs();
			sut.getCredentials();
			exp.verify();
		});

		test("#getCredentials returns authClient lib credentials", sinon.test(function () {
			var fakeCred = 'fakeCred';
			this.stub(authClient, "getHeaders").returns(fakeCred);
			var returnedCred = sut.getCredentials();
			assert.equal(fakeCred, returnedCred)
		}));

	});
});
