module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: [
      "tmp",
      "dist/*.css",
      "dist/*.js"
    ],

    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= pkg.version %> */\n"
      },
      dist: {
        files: {
          "dist/application.min.js": ["<%= concat.dist.dest %>"]
        }
      }
    },

    emberTemplates : {
      "default": {
        options: {
          templateBasePath: /app\/templates\//
        },
        files: {
          "tmp/templates.js": ["app/templates/**/*.hbs"]
        }
      }
    },

    concat: {
      options: {
        stripBanners: true
      },

      lib: {
        src: [
          "lib/jquery/jquery.min.js",
          "lib/katex-runtime/index.js",
          "lib/moment/min/moment.min.js",
          "lib/zeroclipboard/dist/ZeroClipboard.min.js",
          "lib/showdown/compressed/showdown.js",
          "lib/rainbow/js/rainbow.min.js",
          "lib/handlebars/handlebars.js",
          "lib/ember/ember.prod.js",
          "lib/ember-data/ember-data.prod.js"
        ],
        dest: "tmp/lib.js"
      },

      application: {
        src: [
          "app/application.js",
          "app/components/*.js",
          "app/helpers.js",
          "app/models/*.js",
          "app/controllers/*.js",
          "app/router.js"
        ],
        dest: "tmp/application.js"
      },

      dist: {
        src: [
          "tmp/lib.js",
          "tmp/application.js",
          "tmp/templates.js"
        ],
        dest: "dist/application.js"
      }
    },

    karma: {
      all: {
        options: {
          basePath: "",
          frameworks: ["qunit"],
          files: [
            "lib/jquery/jquery.js",
            "lib/jquery-mockjax/jquery.mockjax.js",
            "lib/katex-runtime/index.js",
            "lib/moment/moment.js",
            "lib/zeroclipboard/dist/ZeroClipboard.js",
            "lib/showdown/src/showdown.js",
            "lib/rainbow/js/rainbow.js",
            "lib/handlebars/handlebars.js",
            "lib/ember/ember.js",
            "lib/ember-data/ember-data.js",
            "lib/ember-qunit/dist/globals/main.js",
            "app/application.js",
            "app/components/*.js",
            "app/helpers.js",
            "app/models/*.js",
            "app/controllers/*.js",
            "app/router.js",
            "app/templates/*.hbs",
            "app/templates/**/*.hbs",
            "test/helper.js",
            "test/**/*.js"
          ],
          plugins: [
            "karma-qunit",
            "karma-ember-preprocessor",
            "karma-phantomjs-launcher",
            "karma-coverage",
            "karma-osx-reporter"
          ],
          preprocessors: {
            "**/*.hbs": "ember",
            "app/**/*.js": "coverage"
          },
          colors: true,
          browsers: ["PhantomJS"],
          singleRun: grunt.option("single-run"),
          autoWatch: true,
          reporters: ["dots", "coverage", "osx"]
        }
      }
    },

    sass: {
      options: {
        sourcemap: "none",
        update: true,
        lineNumbers: true,
        loadPath: [
          "lib/bourbon/dist"
        ],
        style: "nested"
      },
      dist: {
        files: {
          "dist/application.css": "sass/application.scss"
        }
      }
    },

    cssmin: {
      options: {
        banner: "/*! <%= pkg.name %> <%= pkg.version %> */",
        keepSpecialComments: false
      },
      dist: {
        files: {
          "dist/application.min.css": ["dist/application.css"]
        }
      }
    },

    watch: {
      options: {
        livereload: grunt.option("livereload")
      },

      templates: {
        files: "app/templates/**/*.hbs",
        tasks: ["emberTemplates"]
      },

      application: {
        files: "app/**/*.js",
        tasks: ["concat:application", "concat:dist"]
      },

      sass: {
        files: "sass/**/*.scss",
        tasks: ["sass"]
      }
    }
  });

  grunt.registerTask("build", ["clean", "concat:lib", "concat:application", "emberTemplates", "concat:dist"]);
  grunt.registerTask("default", ["build", "uglify", "sass", "cssmin"]);
};
