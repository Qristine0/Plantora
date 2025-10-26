import { useState, useEffect, useCallback } from "react";

// key aris saxeli mnishvnelobis romladac sheinaxeba
// storageObject sheidzleba iyos local storage an session storage

export default function useStorage(key, defaultValue, storageObject) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);

    if (jsonValue !== null) {
      try {
        // tu userma local storage tavisit shecvala da rame invalid json miutita
        return JSON.parse(jsonValue);
      } catch (error) {
        // console.log(error)
      }
    }

    if (typeof defaultValue === "function") return defaultValue();
    else return defaultValue;
  });

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);

    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
}
