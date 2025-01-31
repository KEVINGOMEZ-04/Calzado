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

// Toggle carrito
if (cartIcon && cartContainer) {
    cartIcon.addEventListener("click", () => {
        cartContainer.classList.toggle("hidden");
    });
}

// Añadir producto al carrito
function addToCart(productName, price) {
    cartItems.push({ productName, price });
    total += parseFloat(price);
    updateCart();
}

// Actualizar carrito
function updateCart() {
    if (cartItemsContainer && cartTotal && cartCount) {
        cartItemsContainer.innerHTML = ""; // Limpiar lista
        cartItems.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.productName} - $${item.price.toFixed(2)}
                <button onclick="removeFromCart(${index})">X</button>
            `;
            cartItemsContainer.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cartItems.length;
    }
}

// Eliminar producto del carrito
function removeFromCart(index) {
    total -= cartItems[index].price;
    cartItems.splice(index, 1);
    updateCart();
}

// Finalizar compra
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        const orderCode = generateOrderCode();
        alert(`Código de pedido: ${orderCode}`);
        navigator.clipboard.writeText(orderCode); // Copiar al portapapeles
        cartItems = [];
        total = 0.0;
        updateCart();
    });
}

// Generar código de pedido
function generateOrderCode() {
    return cartItems
        .map(item => `${item.productName}-${item.price.toFixed(2)}`)
        .join("|");
}

// Función para formatear el precio con separación de miles
function formatPrice(input) {
    let value = input.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (value) {
        value = Number(value).toLocaleString('es-CO'); // Formatea con separación de miles
    }
    input.value = value;
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
    
    // Obtener los valores de los filtros
    const minPrice = document.getElementById('min-precio').value.replace(/\D/g, '');
    const maxPrice = document.getElementById('max-precio').value.replace(/\D/g, '');
    const selectedColors = Array.from(document.querySelectorAll('.filtro-color input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const selectedSize = document.getElementById('select-talla').value;

    // Obtener todos los productos
    const productos = document.querySelectorAll('.producto');

    // Recorrer cada producto y aplicar los filtros
    productos.forEach(producto => {
        const precio = producto.querySelector('p').textContent.replace(/\D/g, '');
        const colores = producto.getAttribute('data-colores').split(',');
        const tallas = producto.getAttribute('data-tallas').split(',');

        // Verificar filtro por precio
        const precioValido = (!minPrice || precio >= minPrice) && (!maxPrice || precio <= maxPrice);

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
// Función para restablecer el catálogo a su estado inicial
function resetearCatalogo() {
    const productos = document.querySelectorAll('.producto');
    productos.forEach(producto => {
        producto.style.display = 'block'; // Mostrar todos los productos
    });

    // Restablecer el menú desplegable de "Organizar por"
    document.getElementById('organizar-por').value = 'menor-mayor'; // O el valor predeterminado que desees

    // Restablecer los filtros (opcional, si deseas que también se limpien los filtros)
    resetFilters();
}
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
