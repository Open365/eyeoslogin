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
    "js/redirector"
], function (Prepare, Settings, Call, Redirector) {

    var Recover = function (prepare, settings, call, injectedPlatformSettings, redirector) {
        this.prepare = prepare || new Prepare();
        this.settings = settings || Settings;
        this.call = call || new Call();
        this.platformSettings = injectedPlatformSettings || window.platformSettings;
        this.redirector = redirector || new Redirector();
    };

    Recover.prototype = {

        setDomain: function (domain) {
            this.domain = domain;
        },

        recoverSuccess: function (response, status, xhr) {
            if (!response.error && status === 'success') {
                this.prepare.prepareSuccessMessage(this.settings.recover.message.SUCCESS);
                this.redirector.gotToMainPage();
                $('.recoverPassButton').addClass('clicked');
            } else {
                this.recoverFail(response);
            }
        },

        recoverFail: function (response) {
            response = JSON.parse(response.responseText);
            this.requestFail(response);
        },

        performRecover: function (e) {
            // prevent submit
            e.preventDefault();
            var recoverSettings = this.settings.recover,
                usernameContent = this.username,
                token = this.token,
                password = this.prepare.getInputValue('newPassword').trim(),
                password_repeat = this.prepare.getInputValue('repeatPassword').trim(),
                username, domain;

            var usernameParts = usernameContent.split('@');

            username = usernameParts[0];
            domain = usernameParts[1];

            if (!domain) {
                this.prepare.showDomainErrorMessage(this.domain);
                return;
            }

            if (password !== password_repeat) {
                this.prepare.prepareErrorMessage(recoverSettings.message.PASS_MISSMATCH);
                this.prepare.shakeBox();
                return;
            }

            if (password.length < 8) {
                this.prepare.prepareErrorMessage(recoverSettings.message.PASS_MIN_LENGHT);
                this.prepare.shakeBox();
                return;
            }

            if (password === username) {
                this.prepare.prepareErrorMessage(recoverSettings.message.PASS_EQUAL_USER);
                this.prepare.shakeBox();
                return;
            }

            if (!username) {
                this.requestFail();
                return;
            }

            if (!/^[a-zA-Z0-9_.-]{4,192}$/.test(username)) {
                this.prepare.prepareErrorMessage(this.settings.recover.INVALID_USER);
                this.prepare.shakeBox();
                return;
            }

            this.prepare.prepareErrorMessage("");
            this.recoverCall(usernameContent, password, token);
        },

        requestFail: function (response) {

            this.prepare.shakeBox();

            var recoverySettings = this.settings.recover,
                msg = recoverySettings.message.INVALID;

            switch (response && response.error) {
                case 1:
                    msg = recoverySettings.message.INVALID_USER;
                    break;

                case 2:
                    msg = recoverySettings.message.INVALID_PASSWORD;
                    break;

                case 3:
                    msg = recoverySettings.message.INVALID_TOKEN;
                    break;

                case 4:
                    msg = response.msg;
                    break;
            }
            this.prepare.prepareErrorMessage(msg);
        },

        recoverCall: function (username, password, token) {
            var recoverySettings = this.settings.recover;

            this.call.post(recoverySettings.url, {
                username: username,
                password: password,
                token: token
            }, this.recoverSuccess.bind(this), this.recoverFail.bind(this));
        },

        init: function (getParams) {
            this.username = getParams['username'];
            this.token = getParams['token'];
            this.prepare.hideLoading();
            this.prepare.showRecoverForm();
            this.prepare.prepareRecoverFormFocus();
            this.prepare.prepareRecoverSubmit(this.performRecover.bind(this));
            this.domain = this.platformSettings.domainFromUrl ? "@" + location.hostname : "@" + this.platformSettings.defaultDomain;
            this.prepare.showDomainMessage(this.domain);
        }
    };

    return Recover;
});
