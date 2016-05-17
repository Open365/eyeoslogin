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
	"jquery",
	"emile",
	"js/translator",
	"js/settings"
], function ($, emile, Translator, Settings) {

	var Prepare = function (settings, translator) {
		this.platformSettings = window.platformSettings || {};
		this.translator = translator || new Translator();
		this.settings = settings || Settings;
	};

	Prepare.prototype.prepareLoginSubmit = function (callback) {
		$("#loginform").on("submit", callback);
	};

	Prepare.prototype.prepareForgotSubmit = function (callback) {
		$("#forgotform").on("submit", callback);
	};

	Prepare.prototype.prepareRecoverSubmit = function (callback) {
		$("#recoverform").on("submit", callback);
	};

	Prepare.prototype.prepareForgotPassClick = function(callback) {
		$("#forgotPassLink").click(callback);
	};

	Prepare.prototype.showForgotForm = function() {
		this.hideLoginForm();
		this.hideRecoverForm();
		$("#forgotform").removeClass("hidden");
	};

	Prepare.prototype.showRecoverForm = function() {
		this.hideLoginForm();
		this.hideForgotForm();
		$("#recoverform").removeClass("hidden");
	};

	Prepare.prototype.hideForgotForm = function() {
		$("#forgotform").addClass("hidden");
	};

	Prepare.prototype.hideRecoverForm = function() {
		$("#recoverform").addClass("hidden");
	};

	Prepare.prototype.hideLoginForm = function() {
		$("#loginform").addClass("hidden");
	};

	Prepare.prototype.prepareRecoverFormFocus = function() {
		$("#newPassword").focus();
	};

	Prepare.prototype.prepareLoginFormFocus = function () {
		// focus on username when the page is loaded.
		$("#username").focus();
	};

	Prepare.prototype.prepareKeyPress = function () {
		var self = this;
		// focus on username/password when login button lost its focus
		$('#loginButtonBox').blur();
        var input = 'username';
        if (self.hasCaptcha()) {
            input = 'password';
        }
        $("#" +input).focus();
	};

	Prepare.prototype.shakeBox = function () {
		//third party
		function bounce(pos) {
			pos += 1.941626;
			if (pos > 2.170804) {
				return 0;
			}
			return Math.sin(10 * pos * pos) / (pos);
		}

		emile(document.getElementById('loginGeneralContainer'), 'margin-left: 100px', {duration: 1000, easing: bounce});
	};

	Prepare.prototype.prepareCaptcha = function (url, callback) {
		if (!this.hasCaptcha()) {
			$('#captchaBox').show();
			this.prepareRefreshButton(callback);
			$("#captchaText").prop('required', true);
		}
		this.setCaptchaImage(url);
	};

	Prepare.prototype.prepareUsernameInput = function () {
		var self = this;
		$("#username").change(function () {
			if (self.hasCaptcha()) {
				$("#captchaText").prop('required', false);
				$('#captchaBox').hide();
				$("#errorMessage").html("");
				$("#errorMessage").addClass('hidden');
			}
		});
	};

	Prepare.prototype.hasCaptcha = function () {
		return $('#captchaBox').is(":visible");
	};

	Prepare.prototype.setCaptchaImage = function (url) {
		$('#captchaImage').attr("src", url);
	};

	Prepare.prototype.prepareErrorMessage = function (message) {
		$("#errorMessage").html(this.translator.messageTranslation(message));
		if(message.length > 0){
			$("#errorMessage").removeClass('hidden');
			$("#successMessage").addClass('hidden');
		}else{
			$("#errorMessage").addClass('hidden');
		}
	};

	Prepare.prototype.prepareSuccessMessage = function (message) {
		$("#successMessage").html(this.translator.messageTranslation(message));
		if(message.length > 0){
			$("#successMessage").removeClass('hidden');
		}else{
			$("#successMessage").addClass('hidden');
		}
	};

	Prepare.prototype.prepareCaptchaErrorMessage = function (message) {
		$("#errorCaptchaMessage").html(this.translator.messageTranslation(message));
		if(message.length > 0){
			$("#errorCaptchaMessage").removeClass('hidden');
		}else{
			$("#errorCaptchaMessage").addClass('hidden');
		}
	};

	Prepare.prototype.prepareRefreshButton = function (callback) {
		// [VDI-2140] if there's no events for #captchaRefreshButton, define the click event
		if (!$._data( $('#captchaRefreshButton')[0], 'events' )) {
			$("#captchaRefreshButton").click(callback);
		}
	};

	Prepare.prototype.getInputValue = function (label) {
		return $("#" + label).val();
	};

	Prepare.prototype.setInputValue = function (label, value) {
		return $("#" + label).val(value);
	};

	Prepare.prototype.showLoading = function () {
		$("#loading").addClass("loadingShown");
		$("#loginform").addClass("hidden");
	};

	Prepare.prototype.hideLoading = function () {
		$("#loading").removeClass("loadingShown");
		$("#loading").addClass("hidden");
		this.hideLoginButton();
		$("#loginform").removeClass("hidden");
	};

	Prepare.prototype.showLoginButton = function () {
		$("#textLogIn").removeClass("hidden");
	};

	Prepare.prototype.hideLoginButton = function () {
		$("#textLogIn").addClass("hidden");
	};

	Prepare.prototype.hideDomainMessage = function () {
		$('#advice_username').addClass('hidden');
	};

	Prepare.prototype.showDomainMessage = function (domain) {

		var html = "";
		if (this.platformSettings.forceDomain) {
			if (this.platformSettings.suggestDomain) {
				html = this.translator.messageTranslation(this.settings.general.message.ADVICE_USERNAME) + " <strong id=\"domain\">" + domain + "</strong>";
			} else {
				html = this.translator.messageTranslation(this.settings.general.message.INVALID_USER_MANDATORY_DOMAIN);
			}
			$('#advice_username').removeClass('hidden').html(html);
		}
	};

	Prepare.prototype.showDomainErrorMessage = function(domain) {
		if (this.platformSettings.forceDomain) {
			if (this.platformSettings.suggestDomain) {
				this.prepareErrorMessage(this.translator.messageTranslation(this.settings.general.message.ADVICE_USERNAME) + " " + domain);
			} else {
				this.prepareErrorMessage(this.settings.general.message.INVALID_USER_MANDATORY_DOMAIN);
			}
			this.shakeBox();
		}
	};

	Prepare.prototype.prepareRegisterButton = function () {
		if (this.platformSettings.enableUserRegistration) {
			$('#register_button').removeClass('hidden');
		}
	};

	Prepare.prototype.getUrlParametersByNames = function(names) {
		var url = window.location.href,
			params = {};
		for(var i = 0; i < names.length; i++) {
			names[i] = names[i].replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + names[i] + "(=([^&#]*)|&|#|$|)"),
				results = regex.exec(url);
			if (!results) {
				params[names[i]] = null;
				break;
			}
			if (!results[2]) {
				params[names[i]] = '';
				break;
			}
			params[names[i]] = decodeURIComponent(results[2].replace(/\+/g, " ")).replace("/","");
		}
		return params;
	};

	return Prepare;
});

