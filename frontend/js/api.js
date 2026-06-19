const API_BASE = window.API_BASE || 'http://localhost:5000/api';

async function fetchProducts(){
  const res = await fetch(`${API_BASE}/products`);
  if(!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

async function fetchProductById(id){
  const res = await fetch(`${API_BASE}/products/${id}`);
  if(!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export { fetchProducts, fetchProductById };
