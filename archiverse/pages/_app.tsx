import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useDispatch } from "react-redux";
import store, {
  clickBrowserButtons,
  notClickBrowserButtons,
} from "../redux/store";
import { GoogleAdSense } from "nextjs-google-adsense";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import the nprogress CSS
import { useEffect, useRef } from "react";
import Script from "next/script";

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
      <GoogleAdSense publisherId="pub-4203889559099732" />
      <Component {...pageProps} />
      {process.env.NODE_ENV === "production" && (
        <Script
          async
          src="https://umami.archiverse.app/script.js"
          data-website-id="23d6f0a7-aa02-4372-a89e-02d7c50e070b"
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
