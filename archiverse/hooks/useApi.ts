import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData, setError } from "../redux/store";

const useApi = <T>(key: string) => {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => (state as any).api.data[key] as T | undefined
  );
  const error = useSelector((state) => (state as any).api.error) as string | undefined;
  const [fetching, setFetching] = useState(false);

  const fetchData = useCallback(async () => {
    console.log("Fetching " + key);
    setFetching(true);
    dispatch(setData({ key, data: null }));
    dispatch(setError(null));
    try {
      const response = await fetch(`/api/${key}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${key}`);
      }
      const result = await response.json();
      dispatch(setData({ key, data: result }));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      setFetching(false);
    }
  }, [dispatch, key]);

  useEffect(() => {
    if (!data && !fetching) {
      fetchData();
    }
  }, [key]);

  return { data, error, fetching, refetch: fetchData };
};

export default useApi;