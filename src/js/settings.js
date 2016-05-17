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

define(['operatingSystem'], function (OperatingSystem) {
	var domain = document.domain;
	var protocol = document.location.protocol;

	var settings = {
		login: {
			url: {
				login: protocol + "//" + domain + "/login/v1/methods/login/",
				loginCaptcha: protocol + "//" + domain + "/login/v1/methods/loginCaptcha/"
			},
			type: {
				login: "Basic",
				loginCaptcha: "LoginCaptcha"
			},
			response: {
				success: true,
				MAX_ATTEMPS: 429,
                SERVICE_UNAVAILABLE: 503,
				LICENSE_EXPIRED: 402
			},
			message: {
				INVALID: "Incorrect user or password",
				MAX_ATTEMPS: "Resolve this captcha to try again",
                SERVICE_UNAVAILABLE: "Servers have some hiccups, try later",
				LICENSE_EXPIRED: "The maximum number of users has been reached. Please contact your administrator"
			}
		},
		captcha: {
			url: {
				captcha: protocol + "//" + domain + "/captcha/v1/captcha/"
			}
		},
		forgot: {
			url: protocol + "//" + domain + "/password/v1/forgot",
			response: {
				success: true
			},
			message: {
				SUCCESS: "An email has been sent to you...",
				INVALID: "Incorrect params.",
				INVALID_USER: "Invalid user."
			}
		},
		recover: {
			url: protocol + "//" + domain + "/password/v1/recover/",
			response: {
				success: true
			},
			message: {
				SUCCESS: "Your password has been changed.",
				INVALID: "Incorrect params.",
				INVALID_USER: "Invalid user.",
				INVALID_PASSWORD: "Invalid password.",
				INVALID_TOKEN: "Your password recovery session has expired.",
				PASS_MISSMATCH: "Passwords don't match.",
				PASS_MIN_LENGHT: "Password must be at least 8 characters.",
				PASS_EQUAL_USER: "Passwords can't be equal to username."
			}
		},
		desktop: {
			url: protocol + "//" + domain + "/"
		},
		principal: {
			url: protocol + "//" + domain + '/principalService/v1/principals/me'
		},
		ENHANCED_MODE_AVAILABLE: true,
		ENHANCED_MODE_AVAILABLE_OS : [OperatingSystem.WINDOWS, OperatingSystem.MACOSX, OperatingSystem.Linux]
	};
	return settings;
});
