import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData, setError } from "../redux/store";

const useApi = <T>(key: string) => {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => (state as any).api.data[key] as T | undefined
  );
  const error = useSelector((state) => (state as any).api.error) as string | undefined;

  useEffect(() => {
    if (!data) {
      const fetchDataWithCache = async () => {
        console.log("Fetching " + key);
        try {
          const response = await fetch(`/api/${key}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${key}`);
          }
          const result = await response.json();
          dispatch(setData({ key, data: result }));
        } catch (err) {
          dispatch(setError(err.message));
        }
      };

      fetchDataWithCache();
    } else {
      console.log("Cache hit for " + key + "!");
    }
  }, [dispatch, key, data]);

  return { data, error };
};

export default useApi;
