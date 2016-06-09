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

window.platformSettings = {
	lang: 'en',
	theme:'open365',
	cleanUrlParameters: false,
	customTitle: false,
	disableAnalytics: false,
	forceDomain: true,
	defaultDomain: "open365.io",
	publicTenant: "cloud",
	domainFromUrl: false,
	domainFromUrlExceptions: "",
	suggestDomain: true,
	enableUserRegistration: true,
	minBrowsersVersion: { "Chrome":30, "Firefox": 30 },
	lastSettingsInFile: null // This line is to make sure that all the settings have a trailing coma
};
