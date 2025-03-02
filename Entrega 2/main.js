const carritoDeCompras ={
  tienda: [],
  carrito: []
};

if (localStorage.getItem("tienda")){
  carritoDeCompras.tienda = JSON.parse(localStorage.getItem("tienda"));
}

if (localStorage.getItem("carrito")){
  carritoDeCompras.carrito = JSON.parse(localStorage.getItem("carrito"));
}

function actualizarAlmacenamiento(){
  localStorage.setItem("tienda", JSON.stringify(carritoDeCompras.tienda));
  localStorage.setItem("carrito", JSON.stringify(carritoDeCompras.carrito));
}

function actualizarListaTienda(){
  const listaTienda = document.getElementById("listaTienda");
  listaTienda.innerHTML = "";
  carritoDeCompras.tienda.forEach(prod =>{
      const li = document.createElement("li");
      li.textContent = prod.nombre + " - $" + prod.precio + " ";

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () =>{
          eliminarProductoTienda(prod.nombre);
      });

      li.appendChild(btnEliminar);
      listaTienda.appendChild(li);
  });
}

function actualizarListaTiendaCompra(){
  const listaCompraTienda = document.getElementById("listaTiendaCompra");
  listaCompraTienda.innerHTML = "";
  carritoDeCompras.tienda.forEach(prod =>{
      const li = document.createElement("li");
      li.textContent = prod.nombre + " - $" + prod.precio + " ";
      const btnAdd = document.createElement("button");
      btnAdd.textContent = "Agregar al carrito";
      btnAdd.addEventListener("click", () =>{
          agregarAlCarrito(prod.nombre, 1);
          actualizarListaCarrito();
      });
      li.appendChild(btnAdd);
      listaCompraTienda.appendChild(li);
  });
}

function actualizarListaCarrito(){
  const listaCarrito = document.getElementById("listaCarrito");
  listaCarrito.innerHTML = "";
  carritoDeCompras.carrito.forEach(item =>{
      const li = document.createElement("li");
      li.textContent = item.nombre + " - $" + item.precio + " x " + item.cantidad + " ";
      const btnRemove = document.createElement("button");
      btnRemove.textContent = "Eliminar";
      btnRemove.addEventListener("click", () =>{
          eliminarDelCarrito(item.nombre);
          actualizarListaCarrito();
      });
      li.appendChild(btnRemove);
      listaCarrito.appendChild(li);
  });
}

function agregarAlCarrito(producto, cantidad){
  const prod = carritoDeCompras.tienda.find(p => p.nombre === producto);
  if (prod){
      const cartItem = carritoDeCompras.carrito.find(item => item.nombre === producto);
      if (cartItem) {
          cartItem.cantidad += cantidad;
      } else {
          carritoDeCompras.carrito.push({nombre: producto, precio: prod.precio, cantidad: cantidad});
      }
      actualizarAlmacenamiento();
  }
}

function eliminarDelCarrito(producto){
  carritoDeCompras.carrito = carritoDeCompras.carrito.filter(item => item.nombre !== producto);
  actualizarAlmacenamiento();
  actualizarListaCarrito();
}

function eliminarProductoTienda(producto){
  carritoDeCompras.tienda = carritoDeCompras.tienda.filter(p => p.nombre !== producto);
  actualizarAlmacenamiento();
  actualizarListaTienda();
  actualizarListaTiendaCompra();
}

function calcularTotal(){
  const total = carritoDeCompras.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  document.getElementById("totalDisplay").textContent = "Total a pagar: $" + total;
}

document.getElementById("btnAdmin").addEventListener("click", () =>{
  document.getElementById("seccionClave").style.display = "block";
  document.getElementById("seccionCompra").style.display = "none";
});

document.getElementById("btnValidarAdmin").addEventListener("click", () =>{
  const claveIngresada = document.getElementById("claveAdmin").value;
  const mensajeError = document.getElementById("mensajeError");

  if (claveIngresada === "1234"){
      document.getElementById("seccionClave").style.display = "none";
      document.getElementById("seccionAdmin").style.display = "block";
      actualizarListaTienda();
  }else{
      mensajeError.style.display = "block";
  }
});

document.getElementById("btnCompra").addEventListener("click", () =>{
  document.getElementById("seccionAdmin").style.display = "none";
  document.getElementById("seccionClave").style.display = "none";
  document.getElementById("seccionCompra").style.display = "block";
  actualizarListaTiendaCompra();
  actualizarListaCarrito();
});

document.getElementById("btnCalcularTotal").addEventListener("click", () =>{
  calcularTotal();
});

document.getElementById("formularioAdmin").addEventListener("submit", function (event){
  event.preventDefault();
  const nombre = document.getElementById("nombreProducto").value;
  const precio = parseFloat(document.getElementById("precioProducto").value);

  if (nombre !== "" && precio > 0){
      carritoDeCompras.tienda.push({nombre, precio});
      actualizarAlmacenamiento();
      actualizarListaTienda();
      actualizarListaTiendaCompra();
      this.reset();
  }
});