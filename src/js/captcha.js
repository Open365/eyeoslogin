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
	"js/settings",
	"js/call"
], function (Prepare, Settings, Call) {
	var Captcha = function (prepare, settings, call) {
		this.prepare = prepare || new Prepare();
		this.settings = settings || Settings;
		this.call = call || new Call();
	};

	Captcha.prototype.loginCaptchaFailCallback = function () {
        this.prepare.setInputValue('password', '');
        this.prepare.prepareKeyPress();

        this.prepare.shakeLogin();
		this.prepare.prepareCaptchaErrorMessage(this.settings.login.message.MAX_ATTEMPS);
		this.captchaCall();
	};

	Captcha.prototype.captchaCall = function () {
		this.prepare.setInputValue('captchaText', '');
		this.call.get(this.captchaSuccess.bind(this), this.captchaFail.bind(this));
	};

	Captcha.prototype.captchaSuccess = function (data) {
		data = JSON.parse(data);
		this.prepare.setInputValue('captchaId', data.id);
		this.prepare.prepareCaptcha(data.url, this.captchaCall.bind(this));
	};

	Captcha.prototype.captchaFail = function (data) {
		data = JSON.parse(data);
		this.prepare.prepareCaptchaErrorMessage(data.message);
	};

	return Captcha;
});
