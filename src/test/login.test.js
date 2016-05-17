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
	"js/login",
	"js/prepare",
	"js/credentials",
	"js/call",
	"js/captcha",
	"js/redirector",
	"js/userInfo",
	"js/forgot"
], function (Login, Prepare, Credentials, Call, Captcha, Redirector, UserInfo, Forgot) {

	suite("Login", function () {
		var sut, sutMock, url,
			prepare, prepareMock,
			credentials, credentialsMock,
			call, callMock,
			captcha, captchaMock,
			fakeUser, fakePassword,
			fakeId, fakeText,fakeDomain,
			originalJSON, settings,
			xhr, tid,
			redirector, redirectorGoToLoginTargetStub,
			userInfo, userInfoStub, platformSettings,
			forgot, forgotMock;

		setup(function () {
			url = "fake url";
			fakeUser = "pepito";
			fakePassword = "1234";
			fakeId = "test - captcha id";
			fakeText = "test - captcha text";
			fakeDomain = "open365.io";
			tid = "550e8400-e29b-41d4-a716-446655440000";
			xhr = {getResponseHeader: function() {return tid;}};

			prepare = new Prepare();
			prepareMock = sinon.mock(prepare);

			credentials = new Credentials();
			credentialsMock = sinon.mock(credentials);

			call = new Call();
			callMock = sinon.mock(call);

			captcha = new Captcha();
			captchaMock = sinon.mock(captcha);

			userInfo = new UserInfo();
			userInfoStub = sinon.stub(userInfo, 'getAndStore');

			redirector = new Redirector();
			redirectorGoToLoginTargetStub = sinon.stub(redirector, 'goToLoginTarget');

			forgot = new Forgot();
			forgotMock = sinon.mock(forgot);

			settings = {
				login: {
					url: {
						login: url,
						loginCaptcha: url
					},
					type: {
						login: "Basic",
						loginCaptcha: "LoginCaptcha"
					},
					response: {
						success: true,
						MAX_ATTEMPS: 429
					},
					message: {
						INVALID: "Incorrect user or password",
						INVALID_USER: "Invalid user",
						MAX_ATTEMPS: "Resolve this captcha to try again"
					}
				},
				captcha: {
					response: {
						success: true,
						ERR_MAX_ATTEMPS: 429
					}
				}
			};

			platformSettings = {
				defaultDomain: fakeDomain
			};

			sut = new Login(prepare, settings, credentials, call, captcha, redirector, userInfo, forgot, platformSettings);
			sutMock = sinon.mock(sut);

			originalJSON = JSON;
			JSON = {
				parse: function (data) {
					return data;
				},
				stringify: function (data) {
					return originalJSON.stringify(data);
				}
			};
		});

		teardown(function () {
			JSON = originalJSON;
		});

		suite("#loginSuccess", function () {
			var data, expectation;
			test("calls doSuccess with parsed data when data is 'true'", function () {
				data = { success: true };
				expectation = sutMock.expects("doSuccess").once().withExactArgs(JSON.parse(data));

				sut.loginSuccess(data, {}, xhr);

				expectation.verify();
			});

			test("calls fail with parsed data when parsed data is not true", function () {
				data = '"notTrue"';
				expectation = sutMock.expects("loginFail").once().withExactArgs(JSON.parse(data));

				sut.loginSuccess(data, {}, xhr);

				expectation.verify();
			});

			test("sets transactionId when data is 'true'", function () {
				data = { success: true };

				sut.loginSuccess(data, {}, xhr);

				assert.equal(sut.transactionId, tid);
			});
		});

		suite("#loginCall", function () {
			test("calls to call.post", function () {
				var data = {
						type: settings.login.type.login,
						username: fakeUser,
						domain: fakeDomain,
						password: fakePassword
					},
					exp = callMock.expects("post").once().withExactArgs(url, data, sinon.match.func, sinon.match.func);
				sut.loginCall(fakeUser, fakePassword, fakeDomain);
				exp.verify();
			});
		});

		suite("#loginFail", function () {
			var data,
				shakeBoxExp,
				setInputValuePasswordExp,
				prepareErrorMessageExp;
			setup(function () {
				data = settings.login.response.MAX_ATTEMPS;
				shakeBoxExp = prepareMock.expects("shakeBox").once().withExactArgs();
				setInputValuePasswordExp = prepareMock.expects("setInputValue").once().withExactArgs('password', '');
				prepareErrorMessageExp = prepareMock.expects("prepareErrorMessage").once();
			});
			test("calls shakeBox when called", function () {
				sut.loginFail({});
				shakeBoxExp.verify();
			});
			test("calls to prepare.setInputValue of password", function () {
				sut.loginFail({});
				setInputValuePasswordExp.verify();
			});
			test("calls to captcha.captchaCall with data when error = MAX_ATTEMPS", function () {
				var exp = captchaMock.expects("captchaCall").once().withExactArgs();
				sut.loginFail(429);
				exp.verify();
			});
		});

		suite("#init", function () {
			var prepareLoginFormFocusExp,
				prepareKeyPressExp,
				prepareUsernameInputExp,
				hideLoadingExp,
				prepareSubmitExp,
				prepareForgotExp,
				prepareForgotPassExp,
				forgotSetDomainExp;
			setup(function() {
				prepareLoginFormFocusExp = prepareMock.expects('prepareLoginFormFocus').once().withExactArgs();
				prepareKeyPressExp = prepareMock.expects('prepareKeyPress').once().withExactArgs();
				prepareSubmitExp = prepareMock.expects('prepareLoginSubmit').once().withExactArgs(sinon.match.func);
				prepareForgotExp = prepareMock.expects('prepareForgotSubmit').once().withExactArgs(sinon.match.func);
				prepareForgotPassExp = prepareMock.expects('prepareForgotPassClick').once().withExactArgs(sinon.match.func);
				prepareUsernameInputExp = prepareMock.expects('prepareUsernameInput').once().withExactArgs();
				hideLoadingExp = prepareMock.expects('hideLoading').once().withExactArgs();
				forgotSetDomainExp = forgotMock.expects('setDomain').once();
			});
			test("calls to prepare.prepareLoginFormFocus", function () {
				sut.init();
				prepareLoginFormFocusExp.verify();
			});
			test("calls to prepare.prepareKeyPress", function () {
				sut.init();
				prepareKeyPressExp.verify();
			});
			test("calls to prepare.prepareUsernameInput", function () {
				sut.init();
				prepareUsernameInputExp.verify();
			});
			test("calls to prepare.hideLoading", function () {
				sut.init();
				hideLoadingExp.verify();
			});
			test("calls to prepare.prepareLoginSubmit", function () {
				sut.init();
				prepareSubmitExp.verify();
			});
			test("calls to prepare.prepareForgotPassClick", function () {
				sut.init();
				prepareForgotPassExp.verify();
			});
			test("calls to forgot.setDomain", function () {
				sut.init();
				forgotSetDomainExp.verify();
			});
		});

		suite("#performLogin", function () {
			var fakeUsernameContent, fakeEvent,
				getInputValueUsernameExp, getInputValuePasswordExp,
				getInputValueCaptchaTextExp, getInputValueCaptchaIdExp,
				loginExp;
			setup(function () {
				fakeUsernameContent = fakeUser + '@' + fakeDomain;
				fakeEvent = { preventDefault: function () {} };
				getInputValueUsernameExp = prepareMock.expects('getInputValue').once().withExactArgs('username').returns(fakeUsernameContent);
				getInputValuePasswordExp = prepareMock.expects('getInputValue').once().withExactArgs('password').returns(fakePassword);
				getInputValueCaptchaTextExp = prepareMock.expects('getInputValue').once().withExactArgs('captchaText').returns(fakeText);
				getInputValueCaptchaIdExp = prepareMock.expects('getInputValue').once().withExactArgs('captchaId').returns(fakeId);
				loginExp = sutMock.expects("login").once().withExactArgs(fakeUser, fakePassword, fakeDomain, fakeId, fakeText);
			});
			test("calls to event.preventDefault", function () {
				var exp = sinon.mock(fakeEvent).expects("preventDefault").once().withExactArgs();
				sut.performLogin(fakeEvent);
				exp.verify();
			});
			test("calls to prepare.getInputValue 4 times", function () {
				sut.performLogin(fakeEvent);
				getInputValueUsernameExp.verify();
				getInputValuePasswordExp.verify();
				getInputValueCaptchaTextExp.verify();
				getInputValueCaptchaIdExp.verify();
			});
			test("calls to login.loginCall", function () {
				sut.performLogin(fakeEvent);
				loginExp.verify();
			});
		});

		suite("#performLogin invalid user", function () {
			var fakeUsernameContent, fakeEvent, prepareErrorMessage, shakeBoxExp;

			function executeSut(fakeUser) {
				fakeUsernameContent = fakeUser + '@' + fakeDomain;

				prepareMock.expects('getInputValue').once().withExactArgs('username').returns(fakeUsernameContent);
				sutMock.expects("login").once().withExactArgs(fakeUser, fakePassword, fakeDomain, fakeId, fakeText);

				sut.performLogin(fakeEvent);
				prepareErrorMessage.verify();
				shakeBoxExp.verify();
			}
			setup(function () {
				fakeEvent = { preventDefault: function () {} };
				prepareMock.expects('getInputValue').once().withExactArgs('password').returns(fakePassword);
				prepareMock.expects('getInputValue').once().withExactArgs('captchaText').returns(fakeText);
				prepareMock.expects('getInputValue').once().withExactArgs('captchaId').returns(fakeId);
				prepareErrorMessage = prepareMock.expects("prepareErrorMessage").once().withExactArgs(settings.login.message.INVALID_USER);
				shakeBoxExp = prepareMock.expects("shakeBox").once();
			});

			test("calls to prepare.prepareErrorMessage user invalid reason min length", function () {
				executeSut('hol');
			});

			test("calls to prepare.prepareErrorMessage user invalid reason max length", function () {
				//200 characters
				executeSut('dummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummydummy');
			});

			test("calls to prepare.prepareErrorMessage user invalid reason characters invalid", function () {
				executeSut('?¿!^');
			});
		});

		suite("#loginCaptchaCall", function () {
			test("calls to call.post", function () {
				var data = {
						type: settings.login.type.loginCaptcha,
						username: fakeUser,
						password: fakePassword,
						domain: fakeDomain,
						captchaId: fakeId,
						captchaText: fakeText
					},
					exp = callMock.expects('post').once().withExactArgs(url, data, sinon.match.func, sinon.match.func);
				sut.loginCaptchaCall(fakeUser, fakePassword, fakeDomain, fakeId, fakeText);
				exp.verify();
			});
		});

		suite("#doSuccess", function () {
			var credentials, setTokenExp;

			setup(function () {
				credentials = "fake credentials";
				setTokenExp = credentialsMock.expects("setToken").once().withExactArgs(credentials);
			});
			test("calls to credentials.setToken", function () {
				sut.doSuccess(credentials);
				setTokenExp.verify();
			});

			test("calls to gets the userInfo", function () {
				sut.transactionId = 'myTransactionId';
				sut.doSuccess(credentials);
				sinon.assert.calledWithExactly(userInfoStub, sinon.match.func);
			});

			test("calls to login.goToLoginTarget after getting user info", function () {
				sut.transactionId = 'myTransactionId';
				sut.doSuccess(credentials);
				userInfoStub.callArg(0);
				assert(redirectorGoToLoginTargetStub.calledWithExactly('myTransactionId'));
			});
		});
	});
});
