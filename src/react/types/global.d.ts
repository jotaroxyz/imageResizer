import type { ElectronAPI } from "../../electron/preload.cjs";

declare global {
  interface Window {
    ipcRenderer: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
      once: (channel: string, func: (...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
    appWindow: {
      minimize: () => void,
      close: () => void
    }
  }
}

export {};