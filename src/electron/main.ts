import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getPreloadPath, isDev } from "./util.js";

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#010710",
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  // IPC handlers for window controls
  ipcMain.on("window:minimize", () => mainWindow.minimize());
  ipcMain.on("window:close", () => mainWindow.close());

  // Load the UI
  if (isDev()) {
    mainWindow.loadURL("http://localhost:1111");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist/react/index.html"));
  }

  return mainWindow;
}

app.whenReady().then(async () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});