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
	"js/prepare",
	"js/call",
	"js/captcha"
], function (Prepare, Call, Captcha) {
	suite("Captcha", function () {
		var sut, settings,
			prepare, prepareMock,
			call, callMock;
		setup(function () {
			prepare = new Prepare();
			prepareMock = sinon.mock(prepare);

			call = new Call();
			callMock = sinon.mock(call);

			settings = {
				login: {
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

			sut = new Captcha(prepare, settings, call);
		});

		suite("#captchaCall", function () {
			var getExp, setInputValueCaptchaTextExp;
			setup(function () {
				setInputValueCaptchaTextExp = prepareMock.expects("setInputValue").once().withExactArgs('captchaText', '');
				getExp = callMock.expects("get").once().withExactArgs(sinon.match.func, sinon.match.func);
			});
			test("calls to call.get", function () {
				sut.captchaCall();
				getExp.verify();
			});
			test("calls to prepare.setInputValue", function () {
				sut.captchaCall();
				setInputValueCaptchaTextExp.verify();
			});
		});

		suite("#loginCaptchaFailCallback", function () {
			var shakeBoxExp, getExp, prepareCaptchaErrorMessageExp, setInputValueExp;
			setup(function () {
				getExp = callMock.expects("get").once().withExactArgs(sinon.match.func, sinon.match.func);
				shakeBoxExp = prepareMock.expects("shakeBox").once().withExactArgs();
				prepareCaptchaErrorMessageExp = prepareMock.expects("prepareCaptchaErrorMessage").once().withExactArgs(settings.login.message.MAX_ATTEMPS);
				setInputValueExp = prepareMock.expects("setInputValue").twice();
			});
			test("calls to prepare.shakeBox", function () {
				sut.loginCaptchaFailCallback();
				shakeBoxExp.verify();
			});
			test("calls to call.get", function () {
				sut.loginCaptchaFailCallback();
				getExp.verify();
			});
			test("calls to prepare.prepareCaptchaErrorMessage", function () {
				sut.loginCaptchaFailCallback();
				prepareCaptchaErrorMessageExp.verify();
			});
			test("calls to prepare.setInputValue", function () {
				sut.loginCaptchaFailCallback();
				setInputValueExp.verify();
			})
		});

		suite("#captchaSuccess", function () {
			var id, url, data,
				prepareCaptchaExp,
				setInputValue;
			setup(function () {
				id = "a test id";
				url = "a test url";
				data = { id: id, url: url };
				setInputValue = prepareMock.expects('setInputValue').once().withExactArgs('captchaId', data.id);
				prepareCaptchaExp = prepareMock.expects('prepareCaptcha').once().withExactArgs(url, sinon.match.func);
			});
			test("calls to prepare.setInputValue", function () {
				sut.captchaSuccess(JSON.stringify(data));
				setInputValue.verify();
			});
			test("calls to prepare.prepareCaptcha", function () {
				sut.captchaSuccess(JSON.stringify(data));
				prepareCaptchaExp.verify();
			});
		});

		suite("#captchaFail", function () {
			test("calls to prepare.prepareCaptchaErrorMessage", function () {
				var msg = "a test error message",
					data = { message: msg },
					expectation = prepareMock.expects('prepareCaptchaErrorMessage').once().withExactArgs(msg);
				sut.captchaFail(JSON.stringify(data));
				expectation.verify();
			})
		});

	});
});
