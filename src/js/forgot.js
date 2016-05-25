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
    "js/prepare",
    "js/settings",
    "js/call",
    "js/translator"
], function (Prepare, Settings, Call, Translator) {

    var Forgot = function (prepare, settings, call, injectedPlatformSettings, translator) {
        this.prepare = prepare || new Prepare();
        this.settings = settings || Settings;
        this.call = call || new Call();
        this.translator = translator || new Translator();
        this.platformSettings = injectedPlatformSettings || window.platformSettings;
    };

    Forgot.prototype = {

        setDomain: function (domain) {
            this.domain = domain;
        },

        forgotSuccess: function (response, status, xhr) {
            if (!response.error && status === 'success') {
                this.prepare.prepareSuccessMessage(this.settings.forgot.message.SUCCESS);
                $('.forgotPassButton').addClass('clicked');
            } else {
                this.forgotFail(response);
            }
        },

        forgotFail: function (response) {
            response = JSON.parse(response.responseText);
            this.requestFail(response);
        },

        performForgot: function (e) {
            // prevent submit
            e.preventDefault();
            var usernameContent = this.prepare.getInputValue('usernameForgot').toLowerCase(),
                username, domain;

            var usernameParts = usernameContent.split('@');

            username = usernameParts[0];
            domain = usernameParts[1];

            if (!domain) {
                this.prepare.showDomainErrorMessage(this.domain);
                return;
            }

            if (!username) {
                this.requestFail();
                return;
            }

            if (!/^[a-zA-Z0-9_.-]{4,192}$/.test(username)) {
                this.prepare.prepareErrorMessage(this.settings.forgot.message.INVALID_USER);
                this.prepare.shakeBox();
                return;
            }
            this.forgotCall({
                username: usernameContent,
                lang:this.translator.getUserLanguage(),
                domain: location.hostname
            });
        },

        requestFail: function (response) {
            var forgotSettings = this.settings.forgot,
                msg = forgotSettings.message.INVALID;

            switch (response && response.error) {
                case 1:
                    msg = forgotSettings.message.INVALID_USER;
                    break;

                case 4:
                    msg = response.msg;
                    break;

                case 6:
                    msg = forgotSettings.message.INVALID_DOMAIN;
                    break;
            }

            this.prepare.prepareErrorMessage(msg);
            this.prepare.shakeBox();
        },

        forgotCall: function (data) {
            var forgotSettings = this.settings.forgot;

            this.call.post(forgotSettings.url, data, this.forgotSuccess.bind(this), this.forgotFail.bind(this));
        }
    };

    return Forgot;
});
