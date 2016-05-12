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


'use strict';
define([
	"js/redirector",
	"eyeRunRequestor"
], function (Redirector, EyeRunRequestor) {
	suite('redirector.test suite', function () {
		var sut;
		var location, locationReplaceStub, settings;
		var appGateway, appGatewayOpenAppStub, appGatewayIsChromeInstalledStub, eyeRunInstalledStub;
		var os;
		var tid;
		var platformSettings;

		setup(function () {
			tid = '550e8400-e29b-41d4-a716-446655440000';
			os = 'macosx';
			settings = {
				ENHANCED_MODE_AVAILABLE: false,
				ENHANCED_MODE_AVAILABLE_OS: [os],
				desktop: {
					url: 'myDesktop'
				}
			};
			location = {
				href: 'http://myTestEnvironment.com',
				search: '',
				replace: function() {}
			};
			locationReplaceStub = sinon.stub(location, 'replace');

			var OperatingSystem = {
				getName: function() {return os}
			};

			platformSettings = {
				cleanUrlParameters: false
			};

			var eyeRunRequestor = new EyeRunRequestor();
			eyeRunInstalledStub = sinon.stub(eyeRunRequestor, 'eyeRunInstalled');
			appGateway = eyeRunRequestor.appGateway();
			appGatewayOpenAppStub = sinon.stub(appGateway, 'openApp');
			appGatewayIsChromeInstalledStub = sinon.stub(appGateway, 'isChromeInstalled');
			sinon.stub(eyeRunRequestor, 'appGateway').returns(appGateway);

			sut = new Redirector(settings, eyeRunRequestor, location, OperatingSystem, null, platformSettings);
		});


		suite('#goToLoginTarget', function () {
			
			suite('when should not apply enhancedMode', function(){

				function exercise() {
					sut.goToLoginTarget(tid);
				}

				test('should redirect to correct url', sinon.test(function () {
					var url = '/?TID=' + tid;
					exercise();
					assert(locationReplaceStub.calledWithExactly(url));
				}));
				
				test('and when url already has a query should redirect to correct url', sinon.test(function(){
					location.search = '?theme=gene&target=whatever';
					var url = 'whatever?theme=gene&TID=' + tid;
					exercise();
					assert(locationReplaceStub.calledWithExactly(url));
				}));

				test('and when url already has a TID should replace it for the new TID', sinon.test(function(){
					location.search = '?TID=OLDTID/';
					var url = '/?TID=' + tid;
					exercise();
					assert(locationReplaceStub.calledWithExactly(url));
				}));

				test('should remove parameters when specified', sinon.test(function(){
					var url = '/';
					platformSettings.cleanUrlParameters = true;
					exercise();
					assert(locationReplaceStub.calledWithExactly(url));
				}));
			});

			suite('when should apply enhancedMode', function() {
				setup(function () {
					settings.ENHANCED_MODE_AVAILABLE = true;
				});
				function exercise () {
					sut.goToLoginTarget(tid);
				}
				suite('when eyerun is installed', function(){
					setup(function () {
						eyeRunInstalledStub.callsArgWith(0, true);
					});
					function makeChromeInstalled(installed) {
						appGatewayIsChromeInstalledStub.callsArgWith(0, installed);
					}

					test.skip('and chrome installed should call appGateway openApp', sinon.test(function(){
						makeChromeInstalled(true);
						exercise();
						var url = 'myDesktop?TID='+tid;
						assert(appGatewayOpenAppStub.calledWithExactly(url));
					}));

					test('and chrome not installed should redirect to correct url', sinon.test(function(){
						makeChromeInstalled(false);
						location.search = '?theme=gene&target=whatever';
						exercise();
						var url = 'whatever?theme=gene&TID=' + tid;
						assert(locationReplaceStub.calledWithExactly(url));
					}));
				});

				suite('when eyeRun is not installed', function(){
					setup(function () {
						eyeRunInstalledStub.callsArgWith(0, false);
					});
					test('should redirect to correct url', sinon.test(function(){
						location.search = '?theme=gene&target=whatever';
						exercise();
						var url = 'whatever?theme=gene&TID=' + tid;
						assert(locationReplaceStub.calledWithExactly(url));
					}));
				});


			});

		});

	});

});
