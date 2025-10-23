// Product Detail Page Logic

const productId = getUrlParam('id');

if (!productId) {
    window.location.href = 'shop.html';
}

let currentProduct = null;
let quantity = 1;

// Load product details
async function loadProduct() {
    try {
        const { products } = await API.products.getAll();
        currentProduct = products.find(p => p.id === productId);

        if (!currentProduct) {
            throw new Error('Product not found');
        }

        renderProduct();
        renderBreadcrumb();
        loadRelatedProducts(currentProduct.category);
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('productContent').innerHTML = renderEmptyState(
            '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            'Product Not Found',
            'The product you are looking for does not exist or has been removed.',
            'Back to Shop',
            'shop.html'
        );
    }
}

// Render product details
function renderProduct() {
    const product = currentProduct;
    const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low' : 'out';
    const stockText = product.stock > 10 ? `${product.stock} in stock` : 
                      product.stock > 0 ? `Only ${product.stock} left!` : 'Out of stock';

    const html = `
        <div class="product-detail">
            <div class="product-images">
                <div class="main-image-container">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}" 
                        class="main-image"
                        onerror="this.src='https://via.placeholder.com/600?text=Product+Image'"
                    >
                </div>
                <div class="image-thumbnails">
                    ${[product.image, product.image, product.image, product.image].map((img, i) => `
                        <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeImage('${img}', ${i})">
                            <img src="${img}" alt="Thumbnail ${i + 1}" onerror="this.src='https://via.placeholder.com/150'">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="product-info">
                <span class="badge">${product.category}</span>
                <h1 class="product-title">${product.name}</h1>
                
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span style="color: var(--gray-900); margin-left: 0.25rem;">${product.rating}</span>
                    </div>
                    <span class="rating-text">(${Math.floor(Math.random() * 500 + 100)} reviews)</span>
                </div>

                <div class="price-wrapper">
                    <div class="product-price">${formatPrice(product.price)}</div>
                    ${product.price > 500 ? `
                        <div class="original-price">${formatPrice(product.price * 1.2)}</div>
                        <span class="discount-badge">Save 20%</span>
                    ` : ''}
                </div>

                <p class="product-description">${product.description}</p>

                <div class="product-features">
                    <h3>Key Features</h3>
                    <ul class="features-list">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Premium quality materials
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            1 year manufacturer warranty
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Free shipping on orders over $100
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            30-day return policy
                        </li>
                    </ul>
                </div>

                <div class="product-options">
                    <div class="option-group">
                        <label class="option-label">Quantity</label>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="decreaseQuantity()" ${product.stock === 0 ? 'disabled' : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <input 
                                type="number" 
                                class="quantity-input" 
                                id="quantityInput" 
                                value="1" 
                                min="1" 
                                max="${product.stock}"
                                onchange="updateProductQuantity(this.value)"
                                ${product.stock === 0 ? 'disabled' : ''}
                            >
                            <button class="quantity-btn" onclick="increaseQuantity()" ${product.stock === 0 ? 'disabled' : ''}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="stock-info">
                            <span class="stock-indicator ${stockStatus}"></span>
                            <span>${stockText}</span>
                        </div>
                    </div>
                </div>

                <div class="product-actions">
                    <button 
                        class="btn btn-primary btn-lg" 
                        onclick="addProductToCart()"
                        ${product.stock === 0 ? 'disabled' : ''}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button class="btn btn-secondary btn-lg" onclick="buyNow()">
                        Buy Now
                    </button>
                    <button class="btn btn-outline btn-lg wishlist-icon-btn ${Wishlist.hasProduct(product.id) ? 'active' : ''}" 
                            data-product-id="${product.id}"
                            style="padding: 0.75rem 1.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
                             fill="${Wishlist.hasProduct(product.id) ? '#ef4444' : 'none'}" 
                             stroke="${Wishlist.hasProduct(product.id) ? '#ef4444' : 'currentColor'}" 
                             stroke-width="2"
                             style="margin-right: 0.5rem;">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        ${Wishlist.hasProduct(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>

                <div class="product-meta">
                    <div class="meta-item">
                        <span class="meta-label">SKU</span>
                        <span class="meta-value">${product.id.toUpperCase()}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Category</span>
                        <span class="meta-value">${product.category}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Tags</span>
                        <span class="meta-value">Electronics, ${product.category}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Availability</span>
                        <span class="meta-value">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('productContent').innerHTML = html;
}

// Render breadcrumb
function renderBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = `
        <a href="index.html">Home</a>
        <span>›</span>
        <a href="shop.html">Shop</a>
        <span>›</span>
        <a href="shop.html?category=${currentProduct.category}">${currentProduct.category}</a>
        <span>›</span>
        <span>${currentProduct.name}</span>
    `;
}

// Load related products
async function loadRelatedProducts(category) {
    try {
        const { products } = await API.products.getAll();
        const related = products
            .filter(p => p.category === category && p.id !== productId)
            .slice(0, 4);

        if (related.length > 0) {
            document.getElementById('relatedSection').style.display = 'block';
            document.getElementById('relatedProducts').innerHTML = related
                .map(p => renderProductCard(p))
                .join('');
        }
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// Quantity controls
window.decreaseQuantity = function() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantityInput').value = quantity;
    }
}

window.increaseQuantity = function() {
    if (quantity < currentProduct.stock) {
        quantity++;
        document.getElementById('quantityInput').value = quantity;
    }
}

window.updateProductQuantity = function(value) {
    const num = parseInt(value);
    if (num >= 1 && num <= currentProduct.stock) {
        quantity = num;
    } else {
        document.getElementById('quantityInput').value = quantity;
    }
}

// Change main image
window.changeImage = function(src, index) {
    document.querySelector('.main-image').src = src;
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Add to cart
window.addProductToCart = function() {
    if (currentProduct.stock === 0) {
        toast.error('Product is out of stock');
        return;
    }

    API.cart.add(currentProduct, quantity);
    toast.success(`${quantity} ${currentProduct.name} added to cart!`);
    renderNavbar();
    
    // Reset quantity
    quantity = 1;
    document.getElementById('quantityInput').value = 1;
}

// Buy now
window.buyNow = function() {
    if (currentProduct.stock === 0) {
        toast.error('Product is out of stock');
        return;
    }

    addProductToCart();
    window.location.href = 'cart.html';
}

// Initialize
loadProduct();
