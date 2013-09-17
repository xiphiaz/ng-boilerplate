function enable ( grunt, mod ) {
  var devDeps, pkg, inventory, modules;

  if ( ! mod ) {
    grunt.fail.warn( "You must specify a module name." );
    return;
  }

  // load in the package.json and the ngbp module inventory
  pkg = grunt.file.readJSON( 'package.json' );
  inventory = grunt.file.readJSON( 'tasks/modules/inventory.json' );

  // ensure the devDependencies object exists
  if ( ! pkg.devDependencies ) {
    pkg.devDependencies = {};
  }

  // ensure the ngbpModules array exists
  if ( ! pkg.ngbpModules ) {
    pkg.ngbpModules = [];
  }

  devDeps = pkg.devDependencies;
  modules = pkg.ngbpModules;

  if ( ! inventory[ mod ] ) {
    grunt.fail.warn( "Unknown ngbp module: " + mod );
  }

  // enable the module
  if ( modules.indexOf( mod ) < 0 ) {
    grunt.verbose.writeln( "Enabling " + mod );
    modules.push( mod );
  }

  // add its dependencies
  for ( dep in inventory[ mod ] ) {
    devDeps[ dep ] = inventory[ mod ][ dep ];
  }

  // save the package.json
  grunt.file.write( 'package.json', JSON.stringify( pkg, undefined, 2 ) );

  // run npm install
  grunt.log.subhead( "Installing dependencies..." );
  grunt.util.spawn({
    cmd: 'npm',
    args: [ 'install' ]
  }, this.async() );
}

function disable ( grunt, mod ) {
  var devDeps, pkg, inventory, modules, deps;
  var stillRequired = removedDeps = [];

  if ( ! mod ) {
    grunt.fail.warn( "You must specify a module name." );
    return;
  }

  // load in the package.json and the ngbp module inventory
  pkg = grunt.file.readJSON( 'package.json' );
  inventory = grunt.file.readJSON( 'tasks/modules/inventory.json' );

  // ensure the devDependencies object exists
  if ( ! pkg.devDependencies ) {
    pkg.devDependencies = {};
  }

  // ensure the ngbpModules array exists
  if ( ! pkg.ngbpModules ) {
    pkg.ngbpModules = [];
  }

  devDeps = pkg.devDependencies;
  modules = pkg.ngbpModules;

  if ( ! inventory[ mod ] ) {
    grunt.fail.warn( "Unknown ngbp module: " + mod );
  }

  deps = pkg.devDependencies[ mod ];

  // ensure the component is enabled
  if ( modules.indexOf( mod ) < 0 ) {
    grunt.fail.warn( "'" + mod + "' is not enabled, so there's nothing to do." );
  }

  // remove the module
  modules.splice( modules.indexOf( mod ) );

  // get a list of dependencies used by other modules
  for ( m in modules ) {
    for ( dep in inventory[ m ] ) {
      stillRequired.push( dep );
    }
  }

  // remove the dependencies, if they're not required by any other enabled
  // modules
  //
  // FIXME manually-added modules shouldn't be removed either; how can we ask
  // the user to specify them? should we wrap `npm install` so we can keep
  // track of them?
  for ( dep in inventory[ mod ] ) {
    if ( stillRequired.indexOf ( dep ) < 0 ) {
      grunt.verbose.writeln( "Removing '" + dep + "'..." );
      delete devDeps[ dep ];
      removedDeps.push( dep );
    } else {
      grunt.verbose.writeln( "Not removing '" + dep + "' as it is required by another component." );
    }
  }

  // save the package.json
  grunt.file.write( 'package.json', JSON.stringify( pkg, undefined, 2 ) );

  // TODO remove the packages from NPM
  grunt.log.subhead( "Uninstalling dependencies..." );
  grunt.util.spawn({
    cmd: 'npm',
    args: [ 'uninstall' ].concat( removedDeps )
  }, this.async() );
}

function init ( grunt ) {
  grunt.task.run( "ngbp:enable:core" );
}

module.exports = function ( grunt ) {
  grunt.registerTask( 'ngbp', function ( cmd, arg2 ) {
    switch ( cmd ) {
      case 'init':
        init.call( this, grunt );
        break;
      case 'enable':
        enable.call( this, grunt, arg2 );
        break;
      case 'disable':
        disable.call( this, grunt, arg2 );
        break;
      default:
        grunt.fail.fatal( "Unknown ngbp command: " + cmd );
        break;
    }
  });
};

