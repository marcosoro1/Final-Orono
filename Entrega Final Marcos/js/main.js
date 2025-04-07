const carritoDeCompras = {
    tienda: [],
    carrito: []
  };
  
  async function inicializarTienda() {
    try {
      const response = await fetch('db/db.json');
      const data = await response.json();
      
      if (!localStorage.getItem('tienda')) {
        carritoDeCompras.tienda = data.productos;
        localStorage.setItem('tienda', JSON.stringify(data.productos));
      } else {
        carritoDeCompras.tienda = JSON.parse(localStorage.getItem('tienda'));
      }
      
      carritoDeCompras.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      renderizarProductosCompra();
      actualizarCarrito();
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    }
  }
  
  function renderizarProductosCompra() {
    const contenedor = document.getElementById('productosCompra');
    contenedor.innerHTML = '';
    
    carritoDeCompras.tienda.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
        <div class="card-content">
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <p class="price">$${prod.precio}</p>
          <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
        </div>
      `;
      contenedor.appendChild(card);
    });
  }
  
  function agregarAlCarrito(id) {
    const producto = carritoDeCompras.tienda.find(p => p.id === id);
    const itemExistente = carritoDeCompras.carrito.find(i => i.id === id);
    
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      carritoDeCompras.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }
    
    actualizarCarrito();
    Swal.fire({ icon: 'success', title: 'Producto agregado', timer: 1000 });
  }
  
  function actualizarCarrito() {
    const contenedor = document.getElementById('carritoContainer');
    contenedor.innerHTML = '';
    let total = 0;
    
    carritoDeCompras.carrito.forEach(item => {
      total += item.precio * item.cantidad;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="item-info">
          <span class="item-title">${item.nombre}</span>
          <span class="item-price">$${item.precio} x ${item.cantidad}</span>
        </div>
        <div class="item-controls">
          <button onclick="modificarCantidad(${item.id}, 1)">+</button>
          <button onclick="modificarCantidad(${item.id}, -1)">-</button>
          <button class="eliminar-btn" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
        </div>
      `;
      contenedor.appendChild(div);
    });
    
    document.getElementById('totalDisplay').textContent = `Total: $${total}`;
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras.carrito));
  }
  
  function modificarCantidad(id, delta) {
    const item = carritoDeCompras.carrito.find(i => i.id === id);
    if (item) {
      item.cantidad = Math.max(1, item.cantidad + delta);
      actualizarCarrito();
    }
  }
  
  function eliminarDelCarrito(id) {
    carritoDeCompras.carrito = carritoDeCompras.carrito.filter(i => i.id !== id);
    actualizarCarrito();
    Swal.fire({ icon: 'info', title: 'Producto eliminado', timer: 1000 });
  }
  
  document.getElementById('finalizarCompra').addEventListener('click', () => {
    if (carritoDeCompras.carrito.length === 0) {
      Swal.fire('Error', 'El carrito está vacío', 'error');
      return;
    }
    document.getElementById('seccionCompra').classList.add('hidden');
    document.getElementById('seccionCheckout').classList.remove('hidden');
  });
  
  document.getElementById('metodoPago').addEventListener('change', function() {
    const detalles = document.getElementById('detallesTarjeta');
    if (this.value === 'tarjeta') {
      detalles.classList.remove('hidden');
    } else {
      detalles.classList.add('hidden');
    }
  });
  
  function validarTarjeta() {
    const numero = document.getElementById('numeroTarjeta').value;
    const vencimiento = document.getElementById('vencimientoTarjeta').value;
    const cvv = document.getElementById('cvvTarjeta').value;
    
    if (!/^\d{16}$/.test(numero)) {
      mostrarErrorCheckout('Número de tarjeta inválido');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
      mostrarErrorCheckout('Fecha vencimiento inválida (MM/AA)');
      return false;
    }
    if (!/^\d{3}$/.test(cvv)) {
      mostrarErrorCheckout('CVV inválido');
      return false;
    }
    return true;
  }
  
  function mostrarErrorCheckout(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'Error en el formulario',
      text: mensaje,
      timer: 2000
    });
  }
  
  document.getElementById('formularioCheckout').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
      nombre: document.getElementById('nombreCliente').value.trim(),
      email: document.getElementById('emailCliente').value.trim(),
      telefono: document.getElementById('telefonoCliente').value.trim(),
      direccion: {
        calle: document.getElementById('direccionCliente').value.trim(),
        ciudad: document.getElementById('ciudadCliente').value.trim(),
        cp: document.getElementById('cpCliente').value.trim()
      },
      metodoPago: document.getElementById('metodoPago').value
    };
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      mostrarErrorCheckout('Email inválido');
      return;
    }
    
    if (datos.metodoPago === 'tarjeta' && !validarTarjeta()) {
      return;
    }
  
    const fechaEntrega = new Date(Date.now() + 3 * 86400000).toLocaleDateString();
    const resumenHTML = `
      <div class="resumen">
        <h3>¡Compra exitosa!</h3>
        <p>Fecha estimada de entrega: ${fechaEntrega}</p>
        <div class="resumen-section">
          <h4>Datos del cliente:</h4>
          <p>${datos.nombre}</p>
          <p>${datos.email}</p>
          <p>${datos.telefono}</p>
          <p>${datos.direccion.calle}, ${datos.direccion.ciudad}</p>
          <p>CP: ${datos.direccion.cp}</p>
        </div>
        <div class="resumen-section">
          <h4>Productos:</h4>
          <ul>
            ${carritoDeCompras.carrito.map(item => `
              <li>${item.nombre} - ${item.cantidad} x $${item.precio}</li>
            `).join('')}
          </ul>
          <p class="total">Total: $${carritoDeCompras.carrito.reduce((a, b) => a + (b.precio * b.cantidad), 0)}</p>
        </div>
      </div>
    `;
  
    Swal.fire({
      title: '¡Gracias por tu compra!',
      html: resumenHTML,
      icon: 'success'
    }).then(() => {
      carritoDeCompras.carrito = [];
      actualizarCarrito();
      document.getElementById('seccionCheckout').classList.add('hidden');
      document.getElementById('seccionCompra').classList.remove('hidden');
      document.getElementById('formularioCheckout').reset();
    });
  });
  
  // Administración
  document.getElementById('btnAdmin').addEventListener('click', () => {
    document.getElementById('seccionClave').classList.remove('hidden');
    document.getElementById('seccionCompra').classList.add('hidden');
  });
  
  document.getElementById('btnValidarAdmin').addEventListener('click', () => {
    const clave = document.getElementById('claveAdmin').value;
    if (clave === '1234') {
      document.getElementById('seccionClave').classList.add('hidden');
      document.getElementById('seccionAdmin').classList.remove('hidden');
      renderizarProductosAdmin();
    } else {
      document.getElementById('mensajeError').classList.remove('hidden');
    }
  });
  
  document.getElementById('btnCompra').addEventListener('click', () => {
    document.getElementById('seccionAdmin').classList.add('hidden');
    document.getElementById('seccionClave').classList.add('hidden');
    document.getElementById('seccionCheckout').classList.add('hidden');
    document.getElementById('seccionCompra').classList.remove('hidden');
  });
  
  function renderizarProductosAdmin() {
    const contenedor = document.getElementById('adminProductos');
    contenedor.innerHTML = '';
    carritoDeCompras.tienda.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <div class="card-content">
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <p class="price">$${prod.precio}</p>
          <button onclick="eliminarProductoTienda(${prod.id})">Eliminar</button>
        </div>
      `;
      contenedor.appendChild(card);
    });
  }
  
  function eliminarProductoTienda(id) {
    carritoDeCompras.tienda = carritoDeCompras.tienda.filter(p => p.id !== id);
    carritoDeCompras.carrito = carritoDeCompras.carrito.filter(i => i.id !== id);
    actualizarAlmacenamiento();
    renderizarProductosAdmin();
    renderizarProductosCompra();
    actualizarCarrito();
  }
  
  document.getElementById('formularioAdmin').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreProducto').value;
    const precio = parseFloat(document.getElementById('precioProducto').value);
    const descripcion = document.getElementById('descripcionProducto').value;
    const imagenFile = document.getElementById('imagenProducto').files[0];
  
    if (nombre && precio > 0 && descripcion && imagenFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const nuevoProducto = {
          id: Date.now(),
          nombre,
          precio,
          descripcion,
          imagen: e.target.result
        };
        carritoDeCompras.tienda.push(nuevoProducto);
        actualizarAlmacenamiento();
        renderizarProductosAdmin();
        renderizarProductosCompra();
        document.getElementById('formularioAdmin').reset();
        Swal.fire('Éxito', 'Producto agregado', 'success');
      };
      reader.readAsDataURL(imagenFile);
    }
  });
  
  document.getElementById('btnReset').addEventListener('click', async function() {
    const { value: aceptar } = await Swal.fire({
      title: '¿Restablecer productos?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restablecer'
    });
    
    if (aceptar) {
      const response = await fetch('db/db.json');
      const data = await response.json();
      carritoDeCompras.tienda = data.productos;
      carritoDeCompras.carrito = [];
      actualizarAlmacenamiento();
      renderizarProductosAdmin();
      renderizarProductosCompra();
      actualizarCarrito();
      Swal.fire('Éxito', 'Productos restablecidos', 'success');
    }
  });
  
  function actualizarAlmacenamiento() {
    localStorage.setItem('tienda', JSON.stringify(carritoDeCompras.tienda));
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras.carrito));
  }
  
  document.getElementById('vaciarCarrito').addEventListener('click', () => {
    carritoDeCompras.carrito = [];
    actualizarCarrito();
    Swal.fire('Carrito vaciado', '', 'info');
  });
  
  document.getElementById('cancelarCheckout').addEventListener('click', () => {
    document.getElementById('seccionCheckout').classList.add('hidden');
    document.getElementById('seccionCompra').classList.remove('hidden');
  });
  
  document.addEventListener('DOMContentLoaded', inicializarTienda);