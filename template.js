/*
 * grunt-init
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a grunt plugin, including Nodeunit unit tests.';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'The grunt plugin system is still under development. For ' +
  'more information, see the docs at https://github.com/gruntjs/grunt/blob/master/docs/plugins.md';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {

  init.process({
    type: 'grunt'
  }, [
    // Prompt for these values.
    init.prompt('name', function (value, props, done) {
      // Prepend grunt- to default name.
      var name = 'grunt-' + value;

      // Replace 'grunt-contrib' with 'grunt' and give a warning
      if (/^grunt-contrib/.test(name)) {
        var message = 'Omitting "contrib" from your project\'s name. The grunt-contrib ' +
          'namespace is reserved for tasks maintained by the grunt team.';

        grunt.log.writelns(message.red);
        name = name.replace(/^grunt-contrib/, 'grunt');
      }

      done(null, name);
    }),
    init.prompt('description', 'The best grunt plugin ever.'),
    init.prompt('version'),
    init.prompt('username', 'jonschlinkert'), // not copied to package.json, only used for this init task.
    init.prompt('author_name'),
    init.prompt('author_url'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses'),
    init.prompt('grunt_version'),
    {
      name: 'travis',
      message: 'Will this project be tested with Travis CI?',
      default: 'Y/n',
      warning: 'If selected, you must enable Travis support for this project in https://travis-ci.org/profile'
    }
  ], function (err, props) {
    // Set a few grunt-plugin-specific properties.
    props.short_name     = props.name.replace(/^grunt[\-_]?/, '').replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
    props.homepage       = 'https://github.com/' + props.username + '/' + props.name;
    props.author_url     = 'https://github.com/' + props.username;
    props.repository     = 'https://github.com/' + props.username + '/' + props.name + '.git';
    props.bugs.url       = 'https://github.com/' + props.username + '/' + props.name + '/issues';
    props.keywords = ['gruntplugin', 'grunt task', 'assemble'];
    props.devDependencies = {
      'grunt-readme': '~0.3.0',
      'grunt-repos': '~0.1.0',
      'grunt-contrib-clean': '~0.5.0',
      'grunt-contrib-jshint': '~0.7.0'
    };

    // Setup travis CI
    props.travis = /y/i.test(props.travis);
    props.travis_node_version = '0.8';

    // Files to copy (and process).
    var files = init.filesToCopy(props);
    if (!props.travis) { delete files['.travis.yml']; }

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};