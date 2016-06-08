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
	"js/credentials",
	"js/call",
	"js/captcha",
	"operatingSystem",
	"js/redirector",
	"js/userInfo",
	"js/forgot"
], function (Prepare, Settings, Credentials, Call, Captcha, OperatingSystem, Redirector, UserInfo, Forgot) {

	var Login = function (prepare, settings, credentials, call, captcha, redirector, userInfo, forgot, injectedPlatformSettings) {
		this.prepare = prepare || new Prepare();
		this.settings = settings || Settings;
		this.credentials = credentials || new Credentials();
		this.call = call || new Call();
		this.captcha = captcha || new Captcha();
		this._redirector = redirector || new Redirector();
		this.userInfo = userInfo || new UserInfo();
		this.forgot = forgot || new Forgot();
		this.platformSettings = injectedPlatformSettings || window.platformSettings;
	};

	Login.prototype = {
		login: function (username, password, domain, captchaId, captchaText) {
			if (this.prepare.hasCaptcha()) {
				this.loginCaptchaCall(username, password, domain, captchaId, captchaText);
			} else {
				this.loginCall(username, password, domain);
			}
		},

		loginCall: function (username, password, domain) {
			this.call.post(this.settings.login.url.login, {
				type: this.settings.login.type.login,
				username: username,
				password: password,
				domain: domain
			}, this.loginSuccess.bind(this), this.loginFailCallback.bind(this));
		},

		loginCaptchaCall: function (username, password, domain, id, text) {
			this.call.post(this.settings.login.url.loginCaptcha, {
				type: this.settings.login.type.loginCaptcha,
				username: username,
				password: password,
				domain: domain,
				captchaId: id,
				captchaText: text
			}, this.loginSuccess.bind(this), this.captcha.loginCaptchaFailCallback.bind(this.captcha));
		},

		performLogin: function (e) {
			// prevent submit
			e.preventDefault();
			var usernameContent = this.prepare.getInputValue('username').toLowerCase(),
				password = this.prepare.getInputValue('password').trim(),
				captchaText = this.prepare.getInputValue('captchaText'),
				captchaId = this.prepare.getInputValue('captchaId'),
				username, domain;

			var usernameParts = usernameContent.split('@');

			username = usernameParts[0];
			domain = usernameParts[1];

			if (!domain) {
				if (this.platformSettings.forceDomain) {
					this.prepare.hideDomainMessage();
					this.prepare.showDomainErrorMessage(this.domain);
					return;
				} else {
					domain = this.domain.substring(1); //it contains @ and we don't need it
				}
			}

			if (!username) {
				this.loginFail();
				return;
			}

			if(!/^[a-zA-Z0-9_.-]{4,192}$/.test(username)) {
				this.prepare.prepareErrorMessage(this.settings.login.message.INVALID_USER);
				this.prepare.shakeBox();
				return;
			}

			this.prepare.prepareErrorMessage("");
			this.prepare.prepareCaptchaErrorMessage("");
			this.login(username, password, domain, captchaId, captchaText);
		},

		loginSuccess: function (response, status, xhr) {
			var data = JSON.parse(response);
			if (data === true || data.success) {
				this.transactionId = xhr.getResponseHeader("X-eyeos-TID");
				this.doSuccess(data);
				$('.loginButton').addClass('clicked');
				if (this.platformSettings.disableAnalytics === false) {
					ga('set', 'metric1', 1 );
					ga('send', 'event', 'Login', 'Success');
				}
			} else {
				this.loginFail(data);
			}
		},

		doSuccess: function (data) {
			var self = this;
			function goToLoginTarget () {
				self._redirector.goToLoginTarget.call(self._redirector, self.transactionId);
			}
			this.credentials.setToken(data);
			this.userInfo.getAndStore(goToLoginTarget);
 		},

		loginFailCallback: function (xhr) {
			this.loginFail(xhr.status);
		},

		loginFail: function (status) {
			var loginSettings = this.settings.login,
				message = loginSettings.message.INVALID;
			this.prepare.shakeBox();
			this.prepare.setInputValue('password', '');
			if (status === loginSettings.response.MAX_ATTEMPS) {
				message = loginSettings.message.MAX_ATTEMPS;
				this.captcha.captchaCall();
			} else if (status === loginSettings.response.SERVICE_UNAVAILABLE){
                message = loginSettings.message.SERVICE_UNAVAILABLE;
			} else if (status === loginSettings.response.LICENSE_EXPIRED){
				message = loginSettings.message.LICENSE_EXPIRED;
			}
			this.prepare.prepareErrorMessage(message);
			if (this.platformSettings.disableAnalytics === false) {
				ga('set', 'metric2', 1 );
				ga('send', 'event', 'Login', 'Failed');
			}
		},

		init: function () {
			var fromUrl = this.platformSettings.domainFromUrl;
			if(this.platformSettings.domainFromUrlExceptions.split(',').indexOf(location.hostname)>-1) {
				fromUrl = false;
			}
			this.domain = fromUrl ? "@" + location.hostname : "@" + this.platformSettings.defaultDomain;

			this.prepare.hideLoading();
			this.prepare.prepareLoginFormFocus();
			this.prepare.prepareLoginSubmit(this.performLogin.bind(this));
			this.prepare.prepareUsernameInput();
			this.prepare.prepareRegisterButton();
			this.prepare.showDomainMessage(this.domain);

			this.forgot.setDomain(this.domain);
			this.prepare.prepareForgotSubmit(this.forgot.performForgot.bind(this.forgot));
			this.prepare.prepareForgotPassClick(this.prepare.showForgotForm.bind(this.prepare));
			this.prepare.prepareForgotAskForHelpClick(this.prepare.linkAskForHelp());
			this.prepare.prepareLoginTermsAndConditionsClick(this.prepare.linkTermsAndConditions());

			this.prepare.showLoginButton();
		}
	};

	return Login;
});
