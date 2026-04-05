const { contextBridge, ipcRenderer } = require('electron');

// Expose protected APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Add any IPC methods here if needed
  // For now, it remains empty as we rely on the Express API
});
