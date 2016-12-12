module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'CSS/style.css' : 'SCSS/main.scss'
				}
			}
		},
		uglify: {
	    my_target: {
	      files: {
	        'js/scripts.min.js': ['js/scripts.js']
	      }
	    }
	  },
		postcss: {
	    options: {
	      map: true, // inline sourcemaps
	      processors: [
	        require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
	        require('cssnano')() // minify the result
	      ]
	    },
	    dist: {
	      src: 'CSS/*.css'
	    }
    },
	  connect: {
	    server: {
	      options: {
	        port: 9001,
			livereload: true,
      		base: './',
	      }
	    }
	  },
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass','postcss','uglify']
			}
		}
	});
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('default',['connect','watch']);
}
