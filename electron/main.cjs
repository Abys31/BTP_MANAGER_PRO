const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    title: "Atlas Manager",
    backgroundColor: '#0a0a0a',
    autoHideMenuBar: true,
    show: false
  });

  const url = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Open devTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

function startServer() {
  const serverPath = path.join(__dirname, '../server/index.js');
  
  // Set database path.
  // In development, we use the local one.
  // In production (portable), we store it in a hidden ".btp_data" folder next to the .exe on the USB key.
  const isPortable = !isDev;
  const basePath = isPortable ? path.dirname(app.getPath('exe')) : __dirname;
  
  const dbPath = isDev 
    ? path.join(__dirname, '../server/prisma/dev.db')
    : path.join(basePath, '.btp_data', 'btp_manager.db');

  console.log(`Starting server with database at: ${dbPath}`);

  serverProcess = spawn('node', [serverPath], {
    env: { 
      ...process.env,
      PORT: '5000',
      DATABASE_URL: `file:${dbPath}`,
      NODE_ENV: isDev ? 'development' : 'production'
    },
    stdio: 'inherit'
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
}

app.on('ready', () => {
  startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Kill the server process when the app quits
app.on('quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});
