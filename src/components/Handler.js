// function add Product
function handleAddProduct(id, name, price) {
  ipcRenderer.send("save-product", { id, name, price });
}
// function delete Product
function handleDeleteProdcut(id) {
  return ipcRenderer.send("delete-product", id);
}

// function add to Cart
function handleAddCart(id, name, price, amount) {
  let data = {};
  data.id = id;
  data.name = name;
  data.price = price;
  data.amount = amount;
  data.amountPrice = price;
  return data;
}
// function product in cart
function handleDeleteCart(id) {
  const result = carts.findIndex((data) => data.id === `${id}`);
  if (result !== -1) {
    carts.splice(result, 1);
  }
}

module.exports = {
  handleAddCart,
  handleAddProduct,
  handleDeleteCart,
  handleDeleteProdcut,
};
