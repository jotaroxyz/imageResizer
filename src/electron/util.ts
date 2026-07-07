import path from "path";
import { app } from "electron";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const isDev = () => !app.isPackaged;

export const baseDir = isDev() ? process.cwd() : path.join(__dirname, '../../');