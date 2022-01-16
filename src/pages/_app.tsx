import "tailwindcss/tailwind.css";
import "@/styles/global.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* クローラー拒否 */}
        <meta name="robots" content="noindex" />
        {/* タイトル */}
        <title>Flash</title>
      </Head>
      <div className="font-jp">
        <GlobalHeader />
        <Component {...pageProps} />
        <GlobalFooter />
      </div>
    </>
  );
}
export default App;
