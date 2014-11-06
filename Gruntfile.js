'use strict';

module.exports = function(grunt) {

    // // Load Grunt tasks declared in the package.json file
    // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // require('load-grunt-tasks')(grunt);
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-contrib-*', 'grunt-*']});

    // Configure Grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        project: {
            root: '/Users/eschie/Projects/Sites/Eschie.info/Redesign 2014',
            app: 'app',
            assets: '<%= project.app %>/assets',
            config: '<%= project.app %>/config',
            src: '<%= project.assets %>/src',
            dist: '<%= project.assets %>/dist',
            css: '<%= project.src %>/css/main.css',
            sass: '<%= project.src %>/sass/main.scss',
            js: '<%= project.src %>/js/*.js',
            html: ['views/*.hbs', 'views/**/*.hbs']
        },
        assets: grunt.file.readJSON('app/config/assets-faf.json'),
        clean: ['bower_components/build/*','<%= project.dist %>/css/min/*', '<%= project.dist %>/js/min/*'],
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    '<%= project.css %>' : [ '<%= project.scss %>', '<%= project.src %>/sass/**/*.scss' ]
                }
            }
        },
        autoprefixer: {
            single_file: {
                src: '<%= project.css %>',
                dest: '<%= project.css %>'
            }
        },
        // express: {
        //     all: {
        //         options: {
        //             port: 8000,
        //             hostname: '0.0.0.0',
        //             bases: ['<%= project.root %>'],
        //             livereload: true
        //         }
        //     }
        // },
        watch: {
            js: {
              files: '<%= project.js %>',
              // tasks: ['jshint'],
              options: {
                livereload: true
              }
            },
            handlebars: {
              files: '<%= project.html %>',
              options: {
                livereload: true,
                interval: 500
              }
            },
            sass: {
                files: '<%= project.sass %>',
                tasks: ['sass']
            },
            css: {
              files: '<%= project.css %>',
              tasks: ['csslint'],
              options: {
                livereload: true
              }
            },
        },
        csslint: {
          options: {
            csslintrc: '.csslintrc'
          },
          src: '<%= project.css %>'
        },
        // jshint: {
        //   all: {
        //     src: paths.js,
        //     options: {
        //       jshintrc: true
        //     }
        //   }
        // },
        // compass: {                  // Task
        //     dist: {                   // Target
        //       options: {              // Target options
        //         sassDir: '<%= project.src %>/sass',
        //         cssDir: '<%= project.src %>/css',
        //         environment: 'production'
        //       }
        //     }
        // },
        concat: {
            options: {
                separator: ';'
            },
            production: {
                files: [
                    // '<%= assets.main.vendorCss %>',
                    '<%= assets.main.vendorJs %>',
                ]
            }
        },
        cssmin: {
          production: {
            files: {
                '<%= assets.main.publicCss.dest %>' : '<%= assets.main.publicCss.src %>'
            }
          }
        },
        uglify: {
            options: {
              mangle: false
            },
            files: ['<%= assets.main.publicJs %>']
        },
        nodemon: {
          dev: {
            script: 'server.js',
            options: {
              args: [],
              ignore: ['node_modules/**'],
              ext: 'js,html',
              nodeArgs: ['--debug'],
              delayTime: 1,
              cwd: '<%= project.root %>'
            }
          }
        },
        concurrent: {
          tasks: ['nodemon', 'watch'],
          options: {
            logConcurrentOutput: true
          }
        },
        // grunt-open will open your browser at the project's URL
        open: {
            all: {
                path: 'http://localhost:<%= express.all.options.port%>'
            }
        }
    });

    //Load NPM tasks

    // grunt.loadNpmTasks('grunt-contrib-sass');
    // grunt.loadNpmTasks('grunt-contrib-watch');

    //Default task(s).
    if (process.env.NODE_ENV === 'production') {
      grunt.registerTask('default', 
        [
            'clean', 
            'sass', 
            'autoprefixer',
            'cssmin', 
            'uglify', 
            'concurrent'
        ]);
    } else {
      grunt.registerTask('default', 
        [
            'clean', 
            'sass', 
            'autoprefixer',
            'csslint', 
            'cssmin',
            'concurrent'
        ]);
    }

    grunt.registerTask('production', [
        'concat:production',
        'cssmin:production',
        'uglify:production'
    ]);

    // Creates the `server` task
    // grunt.registerTask('server', [
    //     'express',
    //     'open',
    //     'watch'
    // ]);
};