import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "@firebase/firestore";
import { db } from "./firebase";

export async function getRecentPosts(num: number) {
  const q = query(collection(db, "posts"), orderBy("createdAt"), limit(num));
  const querySnapshot = await getDocs(q);
  const posts: Post[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    posts.push({ title: data.title, userId: "aaa" });
  });
  return posts;
}
