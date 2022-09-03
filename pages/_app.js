import dynamic from "next/dynamic";
// redux
import { Provider } from "react-redux";
import { useStore } from "../redux/index";

// cookies provider
import { CookiesProvider } from "react-cookie";
import { useCookies } from "react-cookie";

//components
import ModalContainer from "../components/modalContainer/modalContainer";
import DrawerContainer from "@/components/drawer-container/drawer-container";
// styles
import "antd/dist/antd.css";
import "../styles/main.css";
import "../styles/responsive.css";
import "../styles/globals.css";
import "@ant-design/flowchart/dist/index.css";

import RealTime from "@/components/utils/real-time";

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  const [cookies, setCookies, clearCookies] = useCookies(["user"]);

  console.log("cookies");
  console.log(cookies);

  return (
    <Provider store={store}>
      {cookies?.user && <RealTime cookies={cookies?.user} />}
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
      <ModalContainer />
      <DrawerContainer />
    </Provider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
