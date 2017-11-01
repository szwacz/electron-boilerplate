const childProcess = require("child_process");
const electron = require("electron");
const webpack = require("webpack");
const config = require("./webpack.app.config");

const env = "development";
const compiler = webpack(config(env));
let electronStarted = false;

const watching = compiler.watch({}, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  console.log(
    stats.toString({
      colors: true,
      hash: false,
      version: false,
      timings: false
    })
  );

  if (!stats.hasErrors() && !electronStarted) {
    electronStarted = true;

    childProcess
      .spawn(electron, ["."], { stdio: "inherit" })
      .on("close", () => {
        watching.close();
      });
  }
});
