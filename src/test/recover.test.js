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
	"js/recover",
	"js/prepare",
	"js/settings",
	"js/call",
	"js/redirector"
], function (Recover, Prepare, Settings, Call, Redirector) {

	suite("Recover", function () {
		var sut,
			prepare, prepareStub, call, callStub, redirector, redirectorStub, fakeUser, fakeToken, fakeUrl,
			fakeDomain, settings, xhr, platformSettings, fakePassword;

		setup(function () {
			fakeUrl = "fake url";
			fakeUser = "pepito";
			fakeToken = "xx";
			fakeDomain = "open365.io";
			fakePassword = "fake password";
			xhr = {};

			prepare = new Prepare();
			prepareStub = sinon.stub(prepare);

			call = new Call();
			callStub = sinon.stub(call);

			redirector = new Redirector();
			redirectorStub = sinon.stub(redirector);

			settings = {
				recover: {
					url: fakeUrl,
					response: {
						success: true
					},
					message: {
						SUCCESS: "Your password has been changed.",
						INVALID: "Incorrect params.",
						INVALID_USER: "Invalid user.",
						INVALID_PASSWORD: "Invalid password.",
						INVALID_TOKEN: "Your password recovery session has expired.",
						PASS_MISSMATCH: "Passwords don't match.",
						PASS_MIN_LENGHT: "Password must be at least 8 characters.",
						PASS_EQUAL_USER: "Passwords can't be equal to username."
					}
				},
				reset: {
					requestParams: [
						'username',
						'token'
					]
				}
			};

			platformSettings = {
				defaultDomain: fakeDomain
			};

			sut = new Recover(prepareStub, settings, callStub, platformSettings, redirectorStub);
		});

		suite("#recoverSuccess", function () {
			test("calls prepare success message when response there are no response error", function () {
				var response = { responseText:'{}'};

				sut.recoverSuccess(response, 'success', xhr);

				sinon.assert.calledWith(prepareStub.prepareSuccessMessage, settings.recover.message.SUCCESS);
			});

			test("calls gotoMainPage when response there are no response error", function () {
				var response = { responseText:'{}'};

				sut.recoverSuccess(response, 'success', xhr);

				sinon.assert.called(redirectorStub.gotToMainPage);
			});
		});

		suite("#requestFail", function () {
			var response = { responseText:'{"error":10}'};

			function executeSut(message) {
				sut.recoverFail(response);
				sinon.assert.calledWith(prepareStub.prepareErrorMessage, message);
				sinon.assert.called(prepareStub.shakeBox);
			}

			test("error message should be INVALID", function () {
				executeSut(settings.recover.message.INVALID);
			});

			test("error message should be INVALID USER", function () {
				response.responseText = '{"error":1}';
				executeSut(settings.recover.message.INVALID_USER);
			});

			test("error message should be INVALID PASSWORD", function () {
				response.responseText = '{"error":2}';
				executeSut(settings.recover.message.INVALID_PASSWORD);
			});

			test("error message should be INVALID TOKEN", function () {
				response.responseText = '{"error":3}';
				executeSut(settings.recover.message.INVALID_TOKEN);
			});
		});

		suite("#init", function () {
			var params = {
				username: fakeUser,
				token: fakeToken
			};

			test("calls to prepare.hideLoading", function () {
				sut.init(params);
				sinon.assert.called(prepareStub.hideLoading);
			});
			test("calls to prepare.showRecoverForm", function () {
				sut.init(params);
				sinon.assert.called(prepareStub.showRecoverForm);
			});
			test("calls to prepare.prepareRecoverFormFocus", function () {
				sut.init(params);
				sinon.assert.called(prepareStub.prepareRecoverFormFocus);
			});
			test("calls to prepare.prepareRecoverSubmit", function () {
				sut.init(params);
				sinon.assert.calledWith(prepareStub.prepareRecoverSubmit, sinon.match.func);
			});
			test("calls to prepare.showDomainMessage", function () {
				sut.init(params);
				sinon.assert.called(prepareStub.showDomainMessage);
			});
		});

		suite("#recoverCall", function () {
			test("calls to call.post", function () {
				var data = {
					username: fakeUser,
					password: fakePassword,
					token: fakeToken
				};

				sut.recoverCall(data);
				sinon.assert.calledWith(callStub.post, settings.recover.url, sinon.match(data), sinon.match.func, sinon.match.func);
			});
		});

		suite("#getParams", function () {
			var location = {}, actual;

			function executeSut(search, expected) {
				location = {
					search: search
				};
				actual = sut.getParams(location);

				assert.equal(actual, expected);
			}

			test("return true because param user and token are in the url", function () {
				executeSut('?username=eyeos@open365.io&token=f75a5a01acbbec42290df8a24d66ad96becfefab6aca7e9650cebef10f67', true);
			});

			test("return false because param user is not in the url", function () {
				executeSut('?token=f75a5a01acbbec42290df8a24d66ad96becfefab6aca7e9650cebef10f67', false);
			});

			test("return false because param token is not in the url", function () {
				executeSut('?username=eyeos@open365.io', false);
			});

			test("return false because there are no params", function () {
				executeSut('', false)
			});
		});
	});
});
