import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await api.getCart();
      setCartItems(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
    setLoading(false);
  };

  const addToCart = async (product) => {
    try {
      const existingItem = cartItems.find(item => item.productId === product.id);
      if (existingItem) {
        await api.updateCartItem(existingItem.id, existingItem.quantity + 1);
      } else {
        await api.addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      await loadCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) {
      await removeItem(id);
      return;
    }
    try {
      await api.updateCartItem(id, quantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return { cartItems, loading, addToCart, updateQuantity, removeItem, total };
}