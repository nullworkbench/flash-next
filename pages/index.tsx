import type { NextPage, GetStaticProps } from "next";
import styles from "../styles/Home.module.css";
import CodeArea from "@/components/CodeArea";
import { getRecentPosts } from "@/plugins/firestore";
import { useState } from "react";
import { db } from "@/plugins/firebase";
import { Timestamp, addDoc, collection } from "firebase/firestore";

type Props = {
  posts: Post[];
};

export const getStaticProps: GetStaticProps = async () => {
  // 最新の投稿10件を取得
  const posts = await getRecentPosts(10);

  return { props: { posts } };
};

const Home: NextPage<Props> = ({ posts }: Props) => {
  // Formのbody
  const [formBody, setFormBody] = useState("");

  return (
    <div className="container mx-auto">
      {/* 新規投稿 */}
      <section>
        <textarea
          name="body"
          onChange={(e) => {
            setFormBody(e.currentTarget.value);
          }}
        ></textarea>
        <button onClick={() => post()}>Post</button>
      </section>
      {posts.map((post, postIdx) => {
        return (
          <div key={postIdx}>
            <p>{post.body}</p>
            <p>{post.userId}</p>
            <p>{post.createdAt}</p>
          </div>
        );
      })}
      <div className={styles.container}>
        <CodeArea>display: block;</CodeArea>
      </div>
    </div>
  );
};

export default Home;
