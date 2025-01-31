// Variables globales
let cartItems = [];
let total = 0.0;

// Referencias a elementos del DOM
const cartIcon = document.getElementById("cart-icon");
const cartContainer = document.getElementById("cart-container");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// Carrito y funcionalidades globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function actualizarCarrito() {
    const contador = document.querySelector('.carrito-contador');
    const itemsContainer = document.querySelector('.carrito-items');
    const totalContainer = document.querySelector('.carrito-total span');
    
    contador.textContent = carrito.length;
    itemsContainer.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <span>${item.nombre}</span>
            <span>$${item.precio.toLocaleString()}</span>
        </div>
    `).join('');
    
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    totalContainer.textContent = total.toLocaleString();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function addToCart(nombre, precio) {
    const talla = document.querySelector('.talla-item.selected')?.dataset.talla || 'Sin talla';
    const color = document.querySelector('.color-btn.selected')?.dataset.color || 'Sin color';
    
    carrito.push({
        nombre: `${nombre} - Talla ${talla}, Color ${color}`,
        precio: precio
    });
    
    actualizarCarrito();
    mostrarNotificacion('¡Producto añadido!');
}

function toggleCarrito() {
    document.querySelector('.carrito-contenido').classList.toggle('mostrar');
}

function finalizarCompra() {
    const pedido = carrito.map(item => `• ${item.nombre}: $${item.precio.toLocaleString()}`).join('\n');
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    const codigo = `PEDIDO CALZADOCALIDOSO\n${pedido}\n\nTOTAL: $${total.toLocaleString()}`;
    
    navigator.clipboard.writeText(codigo);
    window.open(`https://wa.me/573005744668?text=${encodeURIComponent(codigo)}`, '_blank');
    carrito = [];
    actualizarCarrito();
}

document.addEventListener('DOMContentLoaded', actualizarCarrito);

// Notificación Flotante
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}



// Inicializar Carrito al cargar
document.addEventListener('DOMContentLoaded', actualizarCarrito);

// Función para formatear el precio con separación de miles
function formatPrice(input) {
    let value = input.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (value) {
        value = Number(value).toLocaleString('es-CO'); // Formatea con separación de miles
    }
    input.value = value;
}

// Función para convertir precios formateados a números
function convertirPrecioANumero(precioFormateado) {
    return parseInt(precioFormateado.replace(/\D/g, ''), 10);
}

// Función para restablecer el catálogo a su estado inicial
function resetearCatalogo() {
    const productos = document.querySelectorAll('.producto');
    productos.forEach(producto => {
        producto.style.display = 'block'; // Mostrar todos los productos
    });
}

// Función para aplicar los filtros
function applyFilters() {
    // Restablecer el catálogo antes de aplicar los filtros
    resetearCatalogo();

    // Obtener los valores de los filtros y convertirlos a números
    const minPrice = convertirPrecioANumero(document.getElementById('min-precio').value);
    const maxPrice = convertirPrecioANumero(document.getElementById('max-precio').value);
    const selectedColors = Array.from(document.querySelectorAll('.filtro-color input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const selectedSize = document.getElementById('select-talla').value;

    // Obtener todos los productos
    const productos = document.querySelectorAll('.producto');

    // Recorrer cada producto y aplicar los filtros
    productos.forEach(producto => {
        const precioProducto = convertirPrecioANumero(producto.querySelector('p').textContent);
        const colores = producto.getAttribute('data-colores').split(',');
        const tallas = producto.getAttribute('data-tallas').split(',');

        // Verificar filtro por precio
        const precioValido = (isNaN(minPrice) || precioProducto >= minPrice) &&
                             (isNaN(maxPrice) || precioProducto <= maxPrice);

        // Verificar filtro por color
        const colorValido = selectedColors.length === 0 || selectedColors.some(color => colores.includes(color));

        // Verificar filtro por talla
        const tallaValida = selectedSize === 'todos' || tallas.includes(selectedSize);

        // Mostrar u ocultar el producto según los filtros
        if (precioValido && colorValido && tallaValida) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });

    // Mostrar mensaje si no hay productos que coincidan
    const noProductsMessage = document.getElementById('no-products-message');
    const visibleProducts = Array.from(productos).filter(producto => producto.style.display !== 'none');

    if (visibleProducts.length === 0) {
        noProductsMessage.style.display = 'flex';
    } else {
        noProductsMessage.style.display = 'none';
    }
}

// Función para reiniciar los filtros
function resetFilters() {
    // Limpiar los inputs de precio
    document.getElementById('min-precio').value = '';
    document.getElementById('max-precio').value = '';

    // Desmarcar todos los checkboxes de color
    document.querySelectorAll('.filtro-color input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Restablecer la selección de talla
    document.getElementById('select-talla').value = 'todos';

    // Aplicar los filtros (esto mostrará todos los productos)
    applyFilters();
}

// Función para organizar productos
function organizarProductos(criterio) {
    const productosContainer = document.querySelector('.grid-productos');
    const productos = Array.from(productosContainer.querySelectorAll('.producto'));

    // Función para obtener el precio de un producto
    const obtenerPrecio = (producto) => {
        const precioTexto = producto.querySelector('p').textContent.replace(/\D/g, '');
        return parseInt(precioTexto, 10);
    };

    // Función para obtener las ventas de un producto
    const obtenerVentas = (producto) => {
        return parseInt(producto.getAttribute('data-ventas'), 10) || 0;
    };

    // Ordenar o filtrar productos según el criterio
    if (criterio === 'menor-mayor') {
        productos.sort((a, b) => obtenerPrecio(a) - obtenerPrecio(b));
    } else if (criterio === 'mayor-menor') {
        productos.sort((a, b) => obtenerPrecio(b) - obtenerPrecio(a));
    } else if (criterio === 'ofertas') {
        // Filtrar productos en oferta
        productos.forEach(producto => {
            const esOferta = producto.getAttribute('data-oferta') === 'true';
            producto.style.display = esOferta ? 'block' : 'none';
        });
        return; // No es necesario reordenar, solo filtrar
    } else if (criterio === 'mas-vendidos') {
        // Ordenar productos por ventas (de mayor a menor)
        productos.sort((a, b) => obtenerVentas(b) - obtenerVentas(a));
    }

    // Limpiar el contenedor y agregar los productos ordenados
    productosContainer.innerHTML = '';
    productos.forEach(producto => productosContainer.appendChild(producto));
}

// Menú hamburguesa
document.addEventListener('DOMContentLoaded', function () {
    // Obtener el ícono de hamburguesa y el menú
    const hamburger = document.getElementById('hamburger-icon');
    const navbarMenu = document.getElementById('navbar-menu');

    // Verificar si los elementos existen antes de agregar el evento
    if (hamburger && navbarMenu) {
        hamburger.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });

        // Cerrar el menú al hacer clic fuera de él
        document.addEventListener('click', (event) => {
            if (!navbarMenu.contains(event.target) && !hamburger.contains(event.target)) {
                navbarMenu.classList.remove('active');
            }
        });
    } else {
        console.error("No se encontró el ícono de hamburguesa o el menú.");
    }
});

// Mostrar/ocultar filtros en móviles
const mostrarFiltrosBtn = document.getElementById('mostrar-filtros-btn');
if (mostrarFiltrosBtn) {
    mostrarFiltrosBtn.addEventListener('click', () => {
        const filtros = document.getElementById('filtros');
        filtros.classList.toggle('active');
    });
}
// Selección de color
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remover selección previa
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        
        // Añadir selección actual
        this.classList.add('selected');
    });
});
// Selección de talla
document.querySelectorAll('.talla-btn:not(.agotado)').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remover selección previa
        document.querySelectorAll('.talla-btn').forEach(t => t.classList.remove('selected'));
        
        // Añadir selección actual
        this.classList.add('selected');
    });
});
