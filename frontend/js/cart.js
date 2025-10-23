// Cart Page JavaScript

function renderCart() {
    const cart = API.cart.get();
    const container = document.getElementById('cartLayout');

    if (cart.length === 0) {
        container.innerHTML = renderEmptyState(
            '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--gray-300); margin: 0 auto;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
            'Your cart is empty',
            'Add some products to get started!',
            'Continue Shopping',
            'shop.html'
        );
        return;
    }

    const subtotal = calculateCartTotal(cart);
    const { shipping, tax, total } = calculateOrderTotals(subtotal);

    container.className = 'cart-layout with-items';
    container.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100'">
                    <div class="cart-item-info">
                        <h3>${item.product.name}</h3>
                        <p>${truncate(item.product.description, 100)}</p>
                        <span class="cart-item-price">${formatPrice(item.product.price)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-btn" onclick="removeFromCart('${item.product.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.product.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.product.id}', ${item.quantity + 1})" ${item.quantity >= item.product.stock ? 'disabled' : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                        <span style="color: var(--gray-900); font-weight: 500;">${formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="cart-summary">
            <h2>Order Summary</h2>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span>${formatPrice(tax)}</span>
            </div>
            <div class="summary-total">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
            </div>
            ${subtotal < 100 ? `
                <div class="free-shipping-notice">
                    Add ${formatPrice(100 - subtotal)} more for free shipping!
                </div>
            ` : ''}
            <a href="checkout.html" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">Proceed to Checkout</a>
            <a href="shop.html" class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">Continue Shopping</a>
        </div>
    `;
}

window.removeFromCart = function(productId) {
    API.cart.remove(productId);
    toast.success('Item removed from cart');
    renderCart();
    renderNavbar();
}

window.updateQuantity = function(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const cart = API.cart.get();
    const item = cart.find(i => i.product.id === productId);
    
    if (item && newQuantity > item.product.stock) {
        toast.error('Cannot exceed available stock');
        return;
    }

    API.cart.update(productId, newQuantity);
    renderCart();
    renderNavbar();
}

document.addEventListener('DOMContentLoaded', renderCart);
