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
	"js/call"
], function (Settings, Call) {

	var Recovery = function (settings, call, injectedPlatformSettings) {
		this.settings = settings || Settings;
		this.call = call || new Call();
		this.platformSettings = injectedPlatformSettings || window.platformSettings;
	};

	Recovery.prototype = {

		prepare: function() {
			$("#messageBoxOK").click(this.closeMessageBox);
			$("#recoverySend").click(function() {
				var username = $("#username").val();
				this.sendRequest(username);				
			}.bind(this));
			$("#changePasswordSend").click(function() {
				var passA = $("#password").val();
				var passB = $("#passwordRepeat").val();				
				var username = this.getParameterByName('username');
				var token = this.getParameterByName('token');
				this.sendNewPassword(passA, passB, username, token);
			}.bind(this));
		},

		showMessage: function(message) {
			$("#messageBox P").html(message);
			$("#messageBox").css("display", "block");
		},

		closeMessageBox: function() {
			$("#messageBox").css("display", "none").find("P").html("");
			$("A#recoverySend").removeClass("disabled");
		},		

		sendRequest: function(username) {
			$("A#recoverySend").addClass("disabled");
			if (!this.verifyData({ username: username }, "username")) {
				this.showMessage(this.settings.recovery.message.INVALID_USER);
				return false;
			}
			this.call.post(this.settings.recovery.url.request, {
				username: username
			}, this.requestSuccess.bind(this), this.postFail.bind(this));
		},

		sendNewPassword: function(password, passwordRepeat, username, token) {
			$("A#recoverySend").addClass("disabled");

			if (!this.verifyData({ username: username }, "username")) {
				this.showMessage(this.settings.recovery.message.INVALID_USER);
				return false;
			}

			if (!this.verifyData({ password_1: password, password_2: passwordRepeat }, "passwordMatch")) {
				this.showMessage(this.settings.recovery.message.PASS_MISSMATCH);
				return false;
			}

			if (!this.verifyData({ password: password, username: username }, "password")) {
				this.showMessage(this.settings.recovery.message.INVALID_PASSWORD);
				return false;
			}

			this.call.post(this.settings.recovery.url.change, {
				password: password,
				username: username,
				token: token
			}, this.recoverySuccess.bind(this), this.postFail.bind(this));
		},		

		requestSuccess: function (response, status, xhr) {
			if (!response.error && status === 'success') {
				this.showMessage(this.settings.recovery.message.SUCCESS_1);
			} else {
				this.postFail(response);
			}
			$("A#recoverySend").removeClass("disabled");
		},

		recoverySuccess: function (response, status, xhr) {
			if (!response.error && status === 'success') {
				this.showMessage(this.settings.recovery.message.SUCCESS_2);
			} else {
				this.postFail(response);
			}
			$("A#recoverySend").removeClass("disabled");
		},

		postFail: function(response) {
			var msg;

			switch (response.error) {
				case 1:
					msg = this.settings.recovery.message.INVALID_USER;
				break;

				case 2:
					msg = this.settings.recovery.message.INVALID_PASSWORD;
				break;

				case 3:
					msg = this.settings.recovery.message.INVALID_TOKEN;
				break;

				case 4:
					msg = response.msg;
				break;

				default:
					msg = response.msg;
			}
			this.showMessage(msg);		
			$("A#recoverySend").removeClass("disabled");
		},

		getParameterByName: function(name) {
		    var url = window.location.href;
		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		},

		verifyData: function(data, type) {
			switch(type) {
				// Must be a valid email address
				case 'username':
					var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return re.test(data.username);
				break;

				case 'password':
					return data.password !== data.username && data.password.length >= 8;
				break;

				case 'passwordMatch':
					return data.password_1 === data.password_2;
				break;

				default:
					return false;
			}
		}

	};

	return Recovery;
});
