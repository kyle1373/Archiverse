import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData, setError } from "../redux/store";
import { sleep } from "@utils/utils";

const useApi = <T>(key: string, customUrl?: string) => {
  const dispatch = useDispatch();
  const [currentKey, setCurrentKey] = useState(key);
  const data = useSelector(
    (state) => (state as any).api.data[currentKey] as T | undefined
  );
  const error = useSelector((state) => (state as any).api.errors[key]) as
    | string
    | undefined;
  const allData = useSelector((state) => (state as any).api.data) as Record<string, T>;
  const [fetching, setFetching] = useState(false);

  const fetchData = useCallback(
    async (url?: string, append = false, prepend = false) => {
      if (fetching) {
        return;
      }
      const realKey = url ?? key;
      setCurrentKey(realKey);

      if (!append && !prepend) {
        dispatch(setData({ key: realKey, data: null }));
      }

      if (allData[realKey]) {
        setFetching(true)
        await sleep(100)
        setFetching(false)
        dispatch(setData({ key: realKey, data: allData[realKey], append, prepend }));
        return;
      }

      const fetchUrl = `/api/${realKey}`;
      console.log("Fetching " + fetchUrl);
      setFetching(true);
      dispatch(setError({ key: realKey, error: null }));
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${fetchUrl}`);
        }
        const result = await response.json();
        dispatch(setData({ key: realKey, data: result, append, prepend }));
      } catch (err) {
        dispatch(setError({ key: realKey, error: err.message }));
      } finally {
        setFetching(false);
      }
      return {data, error}
    },
    [dispatch, key, fetching, allData]
  );

  useEffect(() => {
    if (!data && !fetching) {
      fetchData(customUrl);
    }
  }, [fetchData, data, fetching, customUrl]);

  return { data, error, fetching, refetch: fetchData };
};

export default useApi;