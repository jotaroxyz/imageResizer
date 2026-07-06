import { contextBridge, ipcRenderer, webUtils } from "electron";

const windowIpcReady = new Map<string, boolean>();

const electron = {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, func: (data: any) => void) => ipcRenderer.on(channel, (event, data: any) => func(data)),
    once: (channel: string, func: (data: any) => void) => ipcRenderer.once(channel, (event, data: any) => func(data)),
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
    invoke: async (channel: string, ...args: any[]) => await ipcRenderer.invoke(channel, ...args)
  },
  appWindow: {
    ready: (id: string) => {
      if (windowIpcReady.get(id)) return;

      ipcRenderer.send(`window:ready?${id}`);
      windowIpcReady.set(id, true);
    },
    minimize: (id: string | null) => {
      if (!id) return;

      ipcRenderer.send(`window:minimize?${id}`)
    },
    close: (id: string | null) => {
      if (!id) return;

      ipcRenderer.send(`window:close?${id}`);
      windowIpcReady.delete(id);
    }
  },
  utils: {
    getFilePath: (file: File) => webUtils.getPathForFile(file),
  }
}

contextBridge.exposeInMainWorld("ipcRenderer", electron.ipcRenderer);
contextBridge.exposeInMainWorld("appWindow", electron.appWindow);
contextBridge.exposeInMainWorld("utils", electron.utils);