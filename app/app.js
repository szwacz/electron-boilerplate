// Here is the starting point for code of your own application.
// All stuff below is just to show you how it works. You can delete all of it.

// Modules which you authored in this project are intended to be
// imported through new ES6 syntax.
import { greet } from './hello_world/hello_world'
console.log(greet())

// Node.js modules and those from npm
// are required the same way as always.
var app = require('electron').remote.app;
var jetpack = require('fs-jetpack').cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log(jetpack.read('package.json', 'json'))

const Vue = require('vue')
// Vue.component('hello-world', require('./components/HelloWorld.vue'))

new Vue({
  el: "#app",
  data: {
    
  },
  components: {
    'hello-world': require('./components/HelloWorld.vue')
  }
})
