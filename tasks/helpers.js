var merge = require( 'deepmerge' );

function updateConfig ( grunt, prop, val ) {
  var existing = grunt.config.getRaw( prop );
  if ( ! existing ) {
    grunt.config.set( prop, val );
  } else {
    grunt.config.set( prop, merge( val, existing ) );
  }
}

function injectTask ( grunt, step, task ) {
  var prop = 'ngbpInjections.' + step;
  var existing = grunt.config.getRaw( prop );

  grunt.verbose.writeln( "Injecting '" + task.task + "' in " + step + " at " + task.priority );

  if ( ! existing ) {
    grunt.config.set( prop, [ task ] );
  } else {
    existing.push( task )
    grunt.config.set( prop, existing );
  }
}

module.exports = {
  merge: merge,
  updateConfig: updateConfig,
  injectTask: injectTask
};

