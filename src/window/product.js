const { ipcRenderer } = require("electron");
const { formatCurrencyToRupiah } = require("../components/Utility");
const {
  handleAddProduct,
  handleDeleteProdcut,
} = require("../components/Handler.js");

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
  let priceItem = document.getElementById("priceItem");

  // asign data
  const id = `${Date.now()}`;
  let name = nameItem.value;
  let price = priceItem.value;

  // save data
  handleAddProduct(id, name, parseInt(price));

  // Receive a confirmation message from the main process
  ipcRenderer.on("product-saved", () => {
    // clear form
    nameItem.value = "";
    priceItem.value = "";

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
    handleDeleteProdcut(e.target.parentElement.parentElement.id);

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
        <div class="grid grid-cols-3 items-center place-items-start border-b border-neutral-300 py-3" id="${
          data.id
        }">
          <div class="text-base" id="nameProduct">${data.name}</div>
          <div class="text-base" id="priceProduct">${formatCurrencyToRupiah(
            data.price
          )}</div>
          <div class="text-base flex gap-2">
              <button
                class="delete p-1 rounded bg-red-500 text-white flex"
                id="delete"
                data-feather="x-circle" />
            </div>
        </div>
        `;
  });
}
