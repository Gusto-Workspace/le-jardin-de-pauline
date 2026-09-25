import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useRestaurant() {
  const [restaurantData, setRestaurantData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const fetchRestaurantData = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

    setDataLoading(true);
    setDataError(null);

    if (!apiUrl || !restaurantId) {
      setDataError(new Error("Configuration API incomplète."));
      setDataLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/restaurants/${restaurantId}`);
      setRestaurantData(response.data.restaurant);
    } catch (error) {
      setDataError(error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  return {
    restaurantData,
    setRestaurantData,
    dataLoading,
    dataError,
    fetchRestaurantData,
  };
}
