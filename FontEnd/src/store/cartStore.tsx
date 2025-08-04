import { create } from "zustand";

interface CartState {
  handleCloseCart: (() => void) | undefined;
  setHandleCloseCart: (value: () => void) => void;
}

const useCartStore = create<CartState>((set) => ({
  handleCloseCart: undefined,
  setHandleCloseCart: (value: (() => void) | undefined) =>
    set({ handleCloseCart: value }),
}));

export default useCartStore;
