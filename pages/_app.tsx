import "tailwindcss/tailwind.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="font-jp">
      <Component {...pageProps} />
    </div>
  );
}
export default App;
