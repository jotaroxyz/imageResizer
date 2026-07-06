import { app, BrowserWindow, BrowserWindowConstructorOptions, dialog, ipcMain } from "electron";
import path from "path";
import fs from 'fs/promises';
import sharp from "sharp";
import { __rootdir,  getPreloadPath, isDev } from "./util.js";
import Console from "./logger.js";
import { ImageInterface } from "./types.js";

let image: ImageInterface | null = null;

const windows = {
  main: null as BrowserWindow | null,
  file: null as BrowserWindow | null,
};

const windowIpcReady = new Map<string, boolean>();

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

  // IPC handlers
  ipcMain.on(`window:minimize?${id}`, () => window.minimize());
  ipcMain.on(`window:close?${id}`, () => window.close());

  ipcMain.once(`window:ready?${id}`, (_) => {
    windowIpcReady.set(id, true);
    window.show();
    if (typeof onReady === "function") onReady(window);
  });

  window.on("close", () => {
    windowIpcReady.delete(id);
    window.removeAllListeners();
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
      height: 450,
    },
    {
      url: "http://localhost:1111/home",
      file: path.join(__rootdir, "dist/react/index.html/home") //? idk if this will work in prod
    },
    (window) => {
      Console.dev("Main window opened!");
      window.webContents.openDevTools({ mode: "detach" });
    },
    () => {
      windows.main = null;
      Console.dev("Main window closed!");
    }
  );
};

const openFileWindow = async (): Promise<void> => {
  if (windows.file && !windows.file.isDestroyed()) {
    windows.file.show();
    windows.file.focus();
    return;
  }

  windows.file = await createBrowserWindow(
    {
      width: 700,
      height: 500,
    },
    {
      url: "http://localhost:1111/file",
      file: path.join(__rootdir, "dist/react/index.html/file") //? idk if this will work in prod
    },
    async (window) => {
      Console.dev("File window opened!");
      window.webContents.openDevTools({ mode: "detach" });

      if (image) window.webContents.send("react:send-image", image);
    },
    () => {
      windows.file = null;
      Console.dev("File window closed!");
    }
  );
};

// App handlers
ipcMain.handle("app:reload", async () => {
  // Close windows
  if (windows.file && !windows.file.isDestroyed()) windows.file.close();
  if (windows.main && !windows.main.isDestroyed()) windows.main.close();

  // Cleanup variables
  image = null;

  // Open main window
  await openMainWindow();
});

ipcMain.handle("app:send-image", async (_, payload: ImageInterface) => {
  Console.dev("[app:send-image] got call");

  //@todo server-side type check?

  image = payload;

  if (windows.main) windows.main.close();

  await openFileWindow();
});

interface ResizePayload {
  height: number;
  width: number;
}

ipcMain.handle("app:resize-image", async (_, { height, width }: ResizePayload) => {
  if (!image || !windows.file) return;

  const ext = path.extname(image.path);
  const baseName = path.basename(image.path, ext);
  const defaultFileName = `${baseName}@${Math.round(width)}x${Math.round(height)}${ext}`;

  const { canceled, filePath } = await dialog.showSaveDialog(windows.file!, {
    title: "Save resized image",
    defaultPath: defaultFileName,
    filters: [
      { name: "PNG", extensions: ["png"] },
      { name: "JPEG", extensions: ["jpg", "jpeg"] },
      { name: "WebP", extensions: ["webp"] },
    ],
  });

  if (canceled || !filePath) return;

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await sharp(image.path)
      .resize(Math.round(width), Math.round(height), { fit: "fill" })
      .toFile(filePath);
    
    //@todo open the resized img path?
    return;
  } catch (error) {
    //@todo add a client-side notify?
    throw new Error(error instanceof Error ? error.message : String(error));
  }
});

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