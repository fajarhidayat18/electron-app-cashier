const path = require("path");
module.exports = {
  packagerConfig: {
    asar: true,
    icon: "src/assets/icons/cashier.ico",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        icon: "src/assets/icons/cashier.ico",
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: "src/assets/icons/cashier.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
