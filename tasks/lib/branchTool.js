'use strict';



var exec = require('child_process').exec,
    Orchestrator = require('orchestrator');


var BranchTool = function(callback) {

  var conducta = new Orchestrator();

  conducta.add('getBranch', function(cb) { this.getCurrentBranch(cb) }.bind(this));
  conducta.add('updateOrigin', function(cb) { this.updateOrigin(cb) }.bind(this));
  conducta.add('getIsAhead', ['getBranch', 'updateOrigin'], function(cb) { this.getIsAhead(cb) }.bind(this));
  conducta.add('getIsBehind', ['getBranch', 'updateOrigin'], function(cb) { this.getIsBehind(cb) }.bind(this));
  conducta.add('getUncommitted', ['getBranch', 'updateOrigin'], function(cb) { this.getUncommitted(cb) }.bind(this));

  conducta.start(['getIsAhead', 'getIsBehind', 'getUncommitted'], function(err) {
    if (err) {
      throw(err);
    } else {
      callback();
    }
  });

};

BranchTool.prototype.getCurrentBranch = function(callback) {
  exec('git rev-parse --abbrev-ref HEAD', function(error, stdout, stderr) {
    if (error !== null) {
      callback('exec error: ' + error);
    } else {
      this.currentBranch = stdout.replace(/[\n\r]/g, '');
      callback();
    }
  }.bind(this));
};

BranchTool.prototype.updateOrigin = function(callback) {
  exec('git remote update', function(error, stdout, stderr) {
    if (error !== null) {
      callback('exec error: ' + error);
    } else {
      callback();
    }
  }.bind(this));
};

BranchTool.prototype.getIsAhead = function(callback) {
  exec('git rev-list origin/' + this.currentBranch + '..HEAD', function(error, stdout, stderr) {
    if (error !== null) {
      callback('exec error: ' + error);
    } else {
      var resp = stdout;
      if (resp) {
        this.isAhead = resp.match(/[\n\r]/g).length;
      }
      callback();
    }
  }.bind(this));
};

BranchTool.prototype.getIsBehind = function(callback) {
  exec('git rev-list HEAD..origin/' + this.currentBranch, function(error, stdout, stderr) {
    if (error !== null) {
      callback('exec error: ' + error);
    } else {
      var resp = stdout;
      if (resp) {
        this.isBehind = resp.match(/[\n\r]/g).length;
      }
      callback();
    }
  }.bind(this));
};

BranchTool.prototype.getUncommitted = function(callback) {
  exec('git diff-index HEAD --stat', function(error, stdout, stderr) {
    if (error !== null) {
      callback('exec error: ' + error);
    } else {
      var resp = stdout;
      if (resp) {
        this.uncommittedChanges = resp;
      }
      callback();
    }
  }.bind(this));
};

BranchTool.prototype.checkBranch = function(callback, data, options) {

  var error = '';

  if (options.enforceUncommittedChanges && this.uncommittedChanges) {
    error += 'You have uncommitted local changes to ' + this.currentBranch + ':\n\n' + this.uncommittedChanges;
  }
  if (options.enforceUpdates && this.isBehind) {
    error += 'Your local ' + this.currentBranch + ' is behind origin/' + this.currentBranch +
    ' by ' + this.isBehind + ' revisions. You should get synced up before you deploy.';
  }
  if (options.enforceUpdates && this.isAhead) {
    error += 'Your local ' + this.currentBranch + ' is ahead of origin/' + this.currentBranch +
    ' by ' + this.isAhead + ' revisions. You should get synced up before you deploy.';
  }
  if (options.branchChecking && data.hasOwnProperty('branches')) {
    if (data.branches.indexOf(this.currentBranch) === -1) {
      error += 'Error: "' + this.currentBranch + '" is not an allowed branch for this deployment target.'
    }
  }

  callback(error);
};

module.exports = BranchTool;
