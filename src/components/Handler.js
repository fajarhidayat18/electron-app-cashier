// function add Product
function handleAddProduct(
  id,
  name,
  sellingPrice,
  costPrice,
  stock,
  soldStock,
  unit
) {
  return ipcRenderer.send("save-product", {
    id,
    name,
    sellingPrice,
    costPrice,
    stock,
    soldStock,
    unit,
  });
}
// function delete Product
function handleDeleteProdcut(id) {
  return ipcRenderer.send("delete-product", id);
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
};
