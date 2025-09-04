// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const useThemeStore = create(
//   persist(
//     (set) => ({
//       theme: "light",
//       setTheme: (theme) => set({ theme }),
//     }),
//     {
//       name: "theme-storage",
//       getStorage: () => localStorage,
//     }
//   )
// );

// export default useThemeStore;

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light", // applied theme (light/dark)
      mode: "light", // user choice: light | dark | system

      setTheme: (mode) => {
        if (mode === "system") {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          set({ theme: prefersDark ? "dark" : "light", mode: "system" });

          // watch for system theme changes
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handler = (e) => {
            if (get().mode === "system") {
              set({ theme: e.matches ? "dark" : "light" });
            }
          };
          mediaQuery.addEventListener("change", handler);
        } else {
          set({ theme: mode, mode });
        }
      },
    }),
    {
      name: "theme-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useThemeStore;
