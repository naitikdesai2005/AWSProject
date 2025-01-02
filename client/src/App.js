import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories from the backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setCategory(e.target.value);
  };

  // Add category to the list
  const handleAddCategory = async () => {
    if (category.trim() !== '') {
      try {
        await axios.post('http://localhost:5000/api/categories', { name: category });
        setCategory(''); // Clear input field
        fetchCategories(); // Refresh the list
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  // Delete category from the list
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Product Category Manager</h1>
      <div>
        <input
          type="text"
          value={category}
          onChange={handleInputChange}
          placeholder="Enter product category"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleAddCategory} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Category
        </button>
      </div>
      <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
        {categories.map((cat) => (
          <li key={cat._id} style={{ padding: '8px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {cat.name}
            <button onClick={() => handleDeleteCategory(cat._id)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;