import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type AddressInput = Omit<SavedAddress, "id">;

type AddressStore = {
  addresses: SavedAddress[];
  addAddress: (address: AddressInput) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
  getDefault: () => SavedAddress | undefined;
};

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [],
      addAddress: (address) => {
        const id = "addr-" + Date.now();
        set((state) => {
          const next = address.isDefault
            ? state.addresses.map((item) => ({ ...item, isDefault: false }))
            : state.addresses;

          return {
            addresses: [...next, { ...address, id }],
          };
        });
      },
      removeAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((item) => item.id !== id),
        }));
      },
      setDefault: (id) => {
        set((state) => ({
          addresses: state.addresses.map((item) => ({
            ...item,
            isDefault: item.id === id,
          })),
        }));
      },
      getDefault: () => {
        const { addresses } = get();
        return addresses.find((item) => item.isDefault) ?? addresses[0];
      },
    }),
    {
      name: "tor-addresses",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      partialize: (state) => ({ addresses: state.addresses }),
    },
  ),
);
