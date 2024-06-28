import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cachePage, clearCache } from "../redux/store";
import { useRouter } from "next/router";

export function usePageCache() {
  const browser = useSelector((state) => (state as any).browser);
  const cache = useSelector((state) => (state as any).cache);
  const dispatch = useDispatch();
  const router = useRouter();

  const usedButtons = browser.clickedButtons

  function pageCache(path: string, key: string) {
    if (typeof window === "undefined") {
      console.log("window is undefined. server side?");
      return null; // Always return null on server-side
    }

    if (router.asPath !== path) {
      dispatch(clearCache({ path }));
    }

    // Check popState navigation
    if (usedButtons && cache[path] && cache[path][key] !== undefined) {
      // Reset popState navigation
      const data = cache[path][key];
      console.log("returning valid data for " + path + key + " as " + data);

      return data;
    }
    console.log("returning null for pageCache for " + path + key);

    return null;
  }

  function cachePageData(path: string, key: string, data: any) {
    if (typeof window === "undefined") {
      console.log("window is undefined. server side?");
      return; // Don't cache on server-side
    }
    console.log("caching " + path + key + " as real data");
    dispatch(cachePage({ path, key, data }));
  }

  return { pageCache, cachePageData };
}
