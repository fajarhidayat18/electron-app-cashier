// call third party module
const { ipcRenderer, remote } = require("electron");
// const { PosPrinter } = remote.require("electron-pos-printer");
// const { PosPrinter } = require("electron-pos-printer"); //dont work in production (??)

// call local module
const { formatCurrencyToRupiah } = require("../components/Utility");
const {
  handleAddCart,
  handleAddProduct,
  handleDeleteCart,
  handleDeleteProdcut,
} = require("../components/Handler");

// create variable data contain
let products = [];
let carts = [];

// =========================================================
const cartContainer = document.getElementById("cartContainer");
const listProducts = document.getElementById("listProducts");
const cartWrapper = document.getElementById("wrapper-cart");
const totalWeight = document.getElementById("totalWeight");
const totalPrice = document.getElementById("totalPrice");
// =========================================================
// Display products when the window loads
window.addEventListener("load", () => {
  ipcRenderer.send("load:product-on-cashier-window");
});

// Display products in listProducts
ipcRenderer.on("display-products", (event, receivedProducts) => {
  products = receivedProducts;
  displayProducts(products, listProducts);
});
// =========================================================
// search
document.getElementById("search").addEventListener("keyup", (e) => {
  // Konversi input pencarian ke huruf kecil
  const searchTerm = e.target.value.toLowerCase();

  const filterProducts = products.filter((product) => {
    // Memeriksa apakah nama produk mengandung searchTerm
    return product.name.toLowerCase().includes(searchTerm);
  });
  displayProducts(filterProducts, listProducts);
});
// =========================================================
// add data to cart
listProducts.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    // initialize the data that is clicked
    const id = e.target.parentElement.parentElement.id;
    const resultProduct = products.find((data) => data.id === `${id}`);
    let amount = 1;

    /* 
    conditioning if the data you click on is already in the cart then increase the amount, otherwise enter the data
    */
    const cart = carts.find(({ id }) => id === resultProduct.id);
    if (cart) {
      cart.amount += 1;
      cart.amountPrice += cart.price;
    } else {
      carts.push(
        handleAddCart(
          resultProduct.id,
          resultProduct.name,
          resultProduct.price,
          amount
        )
      );
    }

    const sumPrice = carts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amountPrice,
      0
    );
    const sumWeight = carts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );

    totalPrice.innerText = formatCurrencyToRupiah(sumPrice);
    totalWeight.innerText = sumWeight;

    displayCart(carts, cartWrapper);
  }
});
// =========================================================
// click bussiness in cart container
cartContainer.addEventListener("click", (e) => {
  // Decrement amount cart
  if (e.target.classList.contains("decrement")) {
    const idToFind = e.target.parentElement.parentElement.id;
    const cart = carts.find(({ id, amount }) => id === idToFind);

    if (cart.amount > 1) {
      cart.amount -= 1;
      cart.amountPrice -= cart.price;
    } else {
      handleDeleteCart(idToFind);
    }

    const sumPrice = carts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amountPrice,
      0
    );
    const sumWeight = carts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );

    totalPrice.innerText = formatCurrencyToRupiah(sumPrice);
    totalWeight.innerText = sumWeight;

    displayCart(carts, cartWrapper);
  }
  // Decrement amount cart
  if (e.target.classList.contains("increment")) {
    const idToFind = e.target.parentElement.parentElement.id;
    const cart = carts.find(({ id, amount }) => id === idToFind);

    cart.amount += 1;
    cart.amountPrice += cart.price;

    const sumPrice = carts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amountPrice,
      0
    );
    const sumWeight = carts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );

    totalPrice.innerText = formatCurrencyToRupiah(sumPrice);
    totalWeight.innerText = sumWeight;

    displayCart(carts, cartWrapper);
  }
  // clear cart
  if (e.target.classList.contains("clear")) {
    if (carts.length) {
      ipcRenderer.send("print-data", carts);
    }

    carts = [];

    totalPrice.innerText = formatCurrencyToRupiah(0);
    totalWeight.innerText = 0;

    displayCart(carts, cartWrapper);
  }
});
// =========================================================
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
              class="add-to-cart p-1 rounded bg-blue-500 text-white flex"
              id="addToCart"
              data-feather="shopping-cart" />
          </div>
      </div>
      `;
  });
}
function displayCart(data, container) {
  container.innerHTML = ""; // empty container
  data.forEach((data) => {
    container.innerHTML += `
    <div class="py-2 px-3 flex justify-between items-center border-b" id="${
      data.id
    }">
      <div class="flex flex-col gap-1">
        <span class="font-bold text-base">${data.name}</span>
        <span class="font-medium text-base">${formatCurrencyToRupiah(
          data.price
        )}</span>
        </div>
  
        <div class="flex gap-2">
          <button
            class="decrement rounded-lg border border-green-500 p-1 flex"
            data-feather="minus-circle">
            <!-- <i data-feather="minus-circle"></i> -->
          </button>
          <span class="amount font-medium text-lg">${data.amount}</span>
          <button
            class="increment rounded-lg border border-green-500 p-1 flex"
            data-feather="plus-circle">
            <!-- <i data-feather="plus-circle"></i> -->
          </button>
        </div>
  
      </div>
    `;
  });
}
