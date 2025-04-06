import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  all_products: [],
  isError: false,
  errorMessage: "",

  setProducts: (products) => set({ products }),

  addproduct: async (data) => {
    set({ isError: false });
    try {
      const res = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Product failed to add");

      set((state) => ({
        all_products: [...state.all_products, result.data],
      }));
    } catch (error) {
      console.error("Add Product Error:", error.message);
      set({ isError: true, errorMessage: error.message });
    }
  },

  deleteproduct: async (id) => {
    set({ isError: false });
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Product failed to delete");

      set((state) => ({
        all_products: state.all_products.filter(
          (product) => product._id !== id
        ),
      }));
    } catch (error) {
      console.error("Delete Product Error:", error.message);
      set({ isError: true, errorMessage: error.message });
    }
  },

  getallproducts: async () => {
    set({ isError: false });
    try {
      const res = await fetch("http://localhost:5000/api/products/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to fetch all products");

      set({ all_products: result.all_products });
    } catch (error) {
      console.error("Get All Products Error:", error.message);
      set({ isError: true, errorMessage: error.message });
    }
  },

  getmyproducts: async () => {
    set({ isError: false });
    try {
      const res = await fetch("http://localhost:5000/api/products/myproducts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to fetch my products");

      set({ products: result.my_products });
    } catch (error) {
      console.error("Get My Products Error:", error.message);
      set({ isError: true, errorMessage: error.message });
    }
  },

  myorders: async () => {
    set({ isError: false });
    try {
      const res = await fetch(
        "http://localhost:5000/api/products/getmyorders",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch orders");

      set({ all_products: result.my_orders });
    } catch (error) {
      console.error("My Orders Error:", error.message);
      set({ isError: true, errorMessage: error.message });
    }
  },

  buyproducts: async (id) => {
    set({ isError: false });
    try {
      const res = await fetch(`http://localhost:5000/api/products/buy/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Purchase failed");
    } catch (error) {
      console.error("Buy Product Error:", error.message);
      set({ isError: true, errorMessage: error.message });
    }
  },
}));
