import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../store/index";
import { Toaster } from "@/components/ui/sonner";
import ga from "react-ga4";
import "../styles/globals.css";
import { useEffect } from "react";

const TRACKING_ID = "G-NXE8RN30ZL";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    ga.initialize([{ trackingId: TRACKING_ID }]);
    // 页面加载时发送页面浏览事件
    // ga.send({ hitType: "pageview", page: window.location.pathname });
  }, []);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster />
    </Provider>
  );
};

export default MyApp;
