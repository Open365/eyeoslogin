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
	"js/tr",
	"i18next",
	"js/settings"
],	function (tr, Settings) {

	function Translator() {
		this.platformSettings = window.platformSettings || {};
		this.settings = Settings;
	}

	Translator.prototype.getCurrentLanguage = function(lang) {
		var languageMap = {
			"es" : "es_ES",
			"en" : "en_UK",
			"it" : "it_IT"
		};
		if(languageMap.hasOwnProperty(lang)) {
			return languageMap[lang];
		}
		return lang;
	};

	Translator.prototype.applyTranslations = function () {
		window.lang = this.getUserLanguage();
		i18n.init({
			getAsync:false,
			resGetPath: 'translations/__lng__/__ns__.json',
			lng: this.getCurrentLanguage(window.lang)
		});

		var elements = document.getElementsByTagName("INPUT");
		for (var i = 0; i < elements.length; i++) {
			elements[i].oninvalid = function (e) {
				e.target.setCustomValidity("");
				if (!e.target.validity.valid) {
					e.target.setCustomValidity(this.messageTranslation(this.settings.general.message.CUSTOM_VALIDITY));
				}
			};
			elements[i].oninput = function (e) {
				e.target.setCustomValidity("");
			};
		}


		$("#usernameLabel").html(tr($("#usernameLabel").html()));
		$("#passwordLabel").html(tr($("#passwordLabel").html()));
		$("#forgotPassLink a").html(tr($("#forgotPassLink a").text()));
		$("#register_button a").html(tr($("#register_button a").text()));

		$("#termsAndConditions span").text(tr($("#termsAndConditions span").text()));
		$("#termsAndConditions a").html(tr($("#termsAndConditions a").text()));

		$("#forgotPassLabel").html(tr($("#forgotPassLabel").html()));
		$("#usernameForgotLabel").html(tr($("#usernameForgotLabel").html()));
		$("#forgotPassButton").text(tr($("#forgotPassButton").text().trim()));
		$("#forgotPassHelpText span").text(tr($("#forgotPassHelpText span").text()));
		$("#forgotPassHelpText a").html(tr($("#forgotPassHelpText a").text()));

		$("#newPasswordLabel").html(tr($("#newPasswordLabel").html()));
		$("#repeatPasswordLabel").html(tr($("#repeatPasswordLabel").html()));
		$("#recoverPassButton").text(tr($("#recoverPassButton").text().trim()));

		$("#textLogIn").text(tr($("#textLogIn").text().trim()));
		$("#captchaRefreshButton").attr('alt', tr($("#captchaRefreshButton").attr('alt')));

		$("#notSupported").text(tr($("#notSupported").text().trim()));
		$("#notSupportedDesc").text(tr($("#notSupportedDesc").text().trim()));
		$("#pleaseDownload").text(tr($("#pleaseDownload").text().trim()));
		$("#notSupportedTryAgain").text(tr($("#notSupportedTryAgain").text()));

	};

	Translator.prototype.messageTranslation = function(message) {
		return tr(message);
	};

	Translator.prototype.getUserLanguage = function() {
		return this.platformSettings.lang || 'en';
	};

	return Translator;
});

