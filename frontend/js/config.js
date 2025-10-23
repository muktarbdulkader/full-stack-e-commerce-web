// Configuration
const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isNetlify = window.location.hostname.includes('netlify.app');
const DEFAULT_API = isLocalDevelopment ? "http://localhost:5000/api" : "/api";

const CONFIG = {
  API_BASE_URL: window.API_BASE_URL || DEFAULT_API,
  USE_MOCK_DATA: true, // Always use mock data since backend is not deployed
  STORAGE_KEY: "techstore_data",
  TOKEN_KEY: "techstore_token",
  CART_KEY: "techstore_cart",
  USER_KEY: "techstore_user",
};

// Product Categories
const CATEGORIES = [
  "All",
  "Audio",
  "Mobile",
  "Computers",
  "Wearables",
  "Photography",
  "Accessories",
  "Gaming",
  "Ear",
];

// Mock Products (fallback if API is not available)
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation, 30-hour battery life, and superior sound quality.",
    price: 299.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.8,
    stock: 45,
    reviews: [],
  },
  {
    id: "2",
    name: "Latest Smartphone Pro",
    description:
      'Flagship smartphone with 6.7" OLED display, 256GB storage, triple camera system, and 5G connectivity.',
    price: 999.99,
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    rating: 4.6,
    stock: 28,
    reviews: [],
  },
  {
    id: "3",
    name: "Ultra-Thin Laptop",
    description:
      'Powerful laptop with Intel i7 processor, 16GB RAM, 512GB SSD, and stunning 14" 4K display.',
    price: 1299.99,
    category: "Computers",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    rating: 4.9,
    stock: 15,
    reviews: [],
  },
  {
    id: "4",
    name: "Fitness Smartwatch",
    description:
      "Advanced smartwatch with heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life.",
    price: 349.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    rating: 4.7,
    stock: 62,
    reviews: [],
  },
  {
    id: "5",
    name: "Professional Camera",
    description:
      "Mirrorless camera with 24MP sensor, 4K video recording, and advanced autofocus system.",
    price: 1599.99,
    category: "Photography",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
    rating: 4.9,
    stock: 12,
    reviews: [],
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    description:
      "Portable waterproof speaker with 360° sound, 12-hour battery, and deep bass.",
    price: 129.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    rating: 4.5,
    stock: 88,
    reviews: [],
  },
  {
    id: "7",
    name: "Gaming Laptop",
    description: "Best gaming laptop affordable.",
    price: 129.99,
    category: "Gaming",
    image: "https://dlcdnrog.asus.com/rog/media/1644549597584.webp",
    rating: 4.5,
    stock: 88,
    reviews: [],
  },
  {
    id: "8",
    name: "Gaming Mouse",
    description: "High-precision gaming mouse with customizable DPI settings.",
    price: 59.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    rating: 4.5,
    stock: 88,
    reviews: [],
  },
  {
    id: "9",
    name: "Mechanical Keyboard",
    description:
      "Gaming keyboard with customizable RGB lighting and programmable keys.",
    price: 89.99,
    category: "Accessories",
    image:
      "https://theawesomer.com/photos/2021/04/havit_retro_mechanical_keyboard_2.jpg",
    rating: 4.5,
    stock: 88,
    reviews: [],
  },
  {
    id: "10",
    name: "Gaming Mouse",
    description: "High-precision gaming mouse with customizable DPI settings.",
    price: 59.99,
    category: "Accessories",
    image:
      "https://www.falconcomputers.co.uk/media/product/88061/0/0/msi-clutch-gm50-usb-rgb-gaming-mouse.jpg.jpg",
    rating: 4.5,
    stock: 88,
    reviews: [],
  },

  // Export carousel products for use in other modules

  {
    id: "11",
    name: "AirPods 3rd Gen",
    description:
      "Experience crystal-clear sound with spatial audio and dynamic head tracking. Sweat and water resistant with a comfortable in-ear design.",
    price: 179.99,
    category: "Audio",
    image: "https://www.flatpanelshd.com/pictures/airpods3_2_small.jpg",
    rating: 4.8,
    stock: 45,
    reviews: [
      {
        id: "r1",
        user: "Alex M.",
        rating: 5,
        comment: "Amazing sound quality!",
      },
      { id: "r2", user: "Sarah K.", rating: 4, comment: "Great battery life" },
    ],
    features: [
      "Spatial audio with dynamic head tracking",
      "Up to 6 hours of listening time",
      "Sweat and water resistant",
      "Personalized Spatial Audio",
    ],
  },
  {
    id: "12",
    name: "AirPods Pro",
    description:
      "Flagship wireless earbuds with active noise cancellation, spatial audio, and customizable fit.",
    price: 999.99,
    category: "Ear",
    image:
      "https://www.zdnet.com/a/img/2022/09/21/a98e0665-133f-402e-8585-dec1d37743d8/9bd01eab-12e7-4d30-bce1-36d48b253c9a.jpg",
    rating: 4.6,
    stock: 28,
    reviews: [],
  },
  {
    id: "13",
    name: "AirPods Max",
    description:
      "Over-ear wireless headphones with high-fidelity audio, active noise cancellation, and premium design.",
    price: 1299.99,
    category: "Ear",
    image:
      "https://cdn.mos.cms.futurecdn.net/p66jAvRVsfcjdzGFVnFGmm-1920-80.jpg",
    rating: 4.9,
    stock: 15,
    reviews: [],
  },
  {
    id: "14",
    name: "AirPods 2nd Gen",
    description:
      "Advanced wireless earbuds with seamless connectivity, clear audio, and long battery life.",
    price: 349.99,
    category: "Ear",
    image:
      "https://www.headphonecheck.com/wp-content/uploads/2019/01/tps_1524_406639_Januar30041-406639-1920x1080.jpg",
    rating: 4.7,
    stock: 62,
    reviews: [],
  },
  {
    id: "15",
    name: "AirPods Studio",
    description:
      "Premium over-ear wireless headphones with immersive sound, adjustable headband, and smart controls.",
    price: 1599.99,
    category: "Ear",
    image:
      "https://th.bing.com/th/id/R.21b40f7f9987d323de437f634e8d691c?rik=iVQpr7ns8H7wuw&pid=ImgRaw&r=0",
    rating: 4.9,
    stock: 12,
    reviews: [],
  },
  {
    id: "16",
    name: "AirPods 2nd Gen premium",
    description:
      "Wireless earbuds with active noise cancellation and long battery life.",
    price: 89.99,
    category: "Ear",
    image:
      "https://images.macrumors.com/t/M_haQlFKiTwwTYOkqiIEPK_csv4=/1920x/article-new/2022/09/airpods-pro-2.jpg",
    rating: 4.5,
    stock: 88,
    reviews: [],
  },
  {
    id: "17",
    name: "AirPods 2nd Gen premium",
    description:
      "Wireless earbuds with active noise cancellation and long battery life.",
    price: 59.99,
    category: "Ear",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc3/photo_1593442607435-e4e34991b210.jpg",
    rating: 4.5,
    stock: 88,
    reviews: [],
  },
  {
    id: "18",
    name: "Gaming Mouse RGB Pro",
    description:
      "High-precision gaming mouse with 16000 DPI, customizable RGB lighting, and 8 programmable buttons.",
    price: 79.99,
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    rating: 4.7,
    stock: 45,
    reviews: [],
  },
  {
    id: "19",
    name: "Mechanical Keyboard RGB",
    description:
      "Premium mechanical keyboard with Cherry MX switches, RGB backlighting, and aluminum frame.",
    price: 149.99,
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
    rating: 4.8,
    stock: 32,
    reviews: [],
  },
  {
    id: "20",
    name: "Portable SSD 1TB",
    description:
      "Ultra-fast portable SSD with USB-C 3.2, up to 1050MB/s read speed, compact and durable design.",
    price: 129.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500",
    rating: 4.6,
    stock: 67,
    reviews: [],
  },
  {
    id: "21",
    name: "Webcam 4K Ultra HD",
    description:
      "4K webcam with autofocus, HDR, built-in stereo microphones, perfect for streaming and video calls.",
    price: 99.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500",
    rating: 4.5,
    stock: 28,
    reviews: [],
  },
  {
    id: "22",
    name: "Drone with 4K Camera",
    description:
      "Professional drone with 4K camera, 3-axis gimbal, GPS, 30min flight time, perfect for aerial photography.",
    price: 899.99,
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500",
    rating: 4.9,
    stock: 12,
    reviews: [],
  },
  {
    id: "23",
    name: "Tablet Pro 12.9 inch",
    description:
      "Powerful tablet with 12.9\" Retina display, M1 chip, 128GB storage, supports stylus and keyboard.",
    price: 1099.99,
    category: "Mobile",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    rating: 4.8,
    stock: 22,
    reviews: [],
  },
  {
    id: "24",
    name: "Smart Home Hub",
    description:
      "Central smart home controller with voice control, works with all major smart home devices.",
    price: 129.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500",
    rating: 4.4,
    stock: 55,
    reviews: [],
  },
  {
    id: "25",
    name: "VR Headset Pro",
    description:
      "Next-gen VR headset with 4K per eye, 120Hz refresh rate, inside-out tracking, wireless design.",
    price: 599.99,
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500",
    rating: 4.7,
    stock: 18,
    reviews: [],
  },
  {
    id: "26",
    name: "Action Camera 5K",
    description:
      "Waterproof action camera with 5K video, image stabilization, voice control, perfect for adventure.",
    price: 349.99,
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1606986628582-5c58fb1ae1db?w=500",
    rating: 4.6,
    stock: 35,
    reviews: [],
  },
  {
    id: "27",
    name: "Wireless Charging Pad",
    description:
      "Fast wireless charging pad with 15W output, works with all Qi-enabled devices, LED indicator.",
    price: 39.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1591290619762-c588f7462dd6?w=500",
    rating: 4.3,
    stock: 95,
    reviews: [],
  },
  {
    id: "28",
    name: "Monitor 27 inch 4K",
    description:
      "27-inch 4K UHD monitor with HDR10, 99% sRGB, USB-C, adjustable stand, perfect for work and play.",
    price: 449.99,
    category: "Computers",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    rating: 4.7,
    stock: 26,
    reviews: [],
  },
  {
    id: "29",
    name: "Bluetooth Speaker Waterproof",
    description:
      "Portable Bluetooth speaker with 360° sound, 20-hour battery, waterproof IPX7, deep bass.",
    price: 79.99,
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    rating: 4.5,
    stock: 48,
    reviews: [],
  },
  {
    id: "30",
    name: "Gaming Headset 7.1",
    description:
      "Professional gaming headset with 7.1 surround sound, noise-cancelling mic, RGB lighting.",
    price: 129.99,
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1599669454699-248893623440?w=500",
    rating: 4.6,
    stock: 41,
    reviews: [],
  },
  {
    id: "31",
    name: "Smart Door Lock",
    description:
      "Keyless smart door lock with fingerprint, PIN code, smartphone app control, and auto-lock feature.",
    price: 199.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
    rating: 4.4,
    stock: 30,
    reviews: [],
  },
  {
    id: "32",
    name: "USB-C Hub 9-in-1",
    description:
      "Multiport USB-C hub with HDMI 4K, SD/TF card reader, USB 3.0 ports, 100W PD charging.",
    price: 59.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
    rating: 4.5,
    stock: 78,
    reviews: [],
  },
  {
    id: "33",
    name: "Ring Light LED",
    description:
      "18-inch LED ring light with tripod, 3 color modes, 10 brightness levels, perfect for content creation.",
    price: 89.99,
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1626538542850-e29f1f6b4abd?w=500",
    rating: 4.6,
    stock: 52,
    reviews: [],
  },
];
