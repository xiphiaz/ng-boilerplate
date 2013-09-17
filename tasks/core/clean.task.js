var helpers = require( '../helpers.js' );

module.exports = function ( grunt ) {
  var taskName = 'clean';
  grunt.loadNpmTasks('grunt-contrib-clean');

  /**
   * The directories to delete when `grunt clean` is executed.
   */
  var config = {
    build: [
      '<%= build_dir %>', 
      '<%= compile_dir %>'
    ]
  };

  helpers.updateConfig( grunt, taskName, config );
  helpers.injectTask( grunt, 'build.pre', { task: taskName, priority: 10 } );
};

