# RequireJS Dynamic Shimming Plugin

Plugin for [RequireJS](http://requirejs.org) that allows the open-minded module author to "shim" non-AMD scripts **at define time**, rather than in the `shim` configuration option. Works with the optimizer, and better than the shim config does, at that. No disrespect intended to @jrburke of course.

## Overview

You have chosen to use AMDs and RequireJS in your project. Congratulations. You have chosen the path of righteousness. Still, we live in a fallen world, and if you're building a project of sufficient size, you may encounter [useful](http://handlebarsjs.com/) [tools](http://underscorejs.org/) [that](http://twitter.github.com/bootstrap/) [remain](http://davisjs.com/) [unenlightened](http://backbonejs.org). You want to use them in your project, maybe even inline them in your build, but you'd like to avoid modifying these libraries' source or depending on AMD forks which may not be up to date. The shim plugin can help you specify a complex dependency in a single, concise string that will correctly inject your dependency, and write a modularized version of the noncompliant script into your r.js-optimized build.

The [shim config](http://requirejs.org/docs/api.html#config-shim) is the official RequireJS feature for non-AMD scripts. To use a noncompliant script like Backbone, you would have to configure your Require instance like this:

```javascript
requirejs.config({
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
    }
})
```

The above config would enable you to require Backbone in your scripts like so:

```javascript
require(['backbone'], function(Backbone){
    // Backbone available within callback.
})
```

There are three drawbacks to this approach. In ascending order of seriousness, they are:

-   It's wordy, which adds file weight

-   It requires maintenance of a separate file, the config, with a dependency dictionary in it

-   It does not play nice with the optimizer. As the Require docs put it: 
    >*"if you use an AMD module as a dependency for a shim config module, after a build, that AMD module may not be evaluated until after the shimmed code in the build executes, and an error will occur. The ultimate fix is to upgrade all the shimmed code to have optional AMD define() calls."*




The shim plugin addresses these concerns:
 
-   It has a concise syntax

-   It allows a description of the dependency *in the place where it is required*, making code more modular

-   When invoked via r.js, it writes an "upgraded" version of the non-AMD module into an optimized build.

The shim plugin allows you to declare dependencies, specify exports, and name the arguments of nested dependencies.

 
## Usage

The shim plugin equivalent of the above Backbone shim is:

```javascript
require(['shim!backbone[underscore,jquery]>Backbone'], function(Backbone) {
    // Backbone available within callback.
});
```

The angle bracket is the equivalent of the `exports` property of shim config. It tells the plugin that the `Backbone` variable of the shimmed script must be returned to the `define()` call, so it can be received as the first argument to the callback function. 

Square Brackets enclose dependency descriptions. Optionally, you can name the argument that your shimmed script will receive in its AMD wrapper. It's not usually necessary for scripts that set globals, as Backbone and Underscore do, but it allows you to uglify top-level symbols and still maintain your references:

```javascript
require(['shim!backbone[shim!underscore>_=_, jquery=jQuery]>Backbone'], function(Backbone){
    // Backbone available even with all top-level symbols obfuscated.
})
```

Note that the shimmed Backbone is declaring a *shimmed Underscore* as a dependency. You can nest calls to the shim plugin arbitrarily deep. Shimming is not necessary with jQuery, since jQuery already includes an AMD `define()` call. We merely need to name it jQuery, since that's what Backbone expects it to be called. This will result in the dynamic creation (or, in the case of the optimizer, the permanent creation) of the following:

```javascript
// underscore first
define('underscore', [], function() {
    // vendored Underscore code here
    return _;
})

// then backbone
define('backbone', ['underscore','jquery'], function(_, jQuery){
    // vendored Backbone code here
    return Backbone;
})
```

And all from a single string that only looks a little wacky.

## Installation

### **Note**: The shim plugin has a hard dependency on the RequireJS text plugin. That plugin must be already installed in the manner described below.

Download src/shim.js and put it in your RequireJS project's baseURL or appDir (alternately, write a paths config that points to it, like `paths: { shim: 'lib/shim.js'}`.)
