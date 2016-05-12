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
		eyeRunRequestor: '../../bower_components/eyeRunRequestor/build/eyeRunRequestor.min',
		operatingSystem : '../../bower_components/operatingSystem/build/operatingSystem.min',
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
	"js/recovery"	
], function (domReady, Login, Credentials, Prepare, Translator, Redirector, Recovery) {	
	domReady(function() {

		if ($("#recoveryPage").length) {

			var recovery = new Recovery();
			recovery.prepare();

		} else {

			if (!localStorage.userInfo) {
				localStorage.setItem('userInfo', JSON.stringify({lang: platformSettings.lang}));
			} else {
				var userInfo = JSON.parse(localStorage.userInfo);
				if (!userInfo.lang) {
					userInfo.lang = platformSettings.lang;
				}
				localStorage.setItem('userInfo', JSON.stringify(userInfo));
			}

			var translator = new Translator();
			translator.applyTranslations();
			var login = new Login(),
			redirector = new Redirector(),
			credentials = new Credentials(),
			prepare = new Prepare();
			prepare.showLoading();
			credentials.checkCard(redirector.goToLoginTarget.bind(redirector), login.init.bind(login));
		}

	});
});
