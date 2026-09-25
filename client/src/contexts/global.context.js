import { createContext } from "react";
import useRestaurant from "./restaurant.context";

export const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const restaurantContext = useRestaurant();
  return (
    <GlobalContext.Provider value={{ restaurantContext }}>
      {children}
    </GlobalContext.Provider>
  );
}
