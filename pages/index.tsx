import type { NextPage, GetStaticProps } from "next";
import styles from "../styles/Home.module.css";
import CodeArea from "@/components/CodeArea";
// import { getAllPosts } from "@/plugins/firestore";
import { db, auth, signInWithGoogle, signOutNow } from "@/plugins/firebase";
import { collection, query, limit, orderBy, getDocs } from "firebase/firestore";
import { useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";

type User = {
  displayName: string;
  photoURL: string;
  uid: string;
};

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
  const [user, setUser] = useState<User>();

  onAuthStateChanged(auth, (u) => {
    if (u) {
      const newUser: User = {
        displayName: u.displayName ?? "名称未設定さん",
        photoURL: u.photoURL ?? "",
        uid: u.uid,
      };
      if (!user) {
        setUser(newUser);
      }
    } else {
      // Not signned in
    }
  });

  function signIn() {
    signInWithGoogle();
  }
  async function signOut() {
    // signOutが正常に終了すればuserを空に
    const res = await signOutNow();
    if (res) {
      setUser(undefined);
    } else {
      // signOut failed
    }
  }

  return (
    <div className="container mx-auto">
      <div>
        <button onClick={() => signIn()}>signIn</button>
        <p>{user ? user.displayName : "_"}</p>
        <button onClick={() => signOut()}>signOut</button>
      </div>
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
