var helpers = require( '../../util/helpers.js' );

module.exports = function ( grunt ) {
  var taskName = 'recess';
  grunt.loadNpmTasks('grunt-recess');

  /**
   * The directories to delete when `grunt clean` is executed.
   */
  var config = {
    build: {
      src: [ '<%= app_files.less %>' ],
      dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
      options: {
        compile: true,
        compress: false,
        noUnderscores: false,
        noIDs: false,
        zeroUnits: false
      }
    }
  };

  helpers.updateConfig( grunt, taskName, config );
  helpers.injectTask( grunt, 'build.styles', { task: 'recess:build', priority: 10 } );
};

