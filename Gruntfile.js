module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    favicons: {
      options: {
        regular: true,
        trueColor: true,
        precomposed: true,
        appleTouchBackgroundColor: "#ffffff",
        coast: true,
        windowsTile: true,
        tileBlackWhite: false,
        tileColor: "auto"
        // html: 'build/out/index.html',
        // HTMLPrefix: "/images/icons/"
      },
      icons: {
        src: 'logo.png',
        dest: 'favicons'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-favicons');

  // Default task(s).
  // grunt.registerTask('favicons', ['grunt-favicons']);
  grunt.registerTask('default', ['uglify']);
};
