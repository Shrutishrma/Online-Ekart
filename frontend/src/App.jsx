import { useState, useEffect } from 'react';
import axios from 'axios';

// ------------------- COMPONENTS -------------------

// 1. CAROUSEL COMPONENT (Satisfies "Carousels" Requirement)
const Carousel = () => {
  const slides = [
    { id: 1, text: "🔥 Big Sale: 50% Off on Laptops!", color: "bg-blue-600" },
    { id: 2, text: "🚀 New Arrivals: Gaming Gear", color: "bg-purple-600" },
    { id: 3, text: "🎧 Free Shipping on Headphones", color: "bg-pink-600" },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000); // Auto-slide every 3 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-40 overflow-hidden rounded-lg shadow-lg mb-8">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute w-full h-full flex items-center justify-center text-white text-2xl font-bold transition-transform duration-500 ease-in-out ${slide.color}`}
          style={{ transform: `translateX(${(index - current) * 100}%)` }}
        >
          {slide.text}
        </div>
      ))}
    </div>
  );
};

// ------------------- MAIN APP -------------------

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  
  // 2. GEOLOCATION STATE (Satisfies "Geolocation" Requirement)
  const [location, setLocation] = useState("Detecting location...");

  // API: FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // API: ADD PRODUCT
  const addProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) return;
    try {
      await axios.post(`${API_URL}/products`, { name, price });
      setName('');
      setPrice('');
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  // API: BUY PRODUCT
  const buyProduct = async (id) => {
    if(!window.confirm("Buy this item?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  // 3. GEOLOCATION FUNCTION
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Long: ${position.coords.longitude.toFixed(2)}`);
        },
        () => { setLocation("Location Access Denied"); }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER & GEOLOCATION */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">🛍️ Online Ekart</h1>
          <div className="text-right">
            <p className="text-xs text-gray-500">Delivery to:</p>
            <button 
              onClick={detectLocation} 
              className="text-sm font-semibold text-indigo-600 hover:underline flex items-center"
            >
              📍 {location}
            </button>
          </div>
        </header>

        {/* CAROUSEL */}
        <Carousel />

        {/* SELL PRODUCT FORM */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Sell a Product</h2>
          <form onSubmit={addProduct} className="flex gap-4">
            <input 
              type="text" placeholder="Product Name" 
              className="border p-2 rounded flex-1"
              value={name} onChange={(e) => setName(e.target.value)} 
            />
            <input 
              type="number" placeholder="Price" 
              className="border p-2 rounded w-32"
              value={price} onChange={(e) => setPrice(e.target.value)} 
            />
            <button className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800">
              List Item
            </button>
          </form>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
              <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-4xl">📦</div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-green-600 font-bold">₹{item.price}</p>
                </div>
                <button 
                  onClick={() => buyProduct(item.id)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && <p className="text-center text-gray-400 mt-12">No items in the store yet.</p>}

      </div>
    </div>
  );
}

export default App;