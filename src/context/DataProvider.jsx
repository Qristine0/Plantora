import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import useStorage from "../hooks/useStorage";

// todo - could add location (if farmer is in a different place from phone)

const DataContext = React.createContext();

const WEATHER_API_KEY = "a475e688c8e54b309da154358252510";

export function useData() {
  return useContext(DataContext);
}

const DataProvider = ({ children }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [weather, setWeather] = useState(null);
  const [tomorrow, setTomorrow] = useState(null);
  const [farmerInfo, setFarmerInfo, removeFarmerInfo] = useStorage(
    "plantorra-farmer-info",
    {},
    localStorage
  );

  const [prediction, setPrediction, removePrediction] = useStorage(
    "plantorra-prediction-info",
    null,
    localStorage
  );

  useEffect(() => {
    if (!location.latitude || !location.longitude) {
      console.log("Location needed for forecast");
      return;
    }

    // today and tomorrows forecast
    axios
      .get("https://api.weatherapi.com/v1/forecast.json", {
        params: {
          key: WEATHER_API_KEY,
          q: `${location.latitude},${location.longitude}`,
          days: 2, // today + tomorrow
        },
      })
      .then((res) => {
        console.log(res.data);
        setWeather(res.data.current);
        setTomorrow(res.data.forecast.forecastday[1]);
      })
      .catch((err) => console.error(err));
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      // Geolocation is available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback: permission granted, position received
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);

          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // Error callback: permission denied or other error
          console.error("Error getting location:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Options
      );
    } else {
      console.log("Can't access location");
    }
  }, []);

  const value = {
    location,
    setLocation,
    weather,
    setWeather,
    tomorrow,
    setTomorrow,
    farmerInfo,
    setFarmerInfo,
    removeFarmerInfo,
    prediction,
    setPrediction,
    removePrediction,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
