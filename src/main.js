const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ipcMain.on("print-data", (event, data) => {
    console.log("hello");
    childWindow = new BrowserWindow({
      width: 400,
      height: 500,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    event.reply("data-ke-jendela-baru", data);
    childWindow.loadFile("./src/print-page.html");

    // Kirim data dari jendela utama ke jendela baru
    childWindow.webContents.on("did-finish-load", () => {
      childWindow.webContents.send("data-ke-jendela-baru", data);
    });

    // Handle penutupan jendela baru
    childWindow.on("closed", () => {
      childWindow = null;
    });

    // Tanggapi pesan dari jendela baru untuk pencetakan
    ipcMain.on("cetak-dari-jendela-baru", () => {
      // Proses pencetakan di sini
      childWindow.webContents.print(
        {
          silent: false,
          color: true,
          margins: {
            marginType: "default",
          },
        },
        (success, errorType) => {
          if (!success) {
            console.error(`Gagal mencetak: ${errorType}`);
          } else {
            console.log("Pencetakan berhasil");
          }
        }
      );
    });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
