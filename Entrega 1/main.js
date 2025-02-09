let CarritoDeCompras= {
    tienda: [],
    carrito: []
};

function ingresarProductosTienda(cantidad){
    let productos = [];
    while (productos.length < cantidad){
        let nombre = prompt("Ingrese el nombre del producto:");
        let precio = parseInt(prompt("Ingrese el precio del producto:"));
        productos.push({nombre: nombre, precio: precio});
    }
    for (const producto of productos){
        CarritoDeCompras.tienda.push(producto);
    }
    alert("Productos ingresados correctamente");
}

function agregarAlCarrito(producto, cantidad){
    for (const item of CarritoDeCompras.tienda){
        if (item.nombre === producto) {
            for (const elemento of CarritoDeCompras.carrito){
                if (elemento.nombre === producto) {
                    elemento.cantidad = elemento.cantidad + cantidad;
                    alert("Producto " + producto + " actualizado en el carrito");
                    return;
                }
            }
            CarritoDeCompras.carrito.push({ nombre: producto, precio: item.precio, cantidad: cantidad });
            alert("Producto " + producto + " agregado al carrito");
            return;
        }
    }
    alert("El producto no está disponible en la tienda");
}

function eliminarDelCarrito(producto){
    let nuevoCarrito = [];
    for (const item of CarritoDeCompras.carrito){
        if (item.nombre === producto){
            if (item.cantidad > 1){
                item.cantidad = item.cantidad - 1;
                alert("Se elimino UN/A " + producto + " del carrito");
                return;
            }
        } else {
            nuevoCarrito.push(item);
        }
    }
    CarritoDeCompras.carrito = nuevoCarrito;
    alert("Producto " + producto + " eliminado del carrito.");
}

function mostrarCarrito(){
    let mensaje = "Carrito de compras:\n";
    for (const item of CarritoDeCompras.carrito){
        mensaje = mensaje + item.nombre + " - Precio: " + item.precio + " - Cantidad: " + item.cantidad + "\n";
    }
    alert(mensaje);
}

function calcularTotal(){
    let total = 0;
    for (const item of CarritoDeCompras.carrito){
        total = total + (item.precio * item.cantidad);
    }
    alert("Total a pagar: " + total);
}

function menuPrincipal(){
    let opcion;
    do {
        opcion = parseInt(prompt("Seleccione una opción:\n1) Tareas administrativas\n2) Realizar compras\n3) Salir"));
        switch (opcion){
            case 1:
                let clave = prompt("Ingrese la clave de administrador (es 1234):");
                if (clave === "1234"){
                    let cantidad = parseInt(prompt("¿Cuántos productos desea ingresar en la tienda?"));
                    ingresarProductosTienda(cantidad);
                } else {
                    alert("Clave incorrecta. Acceso denegado.");
                }
                break;
            case 2:
                menuCompras();
                break;
            case 3:
                alert("Saliendo del sistema.");
                break;
            default:
                alert("Opción no válida.");
        }
    } while (opcion !== 3);
}

function menuCompras(){
    let opcion;
    do {
        opcion = parseInt(prompt("Seleccione una opción:\n1. Agregar producto al carrito\n2. Eliminar producto del carrito\n3. Mostrar carrito\n4. Calcular total\n5. Volver"));
        switch (opcion){
            case 1:
                let productoAgregar = prompt("Ingrese el nombre del producto que desea agregar al carrito:");
                let cantidadAgregar = parseInt(prompt("Ingrese la cantidad:"));
                agregarAlCarrito(productoAgregar, cantidadAgregar);
                break;
            case 2:
                let productoEliminar = prompt("Ingrese el nombre del producto que desea eliminar del carrito:");
                eliminarDelCarrito(productoEliminar);
                break;
            case 3:
                mostrarCarrito();
                break;
            case 4:
                calcularTotal();
                break;
            case 5:
                return;
            default:
                alert("Opción no válida.");
        }
    } while (opcion !== 5);
}

menuPrincipal();