'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  comparePrice?: number;
  image: string;
  size: string;
  color: string;
  colorHex?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

function calcSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calcCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS': {
      const items = action.payload;
      return {
        ...state,
        items,
        subtotal: calcSubtotal(items),
        itemCount: calcCount(items),
      };
    }
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId && i.size === action.payload.size && i.color === action.payload.color
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i
        );
      } else {
        items = [...state.items, action.payload];
      }
      return {
        ...state,
        items,
        subtotal: calcSubtotal(items),
        itemCount: calcCount(items),
      };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.id !== action.payload);
      return {
        ...state,
        items,
        subtotal: calcSubtotal(items),
        itemCount: calcCount(items),
      };
    }
    case 'UPDATE_QUANTITY': {
      const items = action.payload.quantity <= 0
        ? state.items.filter((i) => i.id !== action.payload.id)
        : state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
          );
      return {
        ...state,
        items,
        subtotal: calcSubtotal(items),
        itemCount: calcCount(items),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], subtotal: 0, itemCount: 0 };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const STORAGE_KEY = 'accuright_cart';

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    itemCount: 0,
    isOpen: false,
    isLoading: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadCartFromStorage();
    if (stored.length > 0) {
      dispatch({ type: 'SET_ITEMS', payload: stored });
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  // Sync to DB when authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user && state.items.length > 0) {
      fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: state.items }),
      }).catch(() => {
        // Silent fail - localStorage is the source of truth
      });
    }
  }, [status, session, state.items]);

  // Merge guest cart on login
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/cart')
        .then((r) => r.json())
        .then((data: { items?: CartItem[] }) => {
          if (data.items && data.items.length > 0) {
            const merged = [...state.items];
            for (const dbItem of data.items) {
              const exists = merged.find(
                (i) => i.productId === dbItem.productId && i.size === dbItem.size && i.color === dbItem.color
              );
              if (!exists) merged.push(dbItem);
            }
            dispatch({ type: 'SET_ITEMS', payload: merged });
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const id = `${item.productId}-${item.size}-${item.color}-${Date.now()}`;
    dispatch({ type: 'ADD_ITEM', payload: { ...item, id } });
    toast.success(`${item.name} added to cart`, {
      icon: '🛒',
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    saveCartToStorage([]);
  }, []);

  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}

export default CartContext;
