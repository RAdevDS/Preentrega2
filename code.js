const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  // Método para agregar un producto
  addProduct(product) {
    const products = this.getProducts();
    const lastId = products.length > 0 ? products[products.length - 1].id : 0;
    product.id = lastId + 1;
    products.push(product);
    this.saveProducts(products);
    return product;
  }

  // Método para obtener todos los productos
  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Método para obtener un producto por su id
  getProductById(id) {
    const products = this.getProducts();
    return products.find((product) => product.id === id);
  }

  // Método para actualizar un producto
  updateProduct(id, updatedProduct) {
    const products = this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct, id };
      this.saveProducts(products);
      return products[index];
    } else {
      return null; // Producto no encontrado
    }
  }

  // Método para eliminar un producto por su id
  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      this.saveProducts(products);
    }
  }

  // Método para guardar productos en el archivo
  saveProducts(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
  }
}

const productManager = new ProductManager('products.json');

// Agregar 10 productos
for (let i = 1; i <= 10; i++) {
  productManager.addProduct({
    title: `Producto ${i}`,
    description: `Descripción ${i}`,
    price: 10.99 * i,
    thumbnail: `imagen${i}.jpg`,
    code: `P${i}`,
    stock: 50 + i,
  });
}

// Agregar un producto
const newProduct = productManager.addProduct({
  title: 'Producto 11',
  description: 'Descripción 11',
  price: 10.99,
  thumbnail: 'imagen11.jpg',
  code: 'P11',
  stock: 500,
});

console.log('Producto agregado:', newProduct);

// Actualizar un producto
const productId = 11;
const updatedProduct = productManager.updateProduct(productId, {
  price: 12.99,
  stock: 60,
});
console.log('Producto actualizado:', updatedProduct);

// Eliminar un producto
productManager.deleteProduct(productId);
console.log('Producto eliminado.');

// Obtener todos los productos
const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);
