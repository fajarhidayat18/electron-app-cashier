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
              class="add-to-cart p-1 rounded bg-blue-500 text-white flex"
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

module.exports = { displayProducts, displayCart };
