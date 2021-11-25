import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getRecentPosts(num: number) {
  const q = query(collection(db, "posts"), orderBy("createdAt"), limit(num));
  const querySnapshot = await getDocs(q);
  const posts: Post[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Post型に合わないdocは弾く
    if (data.body && data.userId && data.createdAt) {
      posts.push({
        body: data.body,
        userId: data.userId,
        createdAt: data.createdAt.toDate().toLocaleString("ja-JP"), // 日本式の日付にフォーマット
      });
    }
  });
  return posts;
}

// firestoreへ新規投稿を行う関数
export async function addPost(args: {
  body: string;
  userId: string;
}): Promise<string | boolean> {
  const post = { ...args, createdAt: Timestamp.now() };
  const res = await addDoc(collection(db, "posts"), post)
    .then((docRef) => docRef.id)
    .catch((err) => {
      console.log(err);
      return false;
    });
  return res;
}
