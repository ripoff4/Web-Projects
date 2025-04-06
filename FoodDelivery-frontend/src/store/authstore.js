import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,

  isSigningup: false,
  isLoggingin: false,
  isLoggingout: false,

  isCheckingAuth: true,

  isError: false,
  errorMessage: "",

  checkAuth: async () => {
    set({ isError: false, isCheckingAuth: true });
    try {
      const res = await fetch("http://localhost:5000/api/auth/check", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to check auth");

      const data = await res.json();
      set({ authUser: data.user });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ isError: true, authUser: null, errorMessage: error.message });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isError: false, isSigningup: true });
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Signup failed");

      set({ success: true, authUser: result.user });
    } catch (error) {
      console.log(error.message + " signup");
      set({
        isError: true,
        authUser: null,
        errorMessage: error.message,
      });
    } finally {
      set({ isSigningup: false });
    }
  },

  login: async (data) => {
    set({ isError: false, isLoggingin: true });
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");

      set({ authUser: result.user });
    } catch (error) {
      console.log(error.message + " login");
      set({
        isError: true,
        authUser: null,
        errorMessage: error.message,
      });
    } finally {
      set({ isLoggingin: false });
    }
  },

  logout: async () => {
    set({ isError: false, isLoggingout: true });
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Logout failed");
      }

      set({ authUser: null });
    } catch (error) {
      console.log(error.message + " logout");
      set({
        isError: true,
        errorMessage: error.message,
      });
    } finally {
      set({ isLoggingout: false });
    }
  },
}));
