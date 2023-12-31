const { ipcRenderer } = require("electron");
const feather = require("feather-icons");
// =============================================================================
const { formatCurrencyToRupiah } = require("./components/Utility");
const { handleDeleteTransaction } = require("./components/Handler");
// =============================================================================
const listTransaction = document.getElementById("listTransaction");
const listProduct = document.getElementById("listProduct");
const tableTransaction = document.getElementById("tableTransaction");
const tableProduct = document.getElementById("tableProduct");
const totalIncome = document.getElementById("totalIncome");
const totalSalesWeight = document.getElementById("totalSalesWeight");
// =============================================================================
feather.replace();
let transactions = [];
// =============================================================================
window.addEventListener("load", () => {
  ipcRenderer.send("load:transaction-window");
});
// =============================================================================
ipcRenderer.on("display:data-transaction", (e, receivedCashBook, products) => {
  // ipcRenderer.send("clear-transaction");
  transactions = receivedCashBook;
  // console.log(transactions);

  totalPurchaseAmount = 0;
  totalPurchasePrice = 0;

  transactions.forEach((transaction) => {
    transaction.carts.forEach((cart) => {
      totalPurchaseAmount += cart.purchaseAmountProduct;
      totalPurchasePrice += cart.totalPurchasePriceProduct;
    });
  });

  if (transactions.length) {
    totalIncome.innerHTML = formatCurrencyToRupiah(totalPurchasePrice);
    totalSalesWeight.innerHTML = totalPurchaseAmount + " Ons";
    displayProducts(products, listProduct);
    displayTransaction(transactions, listTransaction);
  } else {
    tableTransaction.innerHTML = `<h5 class="text-center">belum ada penjualan</h5>`;
    tableProduct.innerHTML = `<h5 class="text-center">belum ada buah yang tejual</h5>`;
    totalProfit.innerHTML = formatCurrencyToRupiah(0);
    totalSalesWeight.innerHTML = 0;
  }
});
// =============================================================================
listTransaction.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.parentElement.parentElement.id;

    handleDeleteTransaction(parseInt(id));
    // const resultTransaction = transactions.find((ledger) => ledger.id == id);

    ipcRenderer.on("delete:transaction-deleted", () => {
      ipcRenderer.send("load:transaction-window");
    });
  }
});
// =============================================================================
function productPage() {
  ipcRenderer.send("product-page");
}
const cashierPage = () => {
  ipcRenderer.send("cashier-page");
};
// =============================================================================
function displayProducts(datas, container) {
  container.innerHTML = ``;

  // Lakukan map dan simpan hasilnya dalam variabel
  const mappedData = datas.map((data) => {
    const income = (data.sellingPrice - data.costPrice) * data.soldStock;
    return {
      name: data.name,
      priceProduct: data.sellingPrice * data.soldStock,
      income,
      remainingStock: data.stock - data.soldStock,
      soldStock: data.soldStock, // Tambahan properti soldStock
    };
  });

  // Urutkan berdasarkan soldStock
  mappedData.sort((a, b) => a.soldStock - b.soldStock).reverse();

  // Loop melalui hasil map yang sudah diurutkan
  mappedData.forEach((data) => {
    // Cek apakah properti soldStock ada
    if (data.soldStock !== undefined) {
      container.innerHTML += `
      <div class="grid grid-cols-4 items-center place-items-start border-b border-neutral-300 py-5 px-2">
        <div class="text-base" id="nameProduct">${data.name}</div>
        <div class="text-base" id="priceProduct">${data.priceProduct}</div>
        <div class="text-base" id="priceProduct">${data.income}</div>
        <div class="text-base" id="priceProduct">${data.remainingStock}</div>
      </div>
    `;
    }
  });
}
function displayTransaction(datas, container) {
  container.innerHTML = "";
  datas.forEach((data) => {
    // Hitung keuntungan bersih dan kotor
    let totalGrossIncome = 0;
    let totalNetIncome = 0;
    let totalStockSold = 0;

    // Iterasi melalui setiap item dalam cart
    data.carts.forEach((cartItem) => {
      // Hitung keuntungan bersih dan kotor untuk item ini
      const grossIncome =
        cartItem.product.sellingPrice * cartItem.purchaseAmountProduct;
      const netIncome =
        grossIncome -
        cartItem.product.costPrice * cartItem.purchaseAmountProduct;

      // Hitung jumlah stock yang berkurang dan stock yang terjual
      const stockSold = cartItem.purchaseAmountProduct;

      // Tambahkan keuntungan bersih ke total
      totalGrossIncome += grossIncome;
      totalNetIncome += netIncome;

      // Tambahkan jumlah stock yang terjual ke total
      totalStockSold += stockSold;
    });

    let date = new Date(data.id);
    // Mendapatkan komponen tanggal, bulan, dan tahun
    let day = date.getDate();
    let month = date.getMonth() + 1; // Ingat, bulan dimulai dari 0, sehingga perlu ditambah 1.
    let year = date.getFullYear();

    // Membuat format tanggal yang benar
    let formattedDate = day + "/" + month + "/" + year;

    container.innerHTML += `
    <div
    class="grid grid-cols-5 items-center place-items-start border-b border-neutral-300 py-5 px-2" id="${
      data.id
    }">
      <div class="text-base" id="nameProduct">${formattedDate}</div>
      <div class="text-base" id="grossIncome">${formatCurrencyToRupiah(
        totalGrossIncome
      )}</div>
      <div class="text-base" id="netIncome">${formatCurrencyToRupiah(
        totalNetIncome
      )}</div>
      <div class="text-base" id="stockSold">${totalStockSold} Ons</div>
      <div class="text-base flex gap-2">
        <button
          class="delete p-1 rounded bg-red-500 text-white flex"
          id="deleteIncome"
          data-feather="x-circle" />
      </div>
    </div>
        `;
    feather.replace();
  });
}
