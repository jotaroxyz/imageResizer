import React from "react";

export function useIpc<T = any>(channel: string, callback: (data: T) => void) {
  React.useEffect(() => {
    if (!window.ipcRenderer?.on) {
      console.warn("ipcRenderer is not available!");
      return;
    }

    console.log("[useIpc]", channel);

    const handler = (data: T) => {
      console.log("[useIpc]", data);
      callback(data);
    };

    window.ipcRenderer.on(channel, handler);

    return () => window.ipcRenderer.removeAllListeners(channel);
  }, [channel, callback]);
}