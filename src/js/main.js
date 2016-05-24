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

require.config({
	baseUrl: './',
	paths: {
		js: 'src/js',
		jquery: 'src/vendor/jquery-2.1.1.min',
		emile: 'src/vendor/emile',
		i18next: 'src/vendor/i18next.min',
		eyeosAuthClient: 'src/vendor/eyeosAuthClient.min',
		operatingSystem : '../../bower_components/operating_system/build/operatingSystem.min',
		urijs: '../../bower_components/uri.js/src'
	},
	shim: {
		emile: {
			exports: "emile"
		},
		eyeosAuthClient: {
			deps: [ 'jquery' ]
		}
	}
});

require([
	"js/domReady",
	"js/login",
	"js/credentials",
	"js/prepare",
	"js/translator",
	"js/redirector",
	"js/recover",
	"js/analytics",
	"js/themeStyles",
	"js/clouds",
	"js/browserDetection",
	"js/settings"
], function (domReady, Login, Credentials, Prepare, Translator, Redirector, Recover, Analytics, ThemeStyles,clouds, BrowserDetector, Settings) {


	domReady(function() {
		if (!localStorage.userInfo) {
			localStorage.setItem('userInfo', JSON.stringify({lang: platformSettings.lang}));
		} else {
			var userInfo = JSON.parse(localStorage.userInfo);
			if (!userInfo.lang) {
				userInfo.lang = platformSettings.lang;
			}
			localStorage.setItem('userInfo', JSON.stringify(userInfo));
		}

		var settings = Settings,
			translator = new Translator();
		translator.applyTranslations();

		var login = new Login(),
			recover = new Recover(),
			redirector = new Redirector(),
			credentials = new Credentials(),
			prepare = new Prepare(),
			themeStyles = new ThemeStyles(),
			browserDetection = new BrowserDetector();

		if (window.currentPage) {
			themeStyles.insertStyle("themes/" + window.platformSettings.theme + "/css/" + window.currentPage + ".css");
		}

		prepare.showLoading();
		var params = prepare.getUrlParametersByNames(settings.reset.requestParams);

		if(location.pathname === settings.reset.pathname && params && params.username != null && params.username.length > 0 && params.token != null && params.token.length > 0) {
			recover.init(params);
		} else {
			credentials.checkCard(redirector.goToLoginTarget.bind(redirector), login.init.bind(login));
		}
	});
});
