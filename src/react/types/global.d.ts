declare global {
  interface Window {
    ipcRenderer: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
      once: (channel: string, func: (...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
    appWindow: {
      ready: (id: string) => void;
      minimize: (id: string | null) => void;
      close: (id: string | null) => void;
    };
    utils: {
      getFilePath: (file: File) => string;
    }
  }
}

export {};