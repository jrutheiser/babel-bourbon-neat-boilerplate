'use strict';

module.exports = function(grunt) {

  var sitePaths = {
    fonts: 'fonts',
    images: 'images',
    scripts: 'scripts',
    styles: 'styles',
    templates: 'templates'
  };

  var bannerText = [
    '/**',
    ' * Automatically Generated - Do Not Edit',
    ' * <%= pkg.name %> / v<%= pkg.version %> / <%= grunt.template.today("yyyy-mm-dd") %>',
    ' */'
  ].join('\n');

  var sassIncludePaths = [].concat(
    require('bourbon').includePaths,
    require('bourbon-neat').includePaths
  );

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sitePaths: sitePaths,

    eslint: {
      target: ['src/assets/<%= sitePaths.scripts %>/**/*.js']
    },

    watch: {
      fonts: {
        files: 'src/assets/<%= sitePaths.fonts %>/**/*.{eot,svg,ttf,woff}',
        tasks: [
          'copy:dist'
        ]
      },
      images: {
        files: 'src/assets/<%= sitePaths.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
        tasks: [
          'copy:dist'
        ]
      },
      scripts: {
        files: 'src/assets/<%= sitePaths.scripts %>/**/*.js',
        tasks: [
          'eslint',
          'browserify:dist',
          'uglify:dist'
        ]
      },
      styles: {
        files: 'src/assets/<%= sitePaths.styles %>/**/*.scss',
        tasks: [
          'sass:dist',
          'usebanner:dist'
        ]
      },
      templates: {
        files: 'src/assets/<%= sitePaths.templates %>/**/*.hbs',
        tasks: [
          'assemble'
        ]
      }
    },

    browserify: {
      options: {
        transform: [['babelify', { presets: ['es2015']}]],
      },
      dist: {
        src: ['src/assets/<%= sitePaths.scripts %>/index.js'],
        dest: 'dist/assets/<%= sitePaths.scripts %>/bundle.js'
      }
    },

    uglify: {
      dist: {
        options : {
          banner: bannerText,
          sourceMap: true
        },
        files: [{
          src: ['dist/assets/<%= sitePaths.scripts %>/bundle.js'],
          dest: 'dist/assets/<%= sitePaths.scripts %>/bundle.min.js'
        }]
      }
    },

    sass: {
      options: {
        includePaths: sassIncludePaths,
        outputStyle: 'compressed',
        sourceMap: true
      },
      dist: {
        files: [{
          src: ['src/assets/<%= sitePaths.styles %>/main.scss'],
          dest: 'dist/assets/<%= sitePaths.styles %>/main.css'
        }]
      }
    },

    usebanner: {
      dist: {
        options: {
          banner: bannerText
        },
        files: {
          src: ['dist/assets/<%= sitePaths.styles %>/main.css']
        }
      }
    },

    assemble: {
      options: {
        assets: 'dist/assets',
        layoutdir: 'src/<%= sitePaths.templates %>/layouts',
        partials: ['src/<%= sitePaths.templates %>/components/**/*.hbs'],
        flatten: true
      },
      dist: {
        options: {
          layout: 'default.hbs'
        },
        src: ['src/<%= sitePaths.templates %>/*.hbs'],
        dest: 'dist/'
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/assets/',
          src: ['**', '!**/*.js', '!**/*.scss'],
          dest: 'dist/assets/',
          filter: 'isFile'
        }]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/assets/<%= sitePaths.styles %>',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: './'
        }]
      }
    },

    clean: {
      dist: ['dist']
    }
  });

  Object.keys(grunt.file.readJSON('package.json').devDependencies)
    .filter(function(npmTaskName) {
      return npmTaskName.indexOf('grunt-') === 0;
    })
    .filter(function(npmTaskName) {
      return npmTaskName !== 'grunt-cli';
    })
    .forEach(function(npmTaskName) {
      grunt.loadNpmTasks(npmTaskName);
    });

  grunt.registerTask('test', [
    'eslint'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'browserify:dist',
    'uglify:dist',
    'sass:dist',
    'assemble:dist',
    'copy:dist',
    'usebanner:dist'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
