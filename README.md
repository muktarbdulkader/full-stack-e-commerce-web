# TechStore - Vanilla JavaScript Frontend

Complete e-commerce frontend built with vanilla HTML, CSS, and JavaScript.

## Features

✅ **Complete E-commerce Flow**

- Product browsing and filtering
- Product search and sorting
- Shopping cart management
- Checkout process
- Order tracking
- User authentication
- Admin dashboard
- Responsive design

✅ **Pages Included**

- Home (index.html)
- Shop (shop.html)
- Product Detail (product-detail.html)
- Shopping Cart (cart.html)
- Checkout (checkout.html)
- Order Confirmation (order-confirmation.html)
- Track Order (track-order.html)
- Login (login.html)
- Register (register.html)
- User Profile (profile.html)
- Admin Dashboard (admin.html)
- About (about.html)
- Contact (contact.html)

## Project Structure

```
frontend/
├── index.html              # Home page
├── shop.html              # Product listing
├── product-detail.html    # Product details
├── cart.html              # Shopping cart
├── checkout.html          # Checkout page
├── login.html             # User login
├── register.html          # User registration
├── profile.html           # User profile
├── admin.html             # Admin dashboard
├── about.html             # About page
├── contact.html           # Contact page
├── track-order.html       # Order tracking
├── order-confirmation.html # Order success
├── css/
│   ├── styles.css         # Global styles & utilities
│   ├── home.css           # Home page styles
│   ├── shop.css           # Shop page styles
│   ├── product.css        # Product detail styles
│   ├── cart.css           # Cart page styles
│   ├── checkout.css       # Checkout page styles
│   ├── order.css          # Order confirmation & tracking styles
│   ├── auth.css           # Authentication pages styles
│   ├── profile.css        # Profile page styles
│   ├── about.css          # About page styles
│   └── contact.css        # Contact page styles
├── js/
│   ├── config.js          # Configuration & constants
│   ├── utils.js           # Utility functions
│   ├── auth.js            # Authentication logic
│   ├── api.js             # API service layer
│   ├── components.js      # Reusable components
│   ├── home.js            # Home page logic
│   ├── shop.js            # Shop page logic
│   ├── product-detail.js  # Product detail logic
│   ├── cart.js            # Cart page logic
│   ├── checkout.js        # Checkout page logic
│   ├── order-confirmation.js  # Order confirmation logic
│   ├── track-order.js     # Order tracking logic
│   ├── login.js           # Login page logic
│   ├── register.js        # Registration logic
│   ├── profile.js         # Profile page logic
│   └── contact.js         # Contact page logic
└── README.md              # This file
```

## Setup Instructions

### 1. Basic Setup

Simply open `index.html` in a web browser. The application will work in "mock mode" with local storage.

```bash
# Option 1: Direct file opening
open index.html

# Option 2: Using a local server (recommended)
python -m http.server 5000
# or
npx serve
```

Then visit `http://localhost:5000`

### 2. Connect to Backend API

To connect to the Node.js backend:

1. By default the frontend will use a same-origin API path when served from the backend (i.e. `/api`).

2. When developing the frontend separately (for example with a static server on a different port), the default fallback is `http://localhost:5000/api`.

3. You can explicitly override the API base at runtime before any app scripts run by setting a global variable in the page, e.g. in `index.html` head:

```html
<script>
  // Override API if your backend runs on a different host/port
  window.__API_BASE__ = "http://localhost:5000/api";
</script>
```

4. The app will automatically attempt to use the API. If the API is unavailable, it falls back to mock data stored in localStorage.

## Features & Functionality

### Authentication

**Demo Credentials:**

- Admin: `admin@store.com` / `admin123`
- User: Any email with password 6+ characters

The authentication system works in two modes:

1. **API Mode**: Connects to backend for real authentication
2. **Mock Mode**: Uses localStorage for demo purposes

### State Management

Data is stored in localStorage:

- `techstore_token`: JWT authentication token
- `techstore_user`: Current user data
- `techstore_cart`: Shopping cart items
- `orders`: Order history

### Product Management

- View all products
- Filter by category
- Search products
- Sort by price and rating
- View product details
- Add to cart
- Product reviews (with backend)

### Shopping Cart

- Add/remove items
- Update quantities
- Calculate totals (subtotal, tax, shipping)
- Free shipping over $100
- Persistent cart (localStorage)

### Checkout Process

1. Add items to cart
2. Proceed to checkout
3. Enter shipping information
4. Select payment method
5. Place order
6. View order confirmation
7. Track order status

### Order Tracking

- Track orders by Order ID
- View order status timeline
- See estimated delivery date
- Order items and totals

### Admin Dashboard

- View sales statistics
- Manage products (CRUD)
- Manage orders
- Update order status
- View customers

## Customization

### Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
  --primary: #2563eb; /* Main brand color */
  --primary-dark: #1e40af; /* Hover states */
  --success: #10b981; /* Success messages */
  --danger: #ef4444; /* Error messages */
  /* ... more variables */
}
```

### API Endpoints

Edit `js/config.js` to change API endpoints:

```javascript
const CONFIG = {
  API_BASE_URL: "https://your-api.com/api",
  // ...
};
```

### Mock Products

Edit `MOCK_PRODUCTS` in `js/config.js` to change fallback products.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Key Technologies

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Custom Properties
- **JavaScript ES6+**: Async/await, modules, arrow functions
- **LocalStorage API**: Client-side data persistence
- **Fetch API**: HTTP requests

## Development

### Adding New Pages

1. Create HTML file (e.g., `new-page.html`)
2. Add CSS file (e.g., `css/new-page.css`)
3. Add JS file (e.g., `js/new-page.js`)
4. Update navigation in `js/components.js`

### Adding New Features

1. Add feature logic to appropriate JS file
2. Update API service in `js/api.js` if needed
3. Add new utility functions to `js/utils.js`
4. Update styles in CSS files

## Production Deployment

### Static Hosting

Deploy to any static hosting service:

- **Netlify**: Drag and drop folder
- **Vercel**: Connect Git repository
- **GitHub Pages**: Push to gh-pages branch
- **AWS S3**: Upload files to bucket
- **Firebase Hosting**: `firebase deploy`

### Build Optimization

For production, consider:

1. Minify CSS and JavaScript
2. Optimize images
3. Enable caching headers
4. Use CDN for assets
5. Compress files (gzip)

### Environment Variables

For different environments, update `js/config.js`:

```javascript
const CONFIG = {
  API_BASE_URL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://api.yoursite.com/api",
  // ...
};
```

## Security Notes

- Never store sensitive data in localStorage
- Always use HTTPS in production
- Implement proper CORS on backend
- Validate all user inputs
- Use secure authentication tokens
- Implement rate limiting on API

## Performance Tips

- Images are lazy loaded
- Debounced search input
- Minimal DOM manipulations
- Efficient event listeners
- LocalStorage caching

## Troubleshooting

### Cart not persisting

- Check browser localStorage is enabled
- Clear localStorage and reload

### API not connecting

- Verify backend is running
- Check CORS settings
- Verify API_BASE_URL in config

### Styles not loading

- Check file paths are correct
- Clear browser cache
- Ensure CSS files are linked

## License

MIT License - Feel free to use for personal or commercial projects.

## Support

For issues or questions:

- Check browser console for errors
- Verify all files are properly linked
- Ensure backend is running (if using API mode)
- Check localStorage for data issues

---

Built with ❤️ using Vanilla JavaScript
#   f u l l - s t a c k - E - e c o m m e r c e - w e b s i t e  
 #   f u l l - s t a c k - e - c o m m e r c e - w e b  
 