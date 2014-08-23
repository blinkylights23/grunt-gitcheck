/*
 * grunt-gitcheck
 * https://github.com/paul/grunt-gitcheck
 *
 * Copyright (c) 2014 Paul Smith
 * Licensed under the MIT license.
 */

'use strict';


var util = require('util'),
    _ = require('lodash'),
    BranchTool = require('./lib/branchTool'),
    Orchestrator = require('orchestrator'),
    chalk = require('chalk');

module.exports = function(grunt) {

  grunt.registerMultiTask('gitcheck', 'Limit grunt tasks to specific git branches', function() {

    var done = this.async(),
      success = true,
      taskData = this.data,
      taskTarget = this.target,
      args = Array.prototype.slice.call(arguments, 0);

    var options = this.options({
      branchChecking: true,
      enforceUncommittedChanges: true,
      enforceUpdates: true
    });

    var conducta = new Orchestrator();

    var bt,
        doBranchChecking = (options.branchChecking || options.enforceUpdates || options.enforceUncommittedChanges);

    conducta.add('getBranchTool', function(cb) {
      if (doBranchChecking) {
        bt = new BranchTool(cb);
      } else {
        cb();
      }
    });
    conducta.add('branchChecking', ['getBranchTool'], function(cb) {
      if (doBranchChecking) {
        bt.checkBranch(cb, taskData, options);
      } else {
        cb();
      }
    });

    conducta.start(['branchChecking'], function(err) {
      if (err) {
        throw(err);
      } else {
        done(success);
      }
    });

  });

};
