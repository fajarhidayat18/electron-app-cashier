const { ipcRenderer } = require("electron");
const { formatCurrencyToRupiah } = require("../components/Utility");
const {
  handleAddProduct,
  handleDeleteProdcut,
} = require("../components/Handler.js");
const feather = require("feather-icons");

// =============================================================================
const listProducts = document.getElementById("listProducts");
const formItem = document.getElementById("formItem");
// =============================================================================
// Display products when the window loads
window.addEventListener("load", () => {
  ipcRenderer.send("load:product-on-product-window");
});

// Display products in listProducts
ipcRenderer.on("display-products", (event, products) => {
  displayProducts(products, listProducts);
});
// =============================================================================
// Form adding product
formItem.addEventListener("submit", (e) => {
  // catch refresh window after submit form
  e.preventDefault();

  // get input element form data
  let nameItem = document.getElementById("nameItem");
  let sellingPriceItem = document.getElementById("sellingPriceItem");
  let costPriceItem = document.getElementById("costPriceItem");
  let stockItem = document.getElementById("stockItem");
  // let unitOfPrice = document.getElementById("unitOfPrice");

  // asign data
  const id = Date.now();
  const soldStock = 0;
  let name = nameItem.value;
  let sellingPrice = sellingPriceItem.value;
  let costPrice = costPriceItem.value;
  let stock = stockItem.value;
  let unit = "Kg";

  // save data
  handleAddProduct(
    parseInt(id),
    name,
    parseInt(sellingPrice),
    parseInt(costPrice),
    parseInt(stock),
    soldStock,
    unit
  );

  // Receive a confirmation message from the main process
  ipcRenderer.on("product-saved", () => {
    // clear form
    nameItem.value = "";
    sellingPriceItem.value = "";
    costPriceItem.value = "";
    stockItem.value = "";

    // back focus to first input in this case nameproduct
    nameItem.focus();

    // Refresh or update the product list
    ipcRenderer.send("load:product-on-product-window");
  });
});

// Delete Data product
listProducts.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    // Delete data product
    const id = parseInt(e.target.parentElement.parentElement.id);
    handleDeleteProdcut(id);

    // Handle a confirmation message from the main process
    ipcRenderer.on("product-deleted", () => {
      // Refresh or update the product list
      ipcRenderer.send("load:product-on-product-window");
    });
  }
});
// =============================================================================
// Show Data after add or delete list product
function displayProducts(data, container) {
  container.innerHTML = ""; // empty container
  data.forEach((data) => {
    container.innerHTML += `
        <div class="grid grid-cols-5 items-center place-items-start border-b border-neutral-300 py-3" id="${
          data.id
        }">
          <div class="text-base" id="nameProduct">${data.name}</div>
          <div class="text-base" id="priceProduct">${formatCurrencyToRupiah(
            data.sellingPrice
          )}/${data.unit}</div>
          <div class="text-base" id="priceProduct">${formatCurrencyToRupiah(
            data.costPrice
          )}/${data.unit}</div>
          <div class="text-base" id="priceProduct">${data.stock} ${
      data.unit
    }</div>
          <div class="text-base flex gap-2">
              <button
                class="delete p-1 rounded bg-red-500 text-white flex"
                id="delete"
                data-feather="x-circle" />
            </div>
        </div>
        `;
    feather.replace();
  });
}
