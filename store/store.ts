import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (productId) =>
        set((state) => {
          const existingItem = state.cart.find(item => item.productId === productId);
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { productId, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter(item => item.productId !== productId),
        })),
      clearCart: () => set({ cart: [] }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
);