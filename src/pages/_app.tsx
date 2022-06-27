import type { AppProps } from "next/app";
import { store } from "../app/store";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import "antd/dist/antd.css";

function MyApp({ Component, pageProps }: AppProps) {
  const { route, push } = useRouter();
  useEffect(() => {
    const id = localStorage.getItem("id");
    console.log(id);
    if (route == "/login") {
      if (id) {
        push("/");
        console.log("giang");
      }
    } else {
      if (!id) {
        push("/login");
      }
    }
  });
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
