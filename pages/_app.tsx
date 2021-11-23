import "tailwindcss/tailwind.css";
import "@/styles/global.scss";
import type { AppProps } from "next/app";
import GlobalHeader from "@/components/GlobalHeader";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="font-jp">
      <GlobalHeader />
      <Component {...pageProps} />
    </div>
  );
}
export default App;
