import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import { GoogleAdSense } from "nextjs-google-adsense";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import the nprogress CSS
import { useEffect } from "react";
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

export default function App({ Component, pageProps }: AppProps) {
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
  return (
    <>
      <GoogleAdSense publisherId="pub-4203889559099732" />
      <Provider store={store}>
        <Component {...pageProps} />{" "}
      </Provider>
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
