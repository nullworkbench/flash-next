import type { NextPage, GetStaticProps } from "next";
import styles from "../styles/Home.module.css";
import CodeArea from "@/components/CodeArea";
import { getRecentPosts } from "@/plugins/firestore";

type Props = {
  posts: Post[];
};

export const getStaticProps: GetStaticProps = async () => {
  // 最新の投稿10件を取得
  const posts = await getRecentPosts(10);

  return { props: { posts } };
};

const Home: NextPage<Props> = ({ posts }: Props) => {
  return (
    <div className="container mx-auto">
      {posts.map((post, postIdx) => {
        return (
          <div key={postIdx}>
            <p>{post.title}</p>
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
