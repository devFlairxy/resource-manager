//d f
import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./resourseManager.js";
import path from "path";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-software-rasterizer");

// Menu.setApplicationMenu(null);
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    // disables default system frame (dont do this if you want a proper working menu bar)
    frame: false,
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResources(mainWindow);
  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });

  //darwin => macos

  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}