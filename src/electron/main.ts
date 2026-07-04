import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from "electron";
import path from "path";
import { __rootdir, getPreloadPath, isDev } from "./util.js";
import { WindowName } from "types";
import Console from "./logger.js";

const windows = {
  main: null as BrowserWindow | null,
  settings: null as BrowserWindow | null,
};

const isValidWindow = (name: string): name is WindowName => {
  return name in windows;
};

const windowIpcReady = new Map();

const createBrowserWindow = async (
  options: BrowserWindowConstructorOptions,
  paths: { url: string; file: string; },
  onReady?: (window: BrowserWindow) => void,
  onClose?: (window: BrowserWindow) => void
): Promise<BrowserWindow> => {
  const window = new BrowserWindow({
    ...options,
    resizable: false,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#010710",
    show: false, // Don't show until ready
    // icon: path.join(baseDir, "leaguer", "logo.png"),
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.setMenuBarVisibility(false);
  window.removeMenu();

  const id = crypto.randomUUID();
  windowIpcReady.set(id, false);

  if (isDev()) {
    const url = `${paths.url}?id=${id}`;
    window.loadURL(url);
  } else {
    const file = `${paths.file}?id=${id}`;
    window.loadFile(file);
  }

  // IPC handlers for window controls
  ipcMain.on("window:minimize", () => window.minimize());
  ipcMain.on("window:close", () => window.close());

  //@todo add ready event firing in react
  ipcMain.once(`window:ready?${id}`, (_) => {
    windowIpcReady.set(id, true);
    window.show();
    if (typeof onReady === "function") onReady(window);
  });

  window.on("close", () => {    
    if (typeof onClose === "function") onClose(window);
  });

  return window;
}

// Window opener functions
const openMainWindow = async (): Promise<void> => {
  if (windows.main && !windows.main.isDestroyed()) {
    windows.main.show();
    windows.main.focus();
    return;
  }

  windows.main = await createBrowserWindow(
    {
      width: 400,
      height: 500,
    },
    {
      url: "http://localhost:1111",
      file: path.join(__rootdir, "dist/react/index.html") //? idk if this will work in prod
    },
    (window) => {
      console.log("Main window opened!");
      window.webContents.openDevTools({ mode: "detach" });
    },
    () => {
      windows.main = null;
      console.log("Main window closed!");
    }
  );
}

app.whenReady().then(async () => {
  Console.dev("App ready!");
  await openMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// macOS: Re-create window when dock icon is clicked
app.on("activate", () => openMainWindow());