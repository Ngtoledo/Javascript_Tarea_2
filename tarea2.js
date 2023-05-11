class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    precio;         // Su precio
    categoria;      // Categoría a la que pertenece este producto
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock === undefined) { // SI EL STOCK NO ESTÁ DEFINIDO LE SUMO 10
          this.stock = 10;
        } else {
            this.stock = stock;
        }
    }
}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.productos = [];
        this.categorias = [];
        this.precioTotal = 0;
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);

        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);
        
        const productoExi = this.productos.find(p => p.sku === sku);

        if (productoExi) { // SI YA EXISTE EN EL CARRITO
          productoExi.cantidad += cantidad; // INCREMENTO LA CANTIDAD
        } else { // SI EL PRODUCTO NO EXISTE
            // Creo un producto nuevo
            const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
            this.productos.push(nuevoProducto);

            // LA CATEGORIA ESTA EN LA LISTA¿¿?? (LO QUE ENTENDI DEL PUNTO 1-B)
            if (!this.categorias.includes(producto.categoria)) {
                this.categorias.push(producto.categoria);
            }
        }
        this.precioTotal = this.precioTotal + (producto.precio * cantidad);
    }

    // función eliminarProducto
eliminarProducto(sku, cantidad) {
    
    return new Promise((resolve, reject) => {
      //  BUSCO EL INDICE EN EL ARREGLO PRODUTOS
      const productoInd = this.productos.findIndex(producto => producto.sku === sku);
  
      // SI EL PRODUCTO NO ESTA EN EL CARRITO RECHAZO ERROR
      if (productoInd  === -1) {
        reject(`El producto con ${sku} no está en el carrito`);
      } else {
        // SI EL PRODUCTO ESTA EN EL CARRITO OBTENFO EL OBJ DEL PRODUCTO
        const productoExi = this.productos[productoInd ];
  
        // VERIFICO LA CANTIDAD A ELIMINAR
        if (productoExi.cantidad > cantidad) {
          productoExi.cantidad -= cantidad;
        } else {
          //  SI ES MAYOR O IGUAL LO ELIMINO
          this.productos.splice(productoInd , 1);
        }
  
        // ACTUALIZO PRECIO
        this.precioTotal = this.productos.reduce((total, producto) => {
          // BUSCO EL PRECIO CON findProductBySku
          return total + producto.cantidad * findProductBySku(producto.sku).precio;
        }, 0);
  
        resolve();
      }
    });
  }
}
// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}
// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                console.log(`El producto ${sku} no existe`);
            }
        }, 1500);
    });
}
const carrito = new Carrito();

// PROMESAS
carrito.agregarProducto('WE328NJ', 2) //AGREGA PRODUCTO AL CARRO
  .then(() => {
    console.log('Producto agregado '); //OK
    console.log('Carrito:', carrito);
    return carrito.eliminarProducto('WE328NJ', 1); //ELIMINO
  })
  .then(() => {
    console.log('Producto eliminado'); //OK
    console.log('Carrito:', carrito);
  })
  .catch(error => {
    console.error(error); //EN CASO DE ERROR IMPRIME
  });
