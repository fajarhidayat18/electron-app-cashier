// call third party module
const { ipcRenderer, remote } = require("electron");
const feather = require("feather-icons");
// const { PosPrinter } = remote.require("electron-pos-printer");
// const { PosPrinter } = require("electron-pos-printer"); //dont work in production (??)

// =============================================================================
// call local module
const { formatCurrencyToRupiah } = require("../components/Utility");
const {
  handleCreateCart,
  handleAddProductToCart,
  handleDeleteCart,
  handleDeleteProdcut,
} = require("../components/Handler");
// =============================================================================
// create variable data contain
let products = [];
let carts = [];

// =============================================================================
const formCartShopping = document.getElementById("formCartShopping");
const cartContainer = document.getElementById("cartContainer");
const listProducts = document.getElementById("listProducts");
const cartWrapper = document.getElementById("wrapper-cart");
const totalWeight = document.getElementById("totalWeight");
const totalPrice = document.getElementById("totalPrice");
const cancelCart = document.getElementById("cancelCart");
const modalCart = document.getElementById("modalCart");
const purchaseAmount = document.getElementById("purchaseAmount");
const totalPurchasePrice = document.getElementById("totalPurchasePrice");
// =============================================================================
// Display products when the window loads
window.addEventListener("load", () => {
  ipcRenderer.send("load:data-window");
});
// =============================================================================
// Display products in listProducts
ipcRenderer.on(
  "show:display-data",
  (event, receivedProducts, receivedCarts) => {
    carts = receivedCarts;
    products = receivedProducts;

    const sumPrice = carts.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.totalAmountProduct,
      0
    );
    // console.log(sumPrice);

    const sumWeight = carts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amountProduct,
      0
    );

    totalPrice.innerText = formatCurrencyToRupiah(sumPrice);
    totalWeight.innerText = sumWeight;

    displayCart(carts, cartWrapper);
    displayProducts(products, listProducts);
  }
);
// =============================================================================
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
// =============================================================================
formCartShopping.addEventListener("submit", (e) => {
  // e.preventDefault();
  const idfind = parseInt(idProductCart.value);
  const resultProduct = products.find((data) => data.id === idfind);
  // return console.log(resultProduct);
  const cart = {
    id: Date.now() + Math.floor(Math.random() * (100 - 10 + 1)) + 10,
    amountProduct: parseFloat(purchaseAmount.value),
    totalAmountProduct: parseFloat(totalPurchasePrice.value),
    product: null,
  };
  // console.log(cart);
  cart.product = {
    id: resultProduct.id,
    name: resultProduct.name,
    purchaseAmount: purchaseAmount.value,
    totalPurchasePrice: totalPurchasePrice.value,
    sellingPrice: resultProduct.sellingPrice,
    costPrice: resultProduct.costPrice,
    stock: resultProduct.stock,
    unit: resultProduct.unit,
  };
  handleCreateCart(cart);
});
// =============================================================================
// add data to cart
listProducts.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    // initialize the data that is clicked
    const id = parseInt(e.target.parentElement.parentElement.id);
    const resultProduct = products.find((data) => data.id === id);

    idProductCart.value = resultProduct.id;
    nameItem.value = resultProduct.name;
    sellingPriceItem.value = resultProduct.sellingPrice;

    purchaseAmount.addEventListener("keyup", (e) => {
      // Periksa apakah pengguna menekan angka 0 untuk pertama kali
      if (e.target.value === "0") {
        e.target.value = "0.";
      }

      totalPurchasePrice.value =
        resultProduct.sellingPrice * parseFloat(e.target.value);
    });

    modalCart.parentElement.classList.toggle("hidden");
  }
});

cancelCart.addEventListener("click", (e) => {
  e.target.parentElement.parentElement.parentElement.parentElement.classList.toggle(
    "hidden"
  );
});
// click bussiness in cart container
cartContainer.addEventListener("click", (e) => {
  // Decrement amount cart
  if (e.target.classList.contains("delete") || e.target.closest(".delete")) {
    const id = e.target.parentElement.parentElement.parentElement.id;

    handleDeleteCart(parseInt(id));

    ipcRenderer.on("update:cart-deleted", () => {
      ipcRenderer.send("load:data-window");
    });
  }

  // clear cart
  if (e.target.classList.contains("clear")) {
    // Objek untuk menyimpan hasil gabungan data
    if (carts.length >= 1) {
      const cashbook = {
        id: Date.now(),
        products: [],
        carts: [],
      };
      // Menggabungkan data dari objek carts
      cashbook.carts = carts.map((cart) => {
        const productToUpdate = products.find(
          (product) => product.id === cart.product.id
        );

        // Jika objek ditemukan, maka lakukan pembaruan nilai
        if (productToUpdate) {
          productToUpdate.soldStock += cart.amountProduct;
        }

        return {
          id: cart.id,
          purchaseAmountProduct: cart.amountProduct,
          totalPurchasePriceProduct: cart.totalAmountProduct,
          product: {
            idProduct: cart.product.id,
            name: cart.product.name,
            purchaseAmount: cart.product.purchaseAmount,
            totalPurchasePrice: cart.product.totalPurchasePrice,
            sellingPrice: cart.product.sellingPrice,
            costPrice: cart.product.costPrice,
            stock: cart.product.stock,
            unit: cart.product.unit,
          },
        };
      });
      // Menggabungkan data dari objek products
      /* productCashBook = products.map((product) => {
        return {
          id: product.id,
          name: product.name,
          sellingPrice: product.sellingPrice,
          costPrice: product.costPrice,
          soldStock: aw,
          stock: product.stock,
          unit: product.unit,
        };
      }); */

      ipcRenderer.send("create:transactions-data", cashbook);

      ipcRenderer.on("load:create-cash-book", (e, data) => {
        ipcRenderer.send("load:data-window");
      });
    }
    // return console.log("kosong");
  }
});

// =============================================================================

function displayProducts(data, container) {
  container.innerHTML = ""; // empty container

  data.forEach((data) => {
    container.innerHTML += `
      <div class="grid grid-cols-3 items-center place-items-start border-b border-neutral-300 py-3" id="${
        data.id
      }">
      <div class="text-base" id="nameProduct">${data.name}</div>
      <div class="text-base" id="priceProduct">${formatCurrencyToRupiah(
        data.sellingPrice
      )}/${data.unit}</div>
        <div class="text-base flex gap-2">
            <button
              class="add-to-cart p-1 rounded bg-blue-500 text-white flex cursor-pointer"
              id="addToCart" data-feather="shopping-cart"></button>
          </div>
      </div>
      `;
    feather.replace();
  });
}
function displayCart(data, container) {
  container.innerHTML = ""; // empty container
  data.forEach((data) => {
    container.innerHTML += `
          <div class="group overflow-y-scroll h-[5rem]" id="${data.id}">
            <div class="itemCart relative h-full">
              <div class="py-2 px-3 flex justify-between items-center border-b absolute w-full group-hover:-translate-x-10 z-10 group-hover:z-0 bg-white h-full transition-all">

                <div class="flex flex-col gap-1">
                  <span class="font-bold text-base">${data.product.name}</span>
                  <span class="font-medium text-base">${formatCurrencyToRupiah(
                    data.product.sellingPrice
                  )}</span>
                </div>
                <div class="flex gap-2">
                  <span class="amount font-medium text-lg"> ${
                    data.amountProduct
                  }</span>
                </div>
              </div>

              <div class="absolute flex h-full right-0">
                <button class="delete bg-red-500 flex items-center px-2 text-white">
                  <i data-feather="x-circle"></i>
                </button>
              </div>

              </div>
            </div>
          </div>
          `;
    feather.replace();
  });
}
// =============================================================================
