import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  price: number;
  currency: string;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
};

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (cartItem) => cartItem.variantId === item.variantId,
        );

        if (existing) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.variantId === item.variantId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem,
            ),
          });
          return;
        }

        set({
          items: [...get().items, { ...item, quantity: 1 }],
        });
      },
      removeItem: (variantId) => {
        set({
          items: get().items.filter(
            (cartItem) => cartItem.variantId !== variantId,
          ),
        });
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map((cartItem) =>
            cartItem.variantId === variantId
              ? { ...cartItem, quantity }
              : cartItem,
          ),
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      getItemCount: () => {
        return get().items.reduce(
          (total, cartItem) => total + cartItem.quantity,
          0,
        );
      },
      getSubtotal: () => {
        return get().items.reduce(
          (total, cartItem) => total + cartItem.price * cartItem.quantity,
          0,
        );
      },
    }),
    {
      name: "tor-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
