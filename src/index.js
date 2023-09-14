// call core module
const { ipcRenderer, remote } = require("electron");
const fs = require("fs");

// call local module
const { formatCurrencyToRupiah } = require("./components/Utility");
const { displayProducts, displayCart } = require("./components/Display");
const {
  handleAddCart,
  handleAddProduct,
  handleDeleteCart,
  handleDeleteProdcut,
} = require("./components/Handler");

// call third party module
// const { PosPrinter } = remote.require("electron-pos-printer");
// const { PosPrinter } = require("electron-pos-printer"); //dont work in production (??)

const FilePath = "./src/data/products.json";

const file = fs.readFileSync(FilePath, "utf-8");
const products = JSON.parse(file);
let carts = [];

// =========================================================
const cartContainer = document.getElementById("cartContainer");
const listProducts = document.getElementById("listProducts");
const cartWrapper = document.getElementById("wrapper-cart");
const totalWeight = document.getElementById("totalWeight");
const totalPrice = document.getElementById("totalPrice");
const formItem = document.getElementById("formItem");
// =========================================================

// Display products when the window loads
window.addEventListener("load", () => {
  ipcRenderer.send("get-products");
});

// Display products in listProducts
ipcRenderer.on("display-products", (event, products) => {
  displayProducts(products, listProducts);
});
// =========================================================

document.getElementById("search").addEventListener("keyup", (e) => {
  const searchTerm = e.target.value.toLowerCase(); // Konversi input pencarian ke huruf kecil
  const filterProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchTerm); // Memeriksa apakah nama produk mengandung searchTerm
  });
  console.log(filterProducts);
  displayProducts(filterProducts, listProducts);
});
// =========================================================
// Form Bussiness
formItem.addEventListener("submit", (e) => {
  // catch refresh window after submit form
  e.preventDefault();

  // get input element form data
  const nameProduct = document.getElementById("nameItem");
  const priceProduct = document.getElementById("priceItem");

  // asign data
  let name = nameProduct.value;
  let price = priceProduct.value;
  const id = `${Date.now()}`;
  handleAddProduct(id, name, parseInt(price));

  // send adding data to main proses
  // ipcRenderer.send("save-product", data);

  // adding data
  // products.push(data);
  // fs.writeFile(FilePath, JSON.stringify(products), (err) => {
  //   if (err) throw err;
  // });

  // Receive a confirmation message from the main process
  ipcRenderer.on("product-saved", () => {
    // clear form
    nameProduct.value = "";
    priceProduct.value = "";

    // back focus to first input in this case nameproduct
    nameProduct.focus();
    // Refresh or update the product list
    ipcRenderer.send("get-products");
  });
});
// =========================================================

// click bussiness in list product
listProducts.addEventListener("click", (e) => {
  // add data to cart
  if (e.target.classList.contains("add-to-cart")) {
    const id = e.target.parentElement.parentElement.id;
    const resultProduct = products.find((data) => data.id === `${id}`);
    let amount = 1;

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
  // Delete Data
  if (e.target.classList.contains("delete")) {
    handleDeleteProdcut(e.target.parentElement.parentElement.id);
    // Handle a confirmation message from the main process
    ipcRenderer.on("product-deleted", () => {
      // Refresh or update the product list
      ipcRenderer.send("get-products");
    });
    // displayProducts(products, listProducts);
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
