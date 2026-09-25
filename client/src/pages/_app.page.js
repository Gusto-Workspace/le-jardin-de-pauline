import "@/styles/tailwind.css";
import "react-calendar/dist/Calendar.css";
import "@/styles/site.css";
import { GlobalProvider } from "@/contexts/global.context";

export default function App({ Component, pageProps }) {
  return <GlobalProvider><Component {...pageProps} /></GlobalProvider>;
}
