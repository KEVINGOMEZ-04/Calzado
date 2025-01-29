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

// Aplicar filtros
function applyFilters() {
    // Obtener los valores de los filtros
    const minPrice = parseInt(document.getElementById('min-precio').value || '0', 10);
    const maxPrice = parseInt(document.getElementById('max-precio').value || 'Infinity', 10);
    const selectedColors = Array.from(document.querySelectorAll('.filtro-color input:checked')).map(input => input.id);
    const selectedSize = document.getElementById('select-talla').value;

    // Seleccionar todos los productos
    const products = document.querySelectorAll('.producto');
    let foundProducts = false; // Variable para verificar si encontramos productos

    // Verificar si los precios son válidos
    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
        alert("Por favor, ingresa precios válidos.");
        return;
    }

    // Filtrar productos
    products.forEach(product => {
        const priceElement = product.querySelector('p');
        const price = priceElement ? parseInt(priceElement.textContent.replace(/[^0-9]/g, ''), 10) : 0;
        const colors = product.dataset.colores ? product.dataset.colores.split(',') : [];
        const sizes = product.dataset.tallas ? product.dataset.tallas.split(',') : [];

        // Validar filtros
        const matchesPrice = price >= minPrice && price <= maxPrice;
        const matchesColor = selectedColors.length === 0 || selectedColors.some(color => colors.includes(color));
        const matchesSize = selectedSize === "todos" || sizes.includes(selectedSize);

        // Mostrar u ocultar productos según los filtros
        if (matchesPrice && matchesColor && matchesSize) {
            product.style.display = 'block';
            foundProducts = true;
        } else {
            product.style.display = 'none';
        }
    });

    // Mostrar el mensaje si no hay productos
    const noProductsMessage = document.getElementById('no-products-message');
    if (noProductsMessage) {
        noProductsMessage.style.display = foundProducts ? 'none' : 'block';
    }
}

// Reiniciar filtros
function resetFilters() {
    // Limpiar campos de los filtros
    document.getElementById('min-precio').value = '';
    document.getElementById('max-precio').value = '';
    document.querySelectorAll('.filtro-color input').forEach(input => input.checked = false);
    document.getElementById('select-talla').value = 'todos';

    // Mostrar todos los productos
    const products = document.querySelectorAll('.producto');
    products.forEach(product => {
        product.style.display = 'block';
    });

    // Ocultar el mensaje de no productos
    const noProductsMessage = document.getElementById('no-products-message');
    if (noProductsMessage) {
        noProductsMessage.style.display = 'none';
    }
}

// Menú hamburguesa
document.addEventListener('DOMContentLoaded', function () {
    // Obtener el ícono de hamburguesa y el menú
    const hamburger = document.getElementById('hamburger-icon');
    const navbarMenu = document.getElementById('navbar-menu');

    // Verificar si los elementos existen antes de agregar el evento
    if (hamburger && navbarMenu) {
        hamburger.addEventListener('click', () => {
            console.log("Ícono de hamburguesa clickeado"); // Depuración
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

// Botón de Volver arriba
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
