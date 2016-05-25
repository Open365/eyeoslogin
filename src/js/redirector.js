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
	"urijs/URI",
	"js/url",
	"js/credentials"
], function (Settings, UriJS, Url, Credentials) {

	var Redirector = function (settings, injectedLocation, url, credentials, injectedPlatformSettings) {
		this.settings = settings || Settings;
		this.location = injectedLocation || window.location;
		this.url = url || new Url();
		this.credentials = credentials || new Credentials();
		this.platformSettings = injectedPlatformSettings || window.platformSettings;
	};

	Redirector.prototype._removeParamFromQueryString = function (locationSearch, param) {
		locationSearch = new UriJS(locationSearch)
			.removeSearch(param)
			.search();
		return locationSearch;
	};

	Redirector.prototype.addTidToUrl = function (url, transactionId) {
		var locationSearch = this.location.search;
		locationSearch = this._removeParamFromQueryString(locationSearch, 'target');

		locationSearch = this._removeParamFromQueryString(locationSearch, 'TID');
		url = url + new UriJS(locationSearch)
			.addSearch("TID", transactionId)
			.search();
		return url;
	};

	Redirector.prototype.goToDefaultTarget = function(transactionId) {
		var url = this.url.getURLParameter('target', this.location) || '/';
		if (this.platformSettings.cleanUrlParameters) {
			url = this.url.removeURLParameters(url);
		} else {
			url = this.addTidToUrl(url, transactionId);
		}
		this.location.replace(url);
	};

	Redirector.prototype.goToLoginTarget = function (transactionId) {
		var self = this;
		return self.goToDefaultTarget(transactionId);
	};

	Redirector.prototype.gotToMainPage = function() {
		window.location = '/';
	};

	return Redirector;
});
