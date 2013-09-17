var merge = require( 'deepmerge' );

/**
 * This is what Grunt will run automatically when the file is loaded.
 */
module.exports = function ( grunt ) {
  var userConfig, ngbpConfig;

  /**
   * Load in the configuration defined by the user in Gruntfile.js.
   */
  userConfig = grunt.config.get();

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  ngbpConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON( "package.json" ),

    /**
     * The banner is the comment that is placed at the top of our compiled 
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    }
  };

  // Merge ngbp config with user one, giving user config preference
  grunt.initConfig( merge( ngbpConfig, userConfig ) );

  grunt.verbose.subhead( "Loading ngBoilerplate core modules..." );
  grunt.loadTasks( "tasks/core" );

  // TODO: load in all enabled optional modules

  // Set the default task
  grunt.task.registerTask( 'default', [ 'build', 'compile' ] );
};
