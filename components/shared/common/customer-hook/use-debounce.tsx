import { useState, useEffect } from "react";

function useDebounce<T>(
  initialValue: T,
  initialDelay: number
): [T, (val: T) => void, number] {
  const [value, setValue] = useState<T>(initialValue);
  const [timeDelay, setTimeDelay] = useState<number>(initialDelay);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, timeDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, timeDelay]);

  return [debouncedValue, setValue, timeDelay];
}

export default useDebounce;
