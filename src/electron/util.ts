import path from "path";
import { app } from "electron";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const __rootdir = path.resolve(__dirname, "../..");

export const isDev = () => process.env.NODE_ENV === "development";

export const getPreloadPath = () => path.join(app.getAppPath(), isDev() ? "." : "..", "dist/electron/preload.cjs");