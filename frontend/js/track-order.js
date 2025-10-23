// Track Order Page Logic

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderNavbar();
    renderFooter();

    const trackForm = document.getElementById('trackForm');
    const orderStatusEl = document.getElementById('orderStatus');

    // Check if order ID is in URL
    const urlOrderId = getUrlParam('id');
    if (urlOrderId) {
        document.getElementById('orderNumber').value = urlOrderId;
        trackOrder(urlOrderId);
    }

    // Handle form submission
    trackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const orderNumber = document.getElementById('orderNumber').value.trim();
        
        if (!orderNumber) {
            toast.error('Please enter an order number');
            return;
        }

        trackOrder(orderNumber);
    });
});

// Track order function
async function trackOrder(orderId) {
    const orderStatusEl = document.getElementById('orderStatus');
    orderStatusEl.style.display = 'none';
    orderStatusEl.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
    orderStatusEl.style.display = 'block';

    console.log('Tracking order:', orderId);
    
    // Debug: Check all orders in storage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('All orders in storage:', allOrders);
    console.log('Looking for order ID:', orderId);

    try {
        const response = await API.orders.getById(orderId);
        console.log('API response:', response);
        
        if (!response.success) {
            throw new Error('Order not found');
        }

        // Check if the order belongs to the current user
        const currentUser = Auth.getUser();
        console.log('Current user:', currentUser);
        console.log('Order userId:', response.order.userId);
        
        // If user is logged in, verify order ownership
        if (currentUser && response.order.userId && response.order.userId !== currentUser.id) {
            console.log('Order belongs to different user');
            throw new Error('Order not found or access denied');
        }
        
        // If no user is logged in but order has a userId, allow it (guest checkout scenario)
        // This allows tracking orders even after logout if you have the order number

        renderOrderStatus(response.order);
    } catch (error) {
        console.error('Error tracking order:', error);
        console.error('Error details:', error.message);
        orderStatusEl.innerHTML = `
            <div class="order-status-card">
                ${renderEmptyState(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>',
                    'Order Not Found',
                    'We could not find an order with that number. Please check and try again.',
                    '',
                    ''
                )}
            </div>
        `;
        toast.error('Order not found');
    }
}

// Render order status
function renderOrderStatus(order) {
    const status = order.status || 'processing';
    const statusText = {
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    };

    const timeline = [
        {
            title: 'Order Placed',
            date: formatDate(order.createdAt || new Date()),
            description: 'Your order has been received and is being processed',
            active: true
        },
        {
            title: 'Processing',
            date: status !== 'processing' ? formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) : null,
            description: 'We are preparing your items for shipment',
            active: status !== 'processing'
        },
        {
            title: 'Shipped',
            date: status === 'shipped' || status === 'delivered' ? formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)) : null,
            description: 'Your package is on its way',
            active: status === 'shipped' || status === 'delivered'
        },
        {
            title: 'Delivered',
            date: status === 'delivered' ? formatDate(new Date()) : null,
            description: 'Your order has been delivered',
            active: status === 'delivered'
        }
    ];

    const html = `
        <div class="order-status-card">
            <div class="status-header">
                <div>
                    <h2>Order ${order.id}</h2>
                    <p style="color: var(--gray-600); margin-top: 0.5rem;">
                        Placed on ${formatDate(order.createdAt || new Date())}
                    </p>
                </div>
                <span class="badge ${status === 'delivered' ? 'badge-success' : status === 'cancelled' ? 'badge-danger' : 'badge-warning'}" style="font-size: 1rem; padding: 0.5rem 1rem;">
                    ${statusText[status]}
                </span>
            </div>

            <div style="padding: 2rem 0; border-bottom: 1px solid var(--gray-200);">
                <h3 style="margin-bottom: 1.5rem;">Delivery Status</h3>
                <div class="status-timeline">
                    ${timeline.map((item, index) => `
                        <div class="timeline-item ${item.active ? 'active' : ''}">
                            <div class="timeline-icon"></div>
                            <div class="timeline-content">
                                <h4>${item.title}</h4>
                                ${item.date ? `<div class="date">${item.date}</div>` : ''}
                                <p>${item.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="padding: 2rem 0; border-bottom: 1px solid var(--gray-200);">
                <h3 style="margin-bottom: 1.5rem;">Shipping Address</h3>
                <p style="color: var(--gray-700);">
                    ${order.shipping.firstName} ${order.shipping.lastName}<br>
                    ${order.shipping.address}<br>
                    ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}<br>
                    ${order.shipping.phone}
                </p>
            </div>

            <div style="padding: 2rem 0;">
                <h3 style="margin-bottom: 1.5rem;">Order Items</h3>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.product.image}" alt="${item.product.name}" class="order-item-image" onerror="this.src='https://via.placeholder.com/80'">
                            <div class="order-item-details">
                                <div class="order-item-name">${item.product.name}</div>
                                <div class="order-item-meta">Quantity: ${item.quantity}</div>
                            </div>
                            <div class="order-item-price">${formatPrice(item.product.price * item.quantity)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-summary" style="margin-top: 1.5rem;">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>${formatPrice(order.subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>${order.shipping.cost === 0 ? 'FREE' : formatPrice(order.shipping.cost)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax</span>
                        <span>${formatPrice(order.tax)}</span>
                    </div>
                    <div class="summary-total">
                        <span>Total</span>
                        <span>${formatPrice(order.total)}</span>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center;">
                <a href="contact.html" class="btn btn-secondary">Contact Support</a>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        </div>
    `;

    const orderStatusEl = document.getElementById('orderStatus');
    orderStatusEl.innerHTML = html;
    orderStatusEl.style.display = 'block';
}
