module.exports = function (grunt) {
	'use strict';
	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	var fs = require('fs');

	// Project configuration
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('hash-replace-files');
	grunt.initConfig({

		// Project settings
		dirs: {
			app: 'src',
			dist: 'build'
		},

		shell: {
			deploy: {
				command: './deploy.sh'
			}
		},

		copy: {
			main: {
				files:[
					{
						src: 'bower_components/eyeos-auth-client/build/eyeosAuthClient.min.js',
						dest: 'src/vendor/eyeosAuthClient.min.js'
					},
					{
						src: 'bower_components/i18next/i18next.min.js',
						dest: 'src/vendor/i18next.min.js'
					}
				]
			}
		},

		requirejs: {
			options: {
				baseUrl: './',
				name: 'src/js/main',
				paths: {
					js: 'src/js',
					operatingSystem : 'bower_components/operating_system/build/operatingSystem',
					urijs: 'bower_components/uri.js/src',
					jquery: 'src/vendor/jquery-2.1.1.min',
					emile: 'src/vendor/emile',
					i18next: 'src/vendor/i18next.min',
					eyeosAuthClient: 'src/vendor/eyeosAuthClient.min'
				},
				shim: {
					emile: {
						exports: "emile"
					},
					eyeosAuthClient: {
						deps: [ 'jquery' ]
					}
				},
				optimizeAllPluginResources: true,

				optimize: 'none',

				wrap: true
			},
			debug: {
				options: {
					out: "<%= dirs.dist %>/main.js"
				}
			},
			release: {
				options: {
					out: "<%= dirs.dist %>/main.js",
					optimize: 'uglify'
				}
			}
		},

		// Test settings
		karma: {
			unit: {
				configFile: 'src/test/karma.conf.js',
				singleRun: true
			}
		},

		watch: {
			scripts: {
				files: ['src/**/*.js', '!src/vendor/**/*.*'],
				tasks: ['build:debug'],
				options: {
					interrupt: true
				}
			}
		},
		connect: {
			server: {
				options: {
					hostname: '0.0.0.0',
					port: 9001,
					base: "./",
					keepalive: false
				}
			}
		},
		hash_replace_files: {
			options: {
				whereToReplace: [
					"<%= dirs.dist %>/index.html",
					"start.sh",
					"<%= dirs.dist %>/browserNotSupported.html",
					"<%= dirs.dist %>/firstTime.html",
					"<%= dirs.dist %>/maintenance.html",
					"<%= dirs.dist %>/mobile.html"
				]
			},
			main: {
				options: {
					files: ["<%= dirs.dist %>/js/main.js"]
				}
			},
			platformSettings: {
				options: {
					files: ["<%= dirs.dist %>/js/platformSettings.js"]
				}
			}
		},
	});

	grunt.registerTask('test', [
		'karma'
	]);

	grunt.registerTask('serve', function () {
		var shelljs = require('shelljs');
		var createSoftLink = "rm -f applogin && ln -s build applogin";
		shelljs.exec(createSoftLink);

		grunt.task.run([
			'connect:server',
			'watch'
		]);
	});

	grunt.registerTask('generateTranslationFiles', 'Generate .json translation files from .po' ,function() {
		var files = fs.readdirSync('locales');
		for(var i=0; i < files.length; i++) {
			var file = files[i];
			var fileData = file.split(".");
			var language = fileData[2];
			var translationFile = "locales/"+file;
			var langData = language.split("_");
			var destFile = "src/translations/"+language+"/translation.json";
			var shelljs = require('shelljs');
			var translationCommand = "i18next-conv -l " + langData[0] + " -s " + translationFile + " -t " + destFile;
			console.log(translationCommand);
			shelljs.exec(translationCommand);
		}
	});


	grunt.registerTask('build', 'Generating build', function (target) {
		grunt.task.run('generateTranslationFiles');
		grunt.task.run('copy');
		if (!target) {
			grunt.task.run(['requirejs:debug', 'requirejs:release', 'shell:deploy']);
		} else {
			grunt.task.run(['requirejs:'+target, 'shell:deploy']); //release or debug
		}
		grunt.task.run('hash_replace_files');
	});

};
