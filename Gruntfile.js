'use strict';

module.exports = function(grunt) {

    // // Load Grunt tasks declared in the package.json file
    // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-contrib-*', 'grunt-*']});

    // Configure Grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        project: {
            root: '/Users/eschie/Projects/Sites/Eschie.info/Redesign 2014',
            app: 'app',
            assets: '<%= project.app %>/assets',
            config: 'config',
            src: '<%= project.assets %>/src',
            dist: '<%= project.assets %>/dist',
            css: '<%= project.src %>/css/main.css',
            sass: '<%= project.src %>/sass/main.scss',
            js: '<%= project.src %>/js/*.js',
            html: ['views/*.hbs', 'views/**/*.hbs']
        },
        assets: grunt.file.readJSON('config/assets-faf.json'),
        clean: {
            css: ['bower_components/build/*','<%= project.dist %>/css/min/*','<%= project.src %>/css/*'],
            js: ['<%= project.dist %>/js/min/*'],
            svg: ['<%= project.src %>/js/icons.js']
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'app/assets/src/css/main.css': 'app/assets/src/sass/main.scss'
                }
            }
        },
        autoprefixer: {
            single_file: {
                src: '<%= project.css %>',
                dest: '<%= project.css %>'
            }
        },
        //  handlebars: {
        //     compile: {
        //         options: {
        //             namespace: 'App.templates',
        //             processContent: function(content) {
        //                 content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
        //                 content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
        //                 return content;
        //             }
        //         },
        //         files: {
        //             '<%= project.src %>/js/templates/templates.js': ['views/*.hbs','views/**/*.hbs']
        //         }
        //     }
        // },
        watch: {
            js: {
              files: ['<%= project.js %>','./*.js'],
              // tasks: ['jshint'],
              options: {
                livereload: true
              }
            },
            handlebars: {
              files: ['views/*.hbs','views/**/*.hbs'],
              tasks: ['clean:js'],
              options: {
                livereload: true
              }
            },
            sass: {
                files: ['app/assets/src/sass/main.scss', 'app/assets/src/sass/partials/*.scss'],
                tasks: ['clean:css','sass','cssmin']
            },
            css: {
              files: '<%= project.css %>',
              tasks: ['csslint'],
              options: {
                livereload: true
              }
            },
            svg:{
                files: '<%= project.src %>/icons/*.svg',
                tasks: ['clean:svg','svgstore:icons','svginjector:icons'],
                options: {
                    livereload: true
                }
            }
        },
        svgstore: {
            icons: {
                files: {
                '<%= project.dist %>/img/icons/icons.svg': ['<%= project.src %>/icons/*.svg']
                },
                options: {

                /*
                prefix all icons with an unambiguous label
                */
                prefix: 'icon-',

                /* 
                cleans fill, stroke, stroke-width attributes 
                so that we can style them from CSS
                */
                cleanup: true,

                /*
                write a custom function to strip the first part
                of the file that Adobe Illustrator generates 
                when exporting the artboards to SVG
                */
                convertNameToId: function(name) {
                        return name.replace(/^\w+\_/, '');
                    }
                }
            }
        },
        svginjector: {
            icons: {
                files: {
                    '<%= project.dist %>/js/icons.js': ['<%= project.dist %>/img/icons/icons.svg']
                },
                options: {
                    container: 'icon-container'
                }
            }
        },
        csslint: {
          options: {
            csslintrc: '.csslintrc'
          },
          src: '<%= project.css %>'
        },
        jshint: {
            options: {
              jshintrc: true
            },
            files: ['<%= project.src %>/js/*.js','./*.js']
        },
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
              ext: 'js,html,hbs',
              nodeArgs: ['--debug'],
              delay: 1000,
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
        // open: {
        //     all: {
        //         path: 'http://localhost:<%= express.all.options.port%>'
        //     }
        // }
    });

    //Load NPM tasks

    // grunt.loadNpmTasks('grunt-contrib-sass');
    // grunt.loadNpmTasks('grunt-contrib-watch');

    //Default task(s).
    if (process.env.NODE_ENV === 'production') {
      grunt.registerTask('default', 
        [
            'clean',
            'svgstore:icons',
            'svginjector:icons',
            // 'handlebars:compile',
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
            'svgstore:icons',
            'svginjector:icons',
            // 'handlebars:compile',
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