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
	"js/forgot",
	"js/prepare",
	"js/settings",
	"js/call",
	"js/translator"
], function (Forgot, Prepare, Settings, Call, Translator) {

	suite("Forgot", function () {
		var sut,
			prepare, prepareStub, call, callStub, translator, translatorStub, fakeUser, fakeLang, fakeUrl,
			fakeDomain, settings, xhr, platformSettings;

		setup(function () {
			fakeUrl = "fake url";
			fakeUser = "pepito";
			fakeLang = "xx";
			fakeDomain = "open365.io";
			xhr = {};

			prepare = new Prepare();
			prepareStub = sinon.stub(prepare);

			call = new Call();
			callStub = sinon.stub(call);

			translator = new Translator();
			translatorStub = sinon.stub(translator);

			settings = {
				forgot: {
					url: fakeUrl,
					response: {
						success: true
					},
					message: {
						SUCCESS: "An email has been sent to you...",
						INVALID: "Incorrect params.",
						INVALID_USER: "Invalid user."
					}
				}
			};

			platformSettings = {
				defaultDomain: fakeDomain
			};

			sut = new Forgot(prepare, settings, call, platformSettings, translator);
		});

		suite("#forgotSuccess", function () {
			test("calls prepare success message when response there are no response error", function () {
				var response = { responseText:'{}'};

				sut.forgotSuccess(response, 'success', xhr);

				sinon.assert.calledWith(prepareStub.prepareSuccessMessage, settings.forgot.message.SUCCESS);
			});
		});

		suite("#requestFail", function () {
			var response = { responseText:'{"error":10}'};

			function executeSut(message) {
				sut.forgotFail(response);
				sinon.assert.calledWith(prepareStub.prepareErrorMessage, message);
				sinon.assert.called(prepareStub.shakeBox);
			}

			test("error message should be INVALID", function () {
				executeSut(settings.forgot.message.INVALID);
			});

			test("error message should be INVALID USER", function () {
				response.responseText = '{"error":1}';
				executeSut(settings.forgot.message.INVALID_USER);
			});
		});
	});
});
