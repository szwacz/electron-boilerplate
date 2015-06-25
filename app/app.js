// -----------------------------------------------------
// Here is the starting point for your own code.
// All stuff below is just to show you how it works.
// -----------------------------------------------------

// Browser modules are imported through new ES6 syntax.
import angular  from "angular";

// Own modules
import AppController from 'controllers/AppController';

var app = angular.module('repairManagerApp', []);

app.controller('AppController', AppController);

app.init = function () {
    angular.bootstrap(document, ['repairManagerApp']);
    console.log("app initialized!");
};

module.exports = app;
