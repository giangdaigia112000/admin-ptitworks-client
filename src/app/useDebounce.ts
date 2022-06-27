import { useState, useEffect } from "react";

function useDebounce(value: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(handle);
  }, [value]);
  return debounceValue;
}

export default useDebounce;
