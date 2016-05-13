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
	"js/tr",
	"operatingSystem"
], function ($, emile, tr, OperatingSystem) {

	var Prepare = function () {
		this._eyeRunDownloadInterval = null;
		this.platformSettings = window.platformSettings || {};
	};

	Prepare.prototype.prepareSubmit = function (callback) {
		$("#loginform").on("submit", callback);
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

	Prepare.prototype.shakeLogin = function () {
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
		$("#errorMessage").html(tr(message));
		if(message.length > 0){
			$("#errorMessage").removeClass('hidden');
		}else{
			$("#errorMessage").addClass('hidden');
		}
	};

	Prepare.prototype.prepareCaptchaErrorMessage = function (message) {
		$("#errorCaptchaMessage").html(tr(message));
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
		this.hideLaunchButton();
		this.hideLoginButton();
		$("#loginform").removeClass("hidden");
	};


	Prepare.prototype.hideDetectButtonAndShowLoginButton = function () {
		this.hideDetectingEyerunButton();
		this.showLoginButton();
	};
	Prepare.prototype.hideDetectButtonAndShowLaunchButton = function () {
		this.hideDetectingEyerunButton();
		this.showLaunchButton();
	};

	Prepare.prototype.showLoginButton = function () {
		$("#textLogIn").removeClass("hidden");
	};

	Prepare.prototype.hideLoginButton = function () {
		$("#textLogIn").addClass("hidden");
	};


	Prepare.prototype.showLaunchButton = function () {
		$("#textLaunch").removeClass("hidden");
	};

	Prepare.prototype.hideLaunchButton = function () {
		$("#textLaunch").addClass("hidden");
	};

	Prepare.prototype.hideDetectingEyerunButton = function () {
		$("#detectingEyerun").addClass("hidden");
	};

	Prepare.prototype.generateDownloadLinks = function(versions) {

			OperatingSystem.getEyeRunDownloadLink(function(url) {

				$("#eyeRunGeneralContainer").show();

				var downloadName = versions?versions[0].name:'eyeRun';
				$("#eyeRunLink1").text(downloadName).attr("href", url);

				if (versions[1] !== 'undefined' ) {
					OperatingSystem.getEyeRunDownloadLink(function(url) {

						$("#eyeRunLinkor").show();
						$("#eyeRunLink2").text(versions[1].name).attr("href", url).show();

					}, versions[1].version);
				}


			}, versions?versions[0].version:'');

	};

	Prepare.prototype.hideDomainMessage = function () {
		$('#advice_username').addClass('hidden');
	};

	Prepare.prototype.showDomainMessage = function (domain) {

		var html = "";
		if (this.platformSettings.forceDomain) {
			if (this.platformSettings.suggestDomain) {
				html = "Username should include <strong >" + domain + "</strong>";
			} else {
				html = "Username should be something like username@example.com";
			}
			$('#advice_username').removeClass('hidden').html(html);
		}
	};

	Prepare.prototype.prepareRegisterButton = function () {
		if (this.platformSettings.enableUserRegistration) {
			$('#register_button').removeClass('hidden');
		}
	};

	return Prepare;
});

