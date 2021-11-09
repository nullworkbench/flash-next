import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import CodeArea from "@/components/CodeArea";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <CodeArea>display: block;</CodeArea>
    </div>
  );
};

export default Home;
