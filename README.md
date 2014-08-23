# grunt-gitcheck

Ever accidentally run a grunt deployment task, forgetting that you're actually in a half-working
feature branch? Had a colleague ask for help, only to discovery (much later) that they deployed
to staging with uncommitted local changes?

This plugin runs a few quick sanity checks to help avoid these problems. It will:

 * Allow you to configure a grunt task that will cause grunt to quit if a configured set of checks don't pass
 * Optionally check for uncommitted changes
 * Optionally check to ensure there are no local revisions that need to be pushed to the remote
 * Optionally check that your local repo is not behind the remote (revs you need to pull)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gitcheck --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gitcheck');
```

## The "gitcheck" task

### Overview
In your project's Gruntfile, add a section named `gitcheck` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gitcheck: {
    options: {
      branchChecking: true,
      enforceUncommittedChanges: true,
      enforceUpdates: true
    },
    production: {
      branches: ['production'] 
    },
    staging: {
      options: {
        branchChecking: false
      }
    }
    },
    'v0.2.0': {
      branches: ['nextrelease', 'newfeature']
    }
  }
});
```

### Options

#### options.branchChecking
Type: `Boolean`
Default value: `true`

With `options.branchChecking` set to `true`, the task will look for a configured array of allowed
branches (see `branches` below), and throw an error if you're not currently working in one of the
branches listed.

#### options.enforceUncommittedChanges
Type: `Boolean`
Default value: `true`

With this option set to `true`, the task will check to see if you have any local changes that haven't
been committed, and throws an error if you do.

#### options.enforceUpdates
Type: `Boolean`
Default value: `true`

This causes the task to check against the origin to see if your local repo is ahead (you have local
revs that have not been pushed) or behind (there are revs at the origin you have not pulled).


### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  gitcheck: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  gitcheck: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
