import "../styles/globals.scss";
import styles from "../styles/app.module.scss";
import "highlight.js/scss/vs2015.scss";

import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <header className={styles.header}>
        <h1>
          <Link href="/">
            <a>Flash</a>
          </Link>
        </h1>
      </header>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
