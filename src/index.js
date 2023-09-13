const { ipcRenderer } = require("electron");
// let { remote } = require("electron");
// const { PosPrinter } = remote.require("electron-pos-printer");
// const { PosPrinter } = require("electron-pos-printer"); //dont work in production (??)
// const path = require("path");

let products = [];
let carts = [];
// =========================================================
const cartContainer = document.getElementById("cartContainer");
const listProducts = document.getElementById("listProducts");
const cartWrapper = document.getElementById("wrapper-cart");
const formItem = document.getElementById("formItem");
// =========================================================
document.getElementById("search").addEventListener("keyup", (e) => {
  const searchTerm = e.target.value.toLowerCase(); // Konversi input pencarian ke huruf kecil
  const filterProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchTerm); // Memeriksa apakah nama produk mengandung searchTerm
  });
  console.log(filterProducts);
  displayData(filterProducts);
});
// =========================================================
// Form Bussiness
formItem.addEventListener("submit", (e) => {
  // catch refresh window after submit form
  e.preventDefault();

  // prepair data before adding
  const nameProduct = document.getElementById("nameItem");
  const priceProduct = document.getElementById("priceItem");

  let name = nameProduct.value;
  let price = priceProduct.value;
  const id = `${Date.now()}`;

  // adding datas
  products.push(handleAddProduct(id, name, parseInt(price)));

  // clear form
  name = nameProduct.value = "";
  price = priceProduct.value = "";

  // back focus to first input in this case nameproduct
  nameProduct.focus();

  // showing data
  displayData();
});
// click bussiness in list product
listProducts.addEventListener("click", (e) => {
  // add data to cart
  if (e.target.classList.contains("add-to-cart")) {
    const totalPrice = document.getElementById("totalPrice");
    const totalWeight = document.getElementById("totalWeight");

    const id = e.target.parentElement.parentElement.id;
    const resultProduct = products.find((data) => data.id === `${id}`);
    let amount = 1;

    const cart = carts.find(({ id, amount }) => id === resultProduct.id);
    if (cart) {
      cart.amount += 1;
      cart.amountPrice += cart.price;
    } else {
      carts.push(
        handleAddCart(
          resultProduct.id,
          resultProduct.name,
          resultProduct.price,
          amount,
          parseInt(resultProduct.price)
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

    displayCart();
  }
  // Delete Data
  if (e.target.classList.contains("delete")) {
    handleDeleteProdcut(e.target.parentElement.parentElement.id);
    displayData();
  }
});
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

    displayCart();
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

    displayCart();
  }
  // clear cart
  if (e.target.classList.contains("clear")) {
    if (carts.length) {
      ipcRenderer.send("print-data", carts);
    }

    carts = [];

    totalPrice.innerText = formatCurrencyToRupiah(0);
    totalWeight.innerText = 0;

    displayCart();
  }
});
// =========================================================
// Show Data after add or delete list product
function displayData(data = products) {
  listProducts.innerHTML = ""; // Mengosongkan kontainer
  data.forEach((data) => {
    listProducts.innerHTML += `
    <div class="grid grid-cols-3 items-center place-items-start border-b border-neutral-300 py-3" id="${
      data.id
    }">
      <div class="text-base" id="nameProduct">${data.name}</div>
      <div class="text-base" id="priceProduct">${formatCurrencyToRupiah(
        data.price
      )}</div>
      <div class="text-base flex gap-2">
          <button
            class="add-to-cart p-1 rounded bg-blue-500 text-white flex text-white"
            id="addToCart"
            data-feather="shopping-cart" />
          <button
            class="delete p-1 rounded bg-red-500 text-white flex"
            id="delete"
            data-feather="x-circle" />
        </div>
    </div>
    `;
  });
}
// Show Data into cart
function displayCart() {
  cartWrapper.innerHTML = ""; // Mengosongkan kontainer
  carts.forEach((data) => {
    cartWrapper.innerHTML += `
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
// =========================================================
// function add Product
function handleAddProduct(id, name, price) {
  let data = {};
  data.id = id;
  data.name = name;
  data.price = price;
  return data;
}
// function delete Product
function handleDeleteProdcut(id) {
  const result = products.findIndex((data) => data.id === `${id}`);
  if (result !== -1) {
    products.splice(result, 1);
  }
}
// function add to Cart
function handleAddCart(id, name, price, amount, amountPrice) {
  let data = {};
  data.id = id;
  data.name = name;
  data.price = parseInt(price);
  data.amount = amount;
  data.amountPrice = amountPrice;
  return data;
}
// function product in cart
function handleDeleteCart(id) {
  const result = carts.findIndex((data) => data.id === `${id}`);
  if (result !== -1) {
    carts.splice(result, 1);
  }
}
// =========================================================
// utils
function formatCurrencyToRupiah(amount) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Opsional, untuk menghapus desimal jika tidak ada pecahan
    }).format(amount);
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam mengonversi nilai ke Rupiah:",
      error
    );
    return amount; // Mengembalikan nilai asli jika terjadi kesalahan
  }
}

// print invoice
