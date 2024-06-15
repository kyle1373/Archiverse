import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import { GoogleAdSense } from "nextjs-google-adsense";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAdSense publisherId="pub-4203889559099732" />
      <Provider store={store}>
        <Component {...pageProps} />{" "}
      </Provider>
    </>
  );
}
