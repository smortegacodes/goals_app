const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Development mode check based on npm script
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// Handle saving goals data
ipcMain.handle('save-goals', async (event, goals) => {
  console.log('IPC save-goals handler called');
  try {
    console.log("Saving goals:", goals);
    const filePath = path.join(__dirname, '../src/data/goals.json');
    console.log("Saving to path:", filePath);
    await fs.writeFile(filePath, JSON.stringify(goals, null, 2));
    console.log("Save successful");
    return { success: true };
  } catch (error) {
    console.error('Error saving goals:', error);
    return { success: false, error: error.message };
  }
});

function createWindow() {
  console.log('Creating window...');
  console.log('Development mode:', isDev);
  console.log('Current working directory:', process.cwd());
  
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: isDev ? false : true,
    },
    backgroundColor: '#2e1e2f', // Match the app's dark theme
  });

  // Expose the saveGoals function to the renderer process
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      const { ipcRenderer } = require('electron');
      window.electronAPI = {
        saveGoals: (goals) => {
          return ipcRenderer.invoke('save-goals', goals);
        }
      };
    `);
  });

  // In development, use the development server URL
  const startURL = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
    
  console.log('Loading URL:', startURL);

  // Load the app
  mainWindow.loadURL(startURL).catch(err => {
    console.error('Failed to load URL:', err);
    if (isDev) {
      console.log('Development load failed, retrying...');
      // Try loading localhost directly
      mainWindow.loadURL('http://localhost:3000');
    }
  });

  // Log loading state
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('Started loading...');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Finished loading');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    if (isDev) {
      console.log('Retrying load after failure...');
      setTimeout(() => mainWindow.loadURL('http://localhost:3000'), 1000);
    }
  });

  // Always open DevTools for now to help debug
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Special handling for development mode
  if (isDev) {
    // Allow loading of local files in dev
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = decodeURI(request.url.replace('file:///', ''));
      callback(pathname);
    });
  }
  
  console.log('App is ready, creating window...');
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
}); 