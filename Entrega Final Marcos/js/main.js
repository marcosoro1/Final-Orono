const productosIniciales = [
    {
        id: 1,
        nombre: "Laptop Gamer",
        descripcion: "Potente laptop para gaming con tarjeta gráfica RTX 4070.",
        precio: 1500,
        imagen: "https://images.unsplash.com/photo-1617194242688-1283f274e46d?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        nombre: "Smartphone",
        descripcion: "Celular con cámara de 108MP y pantalla AMOLED 120Hz.",
        precio: 800,
        imagen: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=250&h=150&q=80&bg=white"
    },
    {
        id: 3,
        nombre: "Auriculares Bluetooth",
        descripcion: "Auriculares inalámbricos con cancelación de ruido activa.",
        precio: 120,
        imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        nombre: "Teclado Mecánico",
        descripcion: "Teclado mecánico RGB.",
        precio: 190,
        imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        nombre: "Mouse Gamer",
        descripcion: "Mouse ergonómico de alta precisión.",
        precio: 160,
        imagen: "https://images.unsplash.com/photo-1618499890638-3a0dd4b278b7?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        nombre: "Monitor 4K",
        descripcion: "Monitor 4K UHD con tasa de refresco de 400Hz.",
        precio: 2500,
        imagen: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        nombre: "Silla Gamer",
        descripcion: "Silla ergonómica con soporte lumbar y reposapiés ajustable.",
        precio: 250,
        imagen: "https://images.unsplash.com/photo-1613413561312-e329d024ed65?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 8,
        nombre: "Disco Duro Externo",
        descripcion: "Almacenamiento portátil SSD de 28TB ultra rápido.",
        precio: 110,
        imagen: "https://images.unsplash.com/photo-1613070541337-b40942ee6527?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 9,
        nombre: "Tarjeta Gráfica",
        descripcion: "GPU NVIDIA RTX 1080 Ti con 16GB GDDR7X.",
        precio: 2700,
        imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 10,
        nombre: "Fuente de Poder",
        descripcion: "Fuente de poder de 1000W certificada.",
        precio: 260,
        imagen: "https://i0.wp.com/www.deskdecode.com/wp-content/uploads/2017/01/Corsair-CS450M-Copy-min.png?w=500&ssl=1"
    }
];

const carritoDeCompras = {
    tienda: [],
    carrito: []
};

if (localStorage.getItem("tienda")) {
    carritoDeCompras.tienda = JSON.parse(localStorage.getItem("tienda"));
} else {
    carritoDeCompras.tienda = productosIniciales;
    localStorage.setItem("tienda", JSON.stringify(productosIniciales));
}

if (localStorage.getItem("carrito")) {
    carritoDeCompras.carrito = JSON.parse(localStorage.getItem("carrito"));
}

function actualizarAlmacenamiento() {
    localStorage.setItem("tienda", JSON.stringify(carritoDeCompras.tienda));
    localStorage.setItem("carrito", JSON.stringify(carritoDeCompras.carrito));
}

function cargarProductosRemotos() {
    fetch("db/db.json")
        .then(response => response.json())
        .then(data => {
            if (!localStorage.getItem("tienda")) {
                carritoDeCompras.tienda = data.productos;
                actualizarAlmacenamiento();
                renderizarProductosAdmin();
                renderizarProductosCompra();
            }
        })
        .catch(() => {
            console.log("No se pudieron cargar datos remotos, usando datos existentes.");
        });
}

function renderizarProductosAdmin() {
    const contenedor = document.getElementById("adminProductos");
    contenedor.innerHTML = "";
    carritoDeCompras.tienda.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x150?text=Imagen+no+disponible'">
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion}</p>
            <p class="price">$${prod.precio}</p>
            <button onclick="eliminarProductoTienda(${prod.id})">Eliminar</button>
        `;
        contenedor.appendChild(card);
    });
}

function renderizarProductosCompra() {
    const contenedor = document.getElementById("productosCompra");
    contenedor.innerHTML = "";
    carritoDeCompras.tienda.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x150?text=Imagen+no+disponible'">
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion}</p>
            <p class="price">$${prod.precio}</p>
            <button onclick="agregarAlCarrito(${prod.id})">Comprar</button>
        `;
        contenedor.appendChild(card);
    });
    actualizarCarrito();
}

function buscarProducto(id) {
    for (const prod of carritoDeCompras.tienda) {
        if (prod.id === id) return prod;
    }
    return null;
}

function agregarAlCarrito(id) {
    const producto = buscarProducto(id);
    if (producto) {
        let item = carritoDeCompras.carrito.find(i => i.id === id);
        if (item) {
            item.cantidad++;
        } else {
            carritoDeCompras.carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
        }
        actualizarAlmacenamiento();
    }
    actualizarCarrito();
    Swal.fire({ icon: 'success', title: 'Producto agregado', timer: 1500, showConfirmButton: false });
}

function actualizarCarrito() {
    const contenedor = document.getElementById("carritoContainer");
    contenedor.innerHTML = "";
    let total = 0;
    carritoDeCompras.carrito.forEach(item => {
        total += item.precio * item.cantidad;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span>${item.nombre} - $${item.precio} x ${item.cantidad}</span>
            <div class="quantity-controls">
                <button onclick="modificarCantidad(${item.id}, 1)">+</button>
                <button onclick="modificarCantidad(${item.id}, -1)">-</button>
            </div>
        `;
        contenedor.appendChild(div);
    });
    document.getElementById("totalDisplay").textContent = "Total: $" + total;
    localStorage.setItem("carrito", JSON.stringify(carritoDeCompras.carrito));
}

function modificarCantidad(id, delta) {
    for (let i = 0; i < carritoDeCompras.carrito.length; i++) {
        if (carritoDeCompras.carrito[i].id === id) {
            carritoDeCompras.carrito[i].cantidad += delta;
            if (carritoDeCompras.carrito[i].cantidad < 1) {
                carritoDeCompras.carrito.splice(i, 1);
            }
            break;
        }
    }
    actualizarCarrito();
}

function eliminarProductoTienda(id) {
    carritoDeCompras.tienda = carritoDeCompras.tienda.filter(prod => prod.id !== id);
    carritoDeCompras.carrito = carritoDeCompras.carrito.filter(item => item.id !== id);
    actualizarAlmacenamiento();
    renderizarProductosAdmin();
    renderizarProductosCompra();
    actualizarCarrito();
    Swal.fire({ icon: 'info', title: 'Producto eliminado', timer: 1000, showConfirmButton: false });
}

document.getElementById("btnReset").addEventListener("click", function() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esto restablecerá todos los productos y vaciará el carrito!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, reiniciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carritoDeCompras.tienda = [...productosIniciales];
            carritoDeCompras.carrito = [];
            
            localStorage.setItem("tienda", JSON.stringify(productosIniciales));
            localStorage.setItem("carrito", JSON.stringify([]));
            
            renderizarProductosAdmin();
            renderizarProductosCompra();
            actualizarCarrito();
            
            Swal.fire(
                '¡Sistema reiniciado!',
                'Todos los productos han sido restablecidos.',
                'success'
            );
        }
    });
});

function vaciarCarrito() {
    carritoDeCompras.carrito = [];
    actualizarCarrito();
    Swal.fire({ icon: 'warning', title: 'Carrito vaciado', timer: 1000, showConfirmButton: false });
}

function finalizarCompra() {
    if (carritoDeCompras.carrito.length === 0) {
        Swal.fire({ icon: 'error', title: 'El carrito está vacío', timer: 1500, showConfirmButton: false });
    } else {
        Swal.fire({ icon: 'success', title: 'Compra finalizada', timer: 1500, showConfirmButton: false });
        carritoDeCompras.carrito = [];
        actualizarCarrito();
    }
}

document.getElementById("btnAdmin").addEventListener("click", () => {
    document.getElementById("seccionClave").classList.remove("hidden");
    document.getElementById("seccionCompra").classList.add("hidden");
});

document.getElementById("btnValidarAdmin").addEventListener("click", () => {
    const claveIngresada = document.getElementById("claveAdmin").value;
    const mensajeError = document.getElementById("mensajeError");
    if (claveIngresada === "1234") {
        document.getElementById("seccionClave").classList.add("hidden");
        document.getElementById("seccionAdmin").classList.remove("hidden");
        renderizarProductosAdmin();
    } else {
        mensajeError.classList.remove("hidden");
    }
});

document.getElementById("btnCompra").addEventListener("click", () => {
    document.getElementById("seccionAdmin").classList.add("hidden");
    document.getElementById("seccionClave").classList.add("hidden");
    document.getElementById("seccionCompra").classList.remove("hidden");
    renderizarProductosCompra();
    actualizarCarrito();
});

document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);
document.getElementById("finalizarCompra").addEventListener("click", finalizarCompra);

document.getElementById("formularioAdmin").addEventListener("submit", function (event) {
    event.preventDefault();
    const nombre = document.getElementById("nombreProducto").value;
    const imagenFile = document.getElementById("imagenProducto").files[0];
    const descripcion = document.getElementById("descripcionProducto").value;
    const precio = parseFloat(document.getElementById("precioProducto").value);
    if (nombre !== "" && imagenFile && descripcion !== "" && precio > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const id = Date.now();
            carritoDeCompras.tienda.push({ id, nombre, imagen: e.target.result, descripcion, precio });
            actualizarAlmacenamiento();
            renderizarProductosAdmin();
            renderizarProductosCompra();
            document.getElementById("formularioAdmin").reset();
            Swal.fire({ icon: 'success', title: 'Producto agregado', timer: 1500, showConfirmButton: false });
        };
        reader.readAsDataURL(imagenFile);
    }
});

if (!localStorage.getItem("tienda")) {
    cargarProductosRemotos();
} else {
    renderizarProductosCompra();
    actualizarCarrito();
}