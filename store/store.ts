import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  buyer_name: string;
  buyer_contact: string;
  delivery_address: string;
  items: any;
  status: string;
  createdAt: Date;
  userId: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface StoreState {
  products: Product[];
  orders: Order[];
  setProducts: (products: Product[]) => void;
  setOrders: (orders: Order[]) => void;
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  orders: [],
  setProducts: (products) => set({ products }),
  setOrders: (orders) => set({ orders }),
  cart: [],
  addToCart: (productId) => 
    set((state) => ({
      cart: [...state.cart, { productId, quantity: 1 }]
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter(item => item.productId !== productId)
    })),
  clearCart: () => set({ cart: [] })
}));