import path from "path";
import { app } from "electron";

export const isDev = () => process.env.NODE_ENV === "development";

export const getPreloadPath = () => path.join(app.getAppPath(), isDev() ? "." : "..", "dist/electron/preload.cjs");