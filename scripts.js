let cart = [];
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const totalPriceContainer = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product');
        const price = parseFloat(button.getAttribute('data-price'));
        addToCart(productId, price);
    });
});

function addToCart(productId, price) {
    cart.push({ productId, price });
    cartCount.textContent = cart.length;
    updateCart();
}

function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const productDiv = document.createElement('div');
        productDiv.textContent = `Producto ${item.productId}: $${item.price}`;
        cartItemsContainer.appendChild(productDiv);
        total += item.price;
    });
    totalPriceContainer.textContent = `Total: $${total}`;
}

document.getElementById('viewCartBtn').addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

document.getElementById('closeModal').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    // Aquí se podría integrar el proceso de generar el código de pedido y redirigir a WhatsApp
    alert("Redirigiendo a WhatsApp para completar la compra.");
});
