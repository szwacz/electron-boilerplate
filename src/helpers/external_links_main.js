import { ipcMain, shell } from "electron";

export default () => {
  ipcMain.on("open-external-link", (event, href) => {
    shell.openExternal(href);
  });
};
