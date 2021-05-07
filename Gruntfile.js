module.exports = function(grunt){
  grunt.initConfig({
    uglify: {
        files: { 
            cwd: '.',
            src: ['fairysupport.js'],
            dest: '.',
            expand: true,
            ext: '.min.js'
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

}