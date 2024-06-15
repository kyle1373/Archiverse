// hooks/useApi.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setError } from '../redux/store';

const useApi = (key, fetchData) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => (state as any).api.data[key]);
  const error = useSelector((state) => (state as any).api.error);

  useEffect(() => {
    const fetchDataWithCache = async () => {
      if (!data) {
        try {
          const response = await fetchData();
          dispatch(setData({ key, data: response }));
        } catch (err) {
          dispatch(setError(err.message));
        }
      }
    };
    fetchDataWithCache();
  }, [data, dispatch, fetchData, key]);

  return { data, error };
};

export default useApi;