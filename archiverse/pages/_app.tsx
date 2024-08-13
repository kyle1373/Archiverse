import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useDispatch } from "react-redux";
import store, {
  clickBrowserButtons,
  notClickBrowserButtons,
} from "../redux/store";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import the nprogress CSS
import { useEffect, useRef } from "react";
import Script from "next/script";
import { SETTINGS } from "@constants/constants";
import Maintenance from "./maintenance";

NProgress.configure({ showSpinner: false });

const handleRouteChangeStart = () => {
  NProgress.start();
};

const handleRouteChangeComplete = () => {
  NProgress.done();
};

const handleRouteChangeError = () => {
  NProgress.done();
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isPopState = useRef(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, []);

  // It is NOT this

  useEffect(() => {
    const handlePopState = () => {
      // This handles the back and forward buttons
      isPopState.current = true;
      dispatch(clickBrowserButtons({}));
    };

    router.beforePopState(() => {
      handlePopState();
      return true;
    });

    router.events.on("routeChangeComplete", () => {
      // This handles all route changes
      if (!isPopState.current) {
        dispatch(notClickBrowserButtons({}));
      }
      isPopState.current = false;
    });

    return () => {
      router.events.off("routeChangeComplete", () => {
        if (!isPopState.current) {
          dispatch(notClickBrowserButtons({}));
        }
        isPopState.current = false;
      });
    };
  }, [router]);

  return (
    <>
      {SETTINGS.Maintenance ? <Maintenance /> : <Component {...pageProps} />}
      {process.env.NODE_ENV === "production" && (
        <Script
          async
          src="https://stats.superfx.dev/script.js"
          data-website-id="4b461fac-17ee-49ed-8c67-76a1d7e846e7"
        />
      )}
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <Provider store={store}>
      <MyApp {...props} />
    </Provider>
  );
}
