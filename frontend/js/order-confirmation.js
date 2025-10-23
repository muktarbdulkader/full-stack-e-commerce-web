// Order Confirmation Page Logic

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderNavbar();
    renderFooter();

    const orderId = getUrlParam('id');

    if (!orderId) {
        window.location.href = 'index.html';
        return;
    }

    // Load order details
    loadOrder(orderId);
});

function getOrderId() {
    return getUrlParam('id');
}

// Load order details
async function loadOrder(orderId) {
    try {
        console.log('Loading order with ID:', orderId);
        const response = await API.orders.getById(orderId);
        console.log('API response:', response);
        
        // Handle different response structures
        let order = null;
        
        if (response && response.success && response.order) {
            order = response.order;
        } else if (response && response.id) {
            // Response is the order itself
            order = response;
        } else if (response && !response.success) {
            // API returned error but we should check localStorage directly
            console.log('API returned error, checking localStorage directly...');
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            console.log('Orders in localStorage:', orders);
            order = orders.find(o => o.id === orderId);
            
            if (!order) {
                throw new Error('Order not found in localStorage');
            }
        } else {
            throw new Error('Order not found');
        }
        
        // Ensure order has required properties
        if (!order || !order.id) {
            throw new Error('Invalid order data');
        }

        // Check if the order belongs to the current user
        const currentUser = Auth.getUser();
        if (currentUser && order.userId !== currentUser.id) {
            throw new Error('Order not found or access denied');
        }

        console.log('Order loaded successfully:', order);
        renderConfirmation(order);
    } catch (error) {
        console.error('Error loading order:', error);
        
        // Last attempt: check localStorage directly
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const order = orders.find(o => o.id === orderId);
            
            if (order) {
                console.log('Found order in localStorage on retry:', order);
                renderConfirmation(order);
                return;
            }
        } catch (e) {
            console.error('Failed to retrieve from localStorage:', e);
        }
        
        document.getElementById('confirmationContent').innerHTML = renderEmptyState(
            '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            'Order Not Found',
            'We could not find your order. Please check your order number and try again.',
            'Back to Home',
            'index.html'
        );
    }
}

// Render confirmation
function renderConfirmation(order) {
    // Ensure order has required properties with fallbacks
    const orderId = order?.id || 'N/A';
    const orderStatus = order?.status || 'Pending';
    const orderTotal = order?.total || 0;
    const customerEmail = order?.shipping?.email || order?.email || 'your email';
    
    const html = `
        <div class="confirmation-card" style="background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; margin-bottom: 2rem;">
            <div class="success-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            
            <h1 class="confirmation-title" style="font-size: 2.5rem; color: #10b981; margin-bottom: 1rem;">Order Confirmed!</h1>
            <p class="confirmation-subtitle" style="font-size: 1.125rem; color: var(--gray-600); margin-bottom: 2rem;">Thank you for your purchase. We've received your order and will start processing it soon.</p>
            
            <div class="order-number" style="background: var(--gray-50); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <span class="order-number-label" style="display: block; font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">Order Number</span>
                <div class="order-number-value" style="font-size: 1.5rem; font-weight: 700; color: var(--primary); font-family: monospace;">${orderId}</div>
            </div>

            <div class="confirmation-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem;">
                <a href="track-order.html?id=${orderId}" class="btn btn-primary" style="min-width: 200px;">
                    📦 Track Order
                </a>
                <a href="shop.html" class="btn btn-secondary" style="min-width: 200px;">
                    🛍️ Continue Shopping
                </a>
            </div>

            <div class="info-box" style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 1.5rem; display: flex; gap: 1rem; align-items: start; text-align: left;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="flex-shrink: 0; margin-top: 0.25rem;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div class="info-box-content">
                    <h4 style="margin: 0 0 0.5rem 0; color: #1e40af;">Order Confirmation Sent</h4>
                    <p style="margin: 0; color: #1e40af;">A confirmation email has been sent to <strong>${customerEmail}</strong></p>
                </div>
            </div>
        </div>

        <div class="order-details-card" style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div class="details-section" style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--gray-200);">
                <h3 style="margin-bottom: 1.5rem; color: var(--gray-900);">📋 Order Details</h3>
                <div class="details-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                    <div class="detail-item">
                        <span class="detail-label" style="display: block; font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Order Date</span>
                        <span class="detail-value" style="font-weight: 600; color: var(--gray-900);">${formatDate(order?.createdAt || new Date())}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label" style="display: block; font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Payment Method</span>
                        <span class="detail-value" style="font-weight: 600; color: var(--gray-900);">${order?.payment?.method === 'card' ? 'Credit/Debit Card' : order?.payment?.method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label" style="display: block; font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Status</span>
                        <span class="detail-value">
                            <span class="badge badge-warning" style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">${orderStatus}</span>
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label" style="display: block; font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem;">Estimated Delivery</span>
                        <span class="detail-value" style="font-weight: 600; color: var(--gray-900);">${formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000))}</span>
                    </div>
                </div>
            </div>

            ${order?.shipping ? `
            <div class="details-section" style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--gray-200);">
                <h3 style="margin-bottom: 1rem; color: var(--gray-900);">🚚 Shipping Address</h3>
                <p style="line-height: 1.8; color: var(--gray-700);">
                    <strong>${order.shipping.firstName || ''} ${order.shipping.lastName || ''}</strong><br>
                    ${order.shipping.address || ''}<br>
                    ${order.shipping.city || ''}, ${order.shipping.state || ''} ${order.shipping.zipCode || ''}<br>
                    📞 ${order.shipping.phone || ''}<br>
                    ✉️ ${order.shipping.email || ''}
                </p>
            </div>
            ` : ''}

            ${order?.items && order.items.length > 0 ? `
            <div class="details-section" style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--gray-200);">
                <h3 style="margin-bottom: 1.5rem; color: var(--gray-900);">📦 Order Items</h3>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item" style="display: flex; gap: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px; margin-bottom: 1rem;">
                            <img src="${item?.product?.image || 'https://via.placeholder.com/80'}" alt="${item?.product?.name || 'Product'}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/80'">
                            <div class="order-item-details" style="flex: 1;">
                                <div class="order-item-name" style="font-weight: 600; color: var(--gray-900); margin-bottom: 0.25rem;">${item?.product?.name || 'Product'}</div>
                                <div class="order-item-meta" style="font-size: 0.875rem; color: var(--gray-600);">Quantity: ${item?.quantity || 1}</div>
                            </div>
                            <div class="order-item-price" style="font-weight: 700; color: var(--primary);">${formatPrice((item?.product?.price || 0) * (item?.quantity || 1))}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <div class="details-section">
                <h3 style="margin-bottom: 1.5rem; color: var(--gray-900);">💰 Order Summary</h3>
                <div class="order-summary">
                    <div class="summary-row" style="display: flex; justify-content: space-between; padding: 0.75rem 0; color: var(--gray-700);">
                        <span>Subtotal</span>
                        <span>${formatPrice(order?.subtotal || orderTotal)}</span>
                    </div>
                    <div class="summary-row" style="display: flex; justify-content: space-between; padding: 0.75rem 0; color: var(--gray-700);">
                        <span>Shipping</span>
                        <span>${(order?.shipping?.cost === 0 || !order?.shipping?.cost) ? 'FREE' : formatPrice(order.shipping.cost)}</span>
                    </div>
                    <div class="summary-row" style="display: flex; justify-content: space-between; padding: 0.75rem 0; color: var(--gray-700);">
                        <span>Tax</span>
                        <span>${formatPrice(order?.tax || 0)}</span>
                    </div>
                    <div class="summary-total" style="display: flex; justify-content: space-between; padding: 1rem 0; border-top: 2px solid var(--gray-300); margin-top: 0.5rem; font-size: 1.25rem; font-weight: 700; color: var(--gray-900);">
                        <span>Total</span>
                        <span style="color: var(--primary);">${formatPrice(orderTotal)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('confirmationContent').innerHTML = html;
}
