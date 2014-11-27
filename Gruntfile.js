module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    if (!require("fs").existsSync("sauce.json")) {
      console.log("Please create a sauce.json with your credentials.");
    } else {
      process.env.SAUCE_USERNAME = require("./sauce").username;
      process.env.SAUCE_ACCESS_KEY = require("./sauce").accessKey;
    }
  }

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
          "test/**/*.js",
          {
            pattern: "dist/static/*",
            included: false,
            served: true
          }
        ],
        proxies: {
          "/static/": "/base/dist/static/"
        },
        plugins: [
          "karma-qunit",
          "karma-ember-preprocessor",
          "karma-phantomjs-launcher",
          "karma-coverage",
          "karma-osx-reporter",
          "karma-sauce-launcher"
        ],
        preprocessors: {
          "**/*.hbs": "ember",
          "app/**/*.js": "coverage"
        },
        colors: true
      },

      sauce: {
        captureTimeout: 120000,
        browserNoActivityTimeout: 120000,
        sauceLabs: {
          testName: "eqn-ember tests",
          recordScreenshots: false
        },
        customLaunchers: {
          "sl_Safari": {
            base: "SauceLabs",
            browserName: "safari",
            platform: "OS X 10.10"
          },
          "sl_Firefox": {
            base: "SauceLabs",
            browserName: "firefox"
          },
          "sl_Chrome": {
            base: "SauceLabs",
            browserName: "chrome"
          },
          "sl_IE": {
            base: "SauceLabs",
            browserName: "internet explorer"
          }
        },
        browsers: [
          "sl_Safari",
          "sl_Firefox",
          "sl_Chrome",
          "sl_IE"
        ],
        singleRun: true,
        reporters: ["dots", "saucelabs"]
      },

      local: {
        autoWatch: true,
        singleRun: false,
        browsers: ["PhantomJS"],
        reporters: ["dots", "coverage", "osx"]
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
        tasks: ["emberTemplates", "concat:application", "concat:dist"]
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
