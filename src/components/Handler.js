// function add Product
function handleAddProduct(id, name, price) {
  return ipcRenderer.send("save-product", { id, name, price });

  let data = {};
  data.id = id;
  data.name = name;
  data.price = price;
  return data;
}
// function delete Product
function handleDeleteProdcut(id) {
  return ipcRenderer.send("delete-product", id);

  const result = products.findIndex((data) => data.id === `${id}`);
  if (result !== -1) {
    products.splice(result, 1);
    fs.writeFileSync(FilePath, JSON.stringify(products));
  }
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
