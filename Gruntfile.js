module.exports = function(grunt){
  grunt.initConfig({
    uglify: {
        files: { 
            cwd: '.',
            src: ['fairysupport.js', 'fairysupport_no_bundle.js'],
            dest: '.',
            expand: true,
            ext: '.min.js'
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

}