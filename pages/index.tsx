import type { NextPage, GetStaticProps } from "next";
import styles from "../styles/Home.module.css";
import CodeArea from "@/components/CodeArea";
import { getRecentPosts, addPost } from "@/plugins/firestore";
import { useUserInfo } from "@/stores/contexts";
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
  // ユーザー情報
  const { data: userInfo } = useUserInfo();
  // Formのbody
  const [formBody, setFormBody] = useState("");

  // 新規投稿
  async function post() {
    // ログインしているか
    if (userInfo) {
      const post = {
        body: formBody,
        userId: userInfo.uid,
      };
      const docId = await addPost(post);

      docId
        ? console.log(`Document added with ID: ${docId}`)
        : console.log("Unable to add Document.");
    } else {
      alert("Please login first.");
    }
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
