const path = require("path");
const product = require("./package.json");

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: product.productName,
        icon: path.resolve(__dirname, "src", "assets", "icons", "cashier.png"),
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {
        name: product.productName,
        icon: path.resolve(__dirname, "src", "assets", "icons", "cashier.png"),
      },
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        name: product.productName,
        icon: path.resolve(__dirname, "src", "assets", "icons", "cashier.png"),
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        name: product.productName,
        icon: path.resolve(__dirname, "src", "assets", "icons", "cashier.png"),
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
