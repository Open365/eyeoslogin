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
	"js/settings",
	"js/credentials"

], function (settings, Credentials) {
	function UserInfo (customSettings, credentials, custom$, customLocalStorage, customPlatformSettings) {
		this.settings = customSettings || settings;
		this.credentials = credentials || new Credentials();
		this.$ = custom$ || $;
		this.localStorage = customLocalStorage || localStorage;
		this.platformSettings = customPlatformSettings;
	}

	UserInfo.prototype.getAndStore = function (cb) {
		var platSettings = this.platformSettings || platformSettings;
		var self = this;
		this.$.ajax({
			dataType: "json",
			contentType: "application/json",
			type: "GET",
			url: this.settings.principal.url,
			headers: this.credentials.getRawCredentials()
		}).done(function (data) {
			var userInfo = {
				lang: (data.preferences && data.preferences.lang) || platSettings.lang
			};
			self.localStorage.setItem('userInfo', JSON.stringify(userInfo));
			cb();
		}).fail(function () {
			self.localStorage.setItem('userInfo', JSON.stringify({lang: platSettings.lang}));
			cb();
		});
	};

	return UserInfo;

});
