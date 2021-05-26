const childProcess = require("child_process");
const readline = require("readline");
const electron = require("electron");
const webpack = require("webpack");
const config = require("./webpack.app.config");

const compiler = webpack(config({ development: true }));
let electronStarted = false;

const clearTerminal = () => {
  if (process.stdout.isTTY) {
    const blankLines = "\n".repeat(process.stdout.rows);
    console.log(blankLines);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
};

const watching = compiler.watch({}, (err, stats) => {
  if (err != null) {
    console.log(err);
  } else if (!electronStarted) {
    electronStarted = true;
    childProcess
      .spawn(electron, ["."], { stdio: "inherit" })
      .on("close", () => {
        watching.close();
      });
  }

  if (stats != null) {
    clearTerminal();
    console.log(stats.toString({ colors: true }));
  }
});
