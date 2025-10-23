# 🚀 Quick Start Guide - TechStore

Get your e-commerce website up and running in minutes!

## ⚡ Instant Setup (No Installation Required)

### Option 1: Direct File Opening
Simply double-click `index.html` to open in your browser. The site works immediately!

```bash
# On Mac
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

### Option 2: Local Server (Recommended)

**Using Python:**
```bash
cd vanilla-code
python -m http.server 8000
```
Then visit: `http://localhost:8000`

**Using Node.js:**
```bash
cd vanilla-code
npx serve
```

**Using PHP:**
```bash
cd vanilla-code
php -S localhost:8000
```

## 🎮 Try It Out!

### 1. Browse Products
- Click **Shop Now** on the homepage
- Explore different categories
- Search for products
- Filter and sort

### 2. Add to Cart
- Click on any product
- View product details
- Click **Add to Cart**
- View your cart (top right icon)

### 3. Checkout
- Go to cart
- Click **Proceed to Checkout**
- Fill in shipping info (use any test data)
- Select payment method
- Place order

### 4. Track Order
- After checkout, you'll get an order number
- Use the **Track Order** page
- Enter your order number

### 5. Create Account
- Click **Login** in navbar
- Click **Sign Up** link
- Create an account with any email
- Password must be 6+ characters

## 🎯 Demo Credentials

### Test User
- Email: `demo@techstore.com`
- Password: `demo123`

### Admin User
- Email: `admin@techstore.com`
- Password: `admin123`

## 🎨 Customize Your Store

### 1. Change Colors

Edit `css/styles.css`:
```css
:root {
    --primary: #2563eb;      /* Your brand color */
    --primary-dark: #1e40af;
    --success: #10b981;
    --danger: #ef4444;
}
```

### 2. Update Store Name

Edit `js/config.js`:
```javascript
const STORE_NAME = 'Your Store Name';
```

### 3. Add Your Products

Edit `js/config.js` and modify `MOCK_PRODUCTS` array:
```javascript
{
    id: 'your-product-id',
    name: 'Your Product Name',
    price: 99.99,
    category: 'Category',
    description: 'Product description',
    image: 'https://your-image-url.com/image.jpg',
    rating: 4.5,
    stock: 100
}
```

## 🌐 Connect to Backend API

### 1. Start Your Backend Server
```bash
cd backend
npm install
npm start
```

### 2. Update API URL

Edit `js/config.js`:
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    // ...
};
```

The app automatically falls back to mock data if API is unavailable!

## 📱 Pages Available

- ✅ Home - `index.html`
- ✅ Shop - `shop.html`
- ✅ Product Detail - `product-detail.html`
- ✅ Cart - `cart.html`
- ✅ Checkout - `checkout.html`
- ✅ Order Confirmation - `order-confirmation.html`
- ✅ Track Order - `track-order.html`
- ✅ Login - `login.html`
- ✅ Register - `register.html`
- ✅ Profile - `profile.html`
- ✅ About - `about.html`
- ✅ Contact - `contact.html`

## 🔍 Testing Checkout

Use these test values:

**Shipping Info:**
- Name: `John Doe`
- Email: `john@example.com`
- Phone: `555-123-4567`
- Address: `123 Main St`
- City: `New York`
- State: `NY`
- ZIP: `10001`

**Credit Card (Test):**
- Card Number: `4532 1234 5678 9010`
- Expiry: `12/25`
- CVV: `123`

## 💡 Tips

1. **Cart Persistence**: Your cart saves automatically in browser storage
2. **Order History**: Orders are saved in localStorage
3. **Multiple Tabs**: Open in multiple tabs - cart syncs across tabs
4. **Mobile View**: Try on mobile or resize browser window
5. **Clear Data**: Use browser dev tools > Application > Clear Storage

## 🎓 Learning Path

### Beginners
1. Start with `index.html` - understand structure
2. Check `css/styles.css` - see styling
3. Look at `js/home.js` - simple JavaScript

### Intermediate
1. Explore `js/api.js` - API integration
2. Study `js/components.js` - reusable components
3. Review `js/utils.js` - helper functions

### Advanced
1. Modify `js/config.js` - configuration
2. Extend `js/api.js` - add new endpoints
3. Create new pages following existing patterns

## 🚀 Deployment

### Deploy to Netlify
1. Drag `vanilla-code` folder to netlify.com
2. Done! Your site is live

### Deploy to GitHub Pages
```bash
git add .
git commit -m "Deploy e-commerce site"
git push origin main
```
Enable GitHub Pages in repository settings

### Deploy to Vercel
```bash
vercel deploy
```

## ❓ Common Issues

### Cart not saving?
- Enable browser cookies/storage
- Check browser console for errors
- Try clearing site data and refresh

### Images not loading?
- Check internet connection
- Images use Unsplash CDN
- Fallback placeholders provided

### Styles not working?
- Verify CSS file paths
- Clear browser cache (Ctrl/Cmd + Shift + R)
- Check browser console for 404 errors

### API not connecting?
- Verify backend server is running
- Check `CONFIG.API_BASE_URL` in `js/config.js`
- App works with mock data if API fails

## 📚 Resources

- **Full Documentation**: See `README.md`
- **Features List**: See `FEATURES.md`
- **Code Structure**: Check file comments
- **Support**: Check browser console for errors

## 🎉 Next Steps

1. ✅ Explore all pages
2. ✅ Customize colors and branding
3. ✅ Add your own products
4. ✅ Connect to your backend
5. ✅ Deploy to production
6. ✅ Share with the world!

---

**Need Help?**
- Check browser console (F12) for errors
- Review code comments
- Read full documentation
- Test with demo credentials

**Ready for Production?**
- Minify CSS and JS
- Optimize images
- Set up real payment gateway
- Configure real backend API
- Add SSL certificate
- Set up analytics

---

Built with ❤️ - Happy Coding! 🚀
