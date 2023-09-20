// function add Product
function handleAddProduct(data) {
  return ipcRenderer.send("create:create-product", data);
}
// function delete Product
function handleDeleteProdcut(id) {
  return ipcRenderer.send("delete-product", id);
}
function handleDeleteTransaction(id) {
  return ipcRenderer.send("delete:delete-transaction", id);
}

// function add to Cart
function handleCreateCart(data) {
  return ipcRenderer.send("create:data-cart", data);
}

// function product in cart
function handleDeleteCart(id) {
  return ipcRenderer.send("delete:cart-item", id);
}

module.exports = {
  handleCreateCart,
  handleAddProduct,
  handleDeleteCart,
  handleDeleteProdcut,
  handleDeleteTransaction,
};
