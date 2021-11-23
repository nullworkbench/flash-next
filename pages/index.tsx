import type { NextPage, GetStaticProps } from "next";
import styles from "../styles/Home.module.css";
import CodeArea from "@/components/CodeArea";
// import { getAllPosts } from "@/plugins/firestore";
import { db } from "@/plugins/firebase";
import { collection, query, limit, orderBy, getDocs } from "firebase/firestore";

type Post = {
  title: string;
  userId: string;
};
type Props = {
  posts: Post[];
};

export const getStaticProps: GetStaticProps = async () => {
  const q = query(collection(db, "posts"), orderBy("createdAt"), limit(10));
  const querySnapshot = await getDocs(q);
  const posts: Post[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    posts.push({ title: data.title, userId: "aaa" });
  });
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
