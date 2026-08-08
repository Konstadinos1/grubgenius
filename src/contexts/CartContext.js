import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@bellepros:cart';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!loading) {
      saveCart();
    }
  }, [cart]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Add item to cart
  const addToCart = (item, quantity = 1, modifiers = []) => {
    const cartItem = {
      id: generateCartItemId(item, modifiers),
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      modifiers,
      image_url: item.image_url,
    };

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((i) => i.id === cartItem.id);

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item
        return [...prevCart, cartItem];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  // Update item quantity
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.price;
      const modifiersPrice = item.modifiers.reduce(
        (sum, mod) => sum + (mod.price_adjustment || 0),
        0
      );
      return total + (itemPrice + modifiersPrice) * item.quantity;
    }, 0);
  };

  const getTax = (subtotal, taxRate = 0.14975) => {
    return subtotal * taxRate;
  };

  const getTotal = (subtotal, tax, deliveryFee = 0, tip = 0, discount = 0) => {
    return subtotal + tax + deliveryFee + tip - discount;
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Generate unique cart item ID based on item + modifiers
  const generateCartItemId = (item, modifiers) => {
    const modifierIds = modifiers
      .map((m) => m.id)
      .sort()
      .join('-');
    return `${item.id}-${modifierIds || 'no-mods'}`;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;
