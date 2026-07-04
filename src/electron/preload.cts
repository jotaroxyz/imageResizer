import { contextBridge, ipcRenderer } from "electron";

const electron = {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, func: (data: any) => void) => ipcRenderer.on(channel, (event, data: any) => func(data)),
    once: (channel: string, func: (data: any) => void) => ipcRenderer.once(channel, (event, data: any) => func(data)),
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
  },
  appWindow: {
    minimize: () => ipcRenderer.send("window:minimize"),
    close: () => ipcRenderer.send("window:close")
  }
}

contextBridge.exposeInMainWorld("ipcRenderer", electron.ipcRenderer);
contextBridge.exposeInMainWorld("appWindow", electron.appWindow);