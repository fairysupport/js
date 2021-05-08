module.exports = function(grunt){
  grunt.initConfig({
    uglify: {
        files: { 
            cwd: 'bin',
            src: ['fairysupport.js'],
            dest: 'bin',
            expand: true,
            ext: '.min.js'
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

}