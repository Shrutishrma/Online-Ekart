import { useState, useEffect } from 'react';
import axios from 'axios';

// Ensure this matches your Netlify Environment Variable (No trailing slash!)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // FETCH PRODUCTS (API Call)
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

  // ADD PRODUCT (API Call)
  const addProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) return;
    try {
      await axios.post(`${API_URL}/products`, { name, price, description });
      setName('');
      setPrice('');
      setDescription('');
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // BUY/DELETE PRODUCT (API Call)
  const buyProduct = async (id) => {
    if(!window.confirm("Buy this item?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error buying product:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">🛍️ Online Ekart</h1>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            Items: {products.length}
          </span>
        </header>

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Sell a Product</h2>
          <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" placeholder="Product Name" 
              className="border p-2 rounded"
              value={name} onChange={(e) => setName(e.target.value)} 
            />
            <input 
              type="number" placeholder="Price (₹)" 
              className="border p-2 rounded"
              value={price} onChange={(e) => setPrice(e.target.value)} 
            />
            <input 
              type="text" placeholder="Description" 
              className="border p-2 rounded"
              value={description} onChange={(e) => setDescription(e.target.value)} 
            />
            <button className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 font-bold">
              List Item
            </button>
          </form>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500 text-4xl">
                📦
              </div>
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{item.description || "No description"}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-green-600">₹{item.price}</span>
                <button 
                  onClick={() => buyProduct(item.id)}
                  className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No products available. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default App;