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
cartIcon.addEventListener("click", () => {
    cartContainer.classList.toggle("hidden");
});

// Añadir producto al carrito
function addToCart(productName, price) {
    cartItems.push({ productName, price });
    total += parseFloat(price);
    updateCart();
}

// Actualizar carrito
function updateCart() {
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

// Eliminar producto del carrito
function removeFromCart(index) {
    total -= cartItems[index].price;
    cartItems.splice(index, 1);
    updateCart();
}

// Finalizar compra
checkoutBtn.addEventListener("click", () => {
    const orderCode = generateOrderCode();
    alert(`Código de pedido: ${orderCode}`);
    navigator.clipboard.writeText(orderCode); // Copiar al portapapeles
    cartItems = [];
    total = 0.0;
    updateCart();
});

// Generar código de pedido
function generateOrderCode() {
    return cartItems
        .map(item => `${item.productName}-${item.price.toFixed(2)}`)
        .join("|");
}
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
        const price = priceElement ? parseInt(priceElement.textContent.replace(/[^0-9]/g, ''), 10) : 0; // Eliminar comas y convertir a número
        const colors = product.dataset.colores ? product.dataset.colores.split(',') : [];
        const sizes = product.dataset.tallas ? product.dataset.tallas.split(',') : [];

        // Validar filtros
        const matchesPrice = price >= minPrice && price <= maxPrice;
        const matchesColor = selectedColors.length === 0 || selectedColors.some(color => colors.includes(color));
        const matchesSize = selectedSize === "todos" || sizes.includes(selectedSize);

        // Mostrar u ocultar productos según los filtros
        if (matchesPrice && matchesColor && matchesSize) {
            product.style.display = 'block';
            foundProducts = true; // Si encontramos productos que coinciden
        } else {
            product.style.display = 'none';
        }
    });

    // Mostrar el mensaje si no hay productos
    const noProductsMessage = document.getElementById('no-products-message');
    if (foundProducts) {
        noProductsMessage.style.display = 'none'; // Ocultar mensaje si hay productos
    } else {
        noProductsMessage.style.display = 'block'; // Mostrar mensaje si no hay productos
    }
}

