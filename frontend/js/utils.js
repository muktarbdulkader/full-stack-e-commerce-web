// Utility Functions

// Local Storage helpers
const storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

// Toast Notifications
const toast = {
    show(message, type = 'success') {
        // Create or get container
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        // Icon SVGs
        const icons = {
            success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`,
            error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
            info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`,
            warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`
        };

        const colors = {
            success: { bg: "#10b981", border: "#059669", shadow: "rgba(16, 185, 129, 0.4)" },
            error: { bg: "#ef4444", border: "#dc2626", shadow: "rgba(239, 68, 68, 0.4)" },
            info: { bg: "#3b82f6", border: "#2563eb", shadow: "rgba(59, 130, 246, 0.4)" },
            warning: { bg: "#f59e0b", border: "#d97706", shadow: "rgba(245, 158, 11, 0.4)" }
        };

        const color = colors[type] || colors.success;
        const icon = icons[type] || icons.success;

        const toastEl = document.createElement('div');
        toastEl.className = `toast toast-${type}`;
        toastEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="flex-shrink: 0; color: white;">
                    ${icon}
                </div>
                <div style="flex: 1; color: white; font-weight: 500; font-size: 0.95rem; line-height: 1.4;">
                    ${message}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 0.5rem;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                    flex-shrink: 0;
                " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.3);
                width: 100%;
                border-radius: 0 0 10px 10px;
                overflow: hidden;
            ">
                <div class="toast-progress" style="
                    height: 100%;
                    background: rgba(255, 255, 255, 0.6);
                    width: 100%;
                    animation: toast-progress 3s linear;
                "></div>
            </div>
        `;

        toastEl.style.cssText = `
            position: relative;
            padding: 1rem 1.25rem;
            padding-bottom: 1.25rem;
            border-radius: 10px;
            background: ${color.bg};
            border-left: 4px solid ${color.border};
            box-shadow: 0 10px 25px ${color.shadow}, 0 4px 10px rgba(0, 0, 0, 0.15);
            min-width: 300px;
            max-width: 400px;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: auto;
            cursor: pointer;
        `;

        // Add progress bar animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes toast-progress {
                from { width: 100%; }
                to { width: 0%; }
            }
        `;
        if (!document.querySelector('style[data-toast-animation]')) {
            style.setAttribute('data-toast-animation', 'true');
            document.head.appendChild(style);
        }

        container.appendChild(toastEl);

        // Slide in animation
        requestAnimationFrame(() => {
            toastEl.style.opacity = '1';
            toastEl.style.transform = 'translateX(0)';

            // Auto dismiss
            setTimeout(() => {
                toastEl.style.opacity = '0';
                toastEl.style.transform = 'translateX(400px)';
                setTimeout(() => toastEl.remove(), 400);
            }, 3000);
        });

        // Click to dismiss
        toastEl.addEventListener('click', () => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateX(400px)';
            setTimeout(() => toastEl.remove(), 400);
        });
    },
    success(message) {
        this.show(message, 'success');
    },
    error(message) {
        this.show(message, 'error');
    },
    warning(message) {
        this.show(message, 'warning');
    },
    info(message) {
        this.show(message, 'info');
    }
};

// Format currency
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get URL parameters
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set URL parameters
function setUrlParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// Truncate text
function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
}

// Create loading spinner
function createSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-container';
    spinner.innerHTML = '<div class="spinner"></div>';
    return spinner;
}

// Show loading
function showLoading(container) {
    container.innerHTML = '';
    container.appendChild(createSpinner());
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Generate unique ID
function generateId() {
    return 'ORD-' + Date.now();
}

// Calculate cart total
function calculateCartTotal(cart) {
    return cart.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
}

// Calculate order totals
function calculateOrderTotals(subtotal) {
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
}

// Smooth scroll to element
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Check if user is authenticated
function isAuthenticated() {
    return !!storage.get(CONFIG.TOKEN_KEY);
}

// Get current user
function getCurrentUser() {
    return storage.get(CONFIG.USER_KEY);
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Redirect to login if not authenticated
function requireAuth(redirectUrl = window.location.pathname) {
    if (!isAuthenticated()) {
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
        return false;
    }
    return true;
}

// Redirect to home if authenticated
function requireGuest() {
    if (isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Add CSS animation for slideOut
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
