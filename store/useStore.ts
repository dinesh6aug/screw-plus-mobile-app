import { create } from 'zustand';
import { CartItem, Product } from '@/types/product';

interface StoreState {
  cart: CartItem[];
  favorites: string[];
  searchQuery: string;
  selectedCategory: string;
  
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleFavorite: (productId: string) => void;
  
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  favorites: [],
  searchQuery: '',
  selectedCategory: 'All',
  
  addToCart: (product, size, color, quantity = 1) => {
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += quantity;
        return { cart: updatedCart };
      } else {
        return {
          cart: [...state.cart, { product, quantity, selectedSize: size, selectedColor: color }]
        };
      }
    });
  },
  
  removeFromCart: (productId, size, color) => {
    set((state) => ({
      cart: state.cart.filter(
        item => !(item.product.id === productId && 
                 item.selectedSize === size && 
                 item.selectedColor === color)
      )
    }));
  },
  
  updateCartQuantity: (productId, size, color, quantity) => {
    set((state) => ({
      cart: state.cart.map(item =>
        item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    }));
  },
  
  clearCart: () => set({ cart: [] }),
  
  toggleFavorite: (productId) => {
    set((state) => ({
      favorites: state.favorites.includes(productId)
        ? state.favorites.filter(id => id !== productId)
        : [...state.favorites, productId]
    }));
  },
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },
  
  getCartItemsCount: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
}));