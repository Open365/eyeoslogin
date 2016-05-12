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
	"operatingSystem",
	"eyeRunRequestor",
	"urijs/URI",
	"js/credentials",
], function (Settings, OperatingSystem, EyeRunRequestor, UriJS, Credentials) {

	var Redirector = function (settings, eyeRunRequestor, injectedLocation, injectedOperatingSystem, credentials, injectedPlatformSettings) {
		this.settings = settings || Settings;
		this._requestor = eyeRunRequestor || new EyeRunRequestor();
		this._appGateway = this._requestor.appGateway();
		this.location = injectedLocation || window.location;
		this.OperatingSystem = injectedOperatingSystem || OperatingSystem;
		this.credentials = credentials || new Credentials();
		this.platformSettings = injectedPlatformSettings || window.platformSettings;
	};

	Redirector.prototype._removeParamFromQueryString = function (locationSearch, param) {
		var locationSearch = new UriJS(locationSearch)
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
		var url = getURLParameter('target', this.location) || '/';
		if (this.platformSettings.cleanUrlParameters) {
			url = removeURLParameters(url);
		} else {
			url = this.addTidToUrl(url, transactionId);
		}
		this.location.replace(url);
	};

	Redirector.prototype.goToEnhancedTarget = function(transactionId) {
		var url = getURLParameter('target', this.location) || '';
		if (!url) {
			url = this.settings.desktop.url;
		}

		url = this.addTidToUrl(url, transactionId);
		var symbol = "?";
		if(url.indexOf("?")!==-1){
			symbol = "&";
		}
		this._appGateway.openApp(url + symbol +"userInfo="+ encodeURIComponent(localStorage.getItem('userInfo')));


		//TODO: this legacy code should be moved to preparejs.
		$("#loading").removeClass("loadingShown");
		$("#loading").addClass("hidden");
		$("#eyeRunDisclaimer").addClass("hidden");
		$("#textLaunch").addClass("hidden");
		$("#textLogIn").addClass("hidden");
		$("#captchaBox").addClass("hidden");
		$("#passRow").addClass("hidden");
		$("#userRow").addClass("hidden");
		$("#errorMessage").addClass("hidden");
		$("#errorCaptchaMessage").addClass("hidden");
		$("#eyeRunGeneralContainer").addClass("hidden");
		$("#loginGeneralContainerCentered").addClass("eyeos-opened");
		$("#loginform").removeClass("hidden");

	};

	Redirector.prototype.goToLoginTarget = function (transactionId) {
		var self = this;
		if(!this.shouldApplyEnhancedMode()) {
			return self.goToDefaultTarget(transactionId);
		}
		this._requestor.eyeRunInstalled(function(exists) {
			if(exists) {
				self._appGateway.isChromeInstalled(function(chromeExists) {
					if(chromeExists) {
						//Delete credentials for this browser
						self.credentials.removeCard();
						self.goToEnhancedTarget(transactionId)
					} else {
						self.goToDefaultTarget(transactionId);
					}
				});
			} else{
				self.goToDefaultTarget(transactionId);
			}
		});
	};

	Redirector.prototype.shouldApplyEnhancedMode = function() {
		if (this.platformSettings.disableEyeRun) {
			return false;
		}
		var notAlreadyAppModeRunning = (this.location.href.indexOf('APP_MODE=1') === -1);
		return notAlreadyAppModeRunning && this.settings.ENHANCED_MODE_AVAILABLE && $.inArray(this.OperatingSystem.getName(), this.settings.ENHANCED_MODE_AVAILABLE_OS) !== -1
	};

	function getURLParameter(name, location) {
		return decodeURIComponent((
			new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
				.exec(location.search)
			|| [, ""])[1].replace(/\+/g, '%20'))
			|| null;
	}

	function removeURLParameters(url) {
		var index = url.indexOf('?');
		if (index != -1) {
			return url.str(0, index);
		}
		return url;
	}

	return Redirector;
});
