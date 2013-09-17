var merge = require( 'deepmerge' );

module.exports = function ( grunt ) {
  // Register the task
  grunt.task.registerTask( 'build', 'Create a development build', function () {
    var tasks;
    var userInjections = grunt.config.get( 'injections' );
    var taskInjections = grunt.config.get( 'ngbpInjections' );
    var injections = merge( taskInjections, userInjections );
    
    var buildSteps = [ 'pre', 'assets', 'scripts', 'styles', 'vendor', 'post' ];

    function sortTasks ( a, b ) {
      return a.priority - b.priority;
    }

    buildSteps.forEach( function ( stepName ) {
      grunt.verbose.write( "Queuing build:" + stepName + " - " );

      tasks = injections.build[ stepName ];
      if ( tasks ) {
        tasks.sort( sortTasks );

        tasks.forEach( function ( task ) {
          grunt.verbose.write( task.task + " " );
          grunt.task.run( task.task );
        });
      } else {
        grunt.verbose.write( "n/a" );
      }

      grunt.verbose.writeln();
    });
  });
};

