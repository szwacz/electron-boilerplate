System.config({
  "baseURL": __dirname + "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ],
    "query": {
      "compact": false
    }
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.4.1",
    "babel": "npm:babel-core@5.6.7",
    "babel-runtime": "npm:babel-runtime@5.6.7",
    "core-js": "npm:core-js@0.9.18",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.6.7": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});

