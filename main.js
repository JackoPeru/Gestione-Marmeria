const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

// Mantieni un riferimento globale all'oggetto window
// altrimenti la finestra verrà chiusa automaticamente
// quando l'oggetto JavaScript viene raccolto dal garbage collector
let mainWindow;

function createWindow() {
  // Crea la finestra del browser
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  // Carica il file index.html dell'app
  mainWindow.loadFile('index.html');

  // Apri il DevTools solo in modalità sviluppo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Emesso quando la finestra viene chiusa
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Controlla aggiornamenti all'avvio (solo in produzione)
  if (process.env.NODE_ENV !== 'development') {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Questo metodo viene chiamato quando Electron ha terminato
// l'inizializzazione ed è pronto a creare le finestre del browser.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // Su macOS è comune ricreare una finestra nell'app quando
    // l'icona del dock viene cliccata e non ci sono altre finestre aperte.
    if (mainWindow === null) createWindow();
  });
});

// Esci quando tutte le finestre sono chiuse, eccetto su macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Gestione degli aggiornamenti automatici
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// Aggiungi funzionalità per esportare/importare dati
ipcMain.on('export-data', (event, data) => {
  dialog.showSaveDialog(mainWindow, {
    title: 'Esporta dati',
    defaultPath: path.join(app.getPath('documents'), 'marmeria-data.json'),
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  }).then(result => {
    if (!result.canceled && result.filePath) {
      fs.writeFileSync(result.filePath, data);
      event.reply('export-data-result', { success: true });
    }
  }).catch(err => {
    event.reply('export-data-result', { success: false, error: err.message });
  });
});

ipcMain.on('import-data', (event) => {
  dialog.showOpenDialog(mainWindow, {
    title: 'Importa dati',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      const data = fs.readFileSync(result.filePaths[0], 'utf8');
      event.reply('import-data-result', { success: true, data });
    }
  }).catch(err => {
    event.reply('import-data-result', { success: false, error: err.message });
  });
});