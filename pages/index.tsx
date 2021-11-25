import type { NextPage, GetStaticProps } from "next";
import styles from "../styles/Home.module.css";
import CodeArea from "@/components/CodeArea";
import { getRecentPosts, addPost } from "@/plugins/firestore";
import { useState } from "react";

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

  async function post() {
    const post = {
      body: "bbb",
    };
    const docId = await addPost(post);

    console.log(`Document added with ID: ${docId}`);
  }

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
      {/* 投稿一覧 */}
      <div>
        {posts.map((post, postIdx) => {
          return (
            <div key={postIdx}>
              <p>body: {post.body}</p>
              <p>userId: {post.userId}</p>
              <p>createdAt: {post.createdAt}</p>
            </div>
          );
        })}
      </div>
      <div>
        <CodeArea>display: block;</CodeArea>
      </div>
    </div>
  );
};

export default Home;
