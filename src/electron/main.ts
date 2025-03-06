//d f
import { app, BrowserWindow, ipcMain, Tray } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./resourseManager.js";
import path from "path";

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-software-rasterizer");
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

  new Tray(
    path.join(
      getAssetPath(),
      process.platform == "darwin" ? "trayIconTemplate.png" : "trayIcon.png"
    )
  );
});
