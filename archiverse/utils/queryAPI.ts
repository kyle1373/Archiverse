import store from '../redux/store';
import { setData, setError } from '../redux/store';


type FetchResult<T> = {data: T | null, error: string | null};

// Function to fetch data from an API endpoint and cache it
export const queryAPI = async <T>(url: string): Promise<FetchResult<T>> => {
  const state = store.getState();
  const cachedData = state.api.data[url] as T | undefined;

  if (cachedData) {
    // Return cached data if available
    console.log(`Cache hit for ${url}`);
    return {data: cachedData, error: null};
  }

  console.log(`Fetching ${url}`);
  store.dispatch(setData({ key: url, data: null }));
  store.dispatch(setError({ key: url, error: null }));

  try {
    const response = await fetch(`/api/${url}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    const result = (await response.json()) as T;
    store.dispatch(setData({ key: url, data: result }));
    return {data: result, error: null};
  } catch (err) {
    store.dispatch(setError({ key: url, error: err.message }));
    console.log(err)
    return {data: null, error: err.message};
  }
};