import { useSelector, useDispatch } from "react-redux";
import { cachePage, clearCache } from "../redux/store";
import { useRouter } from "next/router";

let isBackNavigation = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    isBackNavigation = true;
  });
}

export function usePageCache() {
  const cache = useSelector((state) => (state as any).cache);
  const dispatch = useDispatch();
  const router = useRouter();

  function pageCache(path: string, key: string) {
    if (typeof window === "undefined") {
      console.log("window is undefined. server side?");
      return null; // Always return null on server-side
    }

    if (router.asPath !== path) {
      dispatch(clearCache({ path }));
    }

    if (cache[path] && cache[path][key] !== undefined) {
      const data = cache[path][key];
      isBackNavigation = false; // Reset the flag
      console.log("returning data for " + path + key + " as \n\n\n" + JSON.stringify(data))

      return data;
    }
    console.log("returning null for pageCache for " + path + key)


    return null;
  }

  function cachePageData(path: string, key: string, data: any) {
    if (typeof window === "undefined") {
      console.log("window is undefined. server side?");
      return; // Don't cache on server-side
    }
    console.log("caching " + path + key + " as \n\n\n" + JSON.stringify(data))
    dispatch(cachePage({ path, key, data }));
  }

  return { pageCache, cachePageData };
}
