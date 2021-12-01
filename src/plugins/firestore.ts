import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getRecentPosts(num: number) {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(num)
  );
  const querySnapshot = await getDocs(q);
  const posts: Post[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Post型に合わないdocは弾く（likeは0だとfalseになるのでinで存在確認）
    if (data.body && "like" in data && data.userId && data.createdAt) {
      posts.push({
        docId: doc.id,
        body: data.body,
        like: data.like,
        userId: data.userId,
        createdAt: data.createdAt.toDate().toLocaleString("ja-JP"), // 日本式の日付にフォーマット
      });
    } else {
      console.log(data);
    }
  });
  return posts;
}

// firestoreへ新規投稿を行う関数
export async function addPost(args: {
  body: string;
  userId: string;
}): Promise<string | boolean> {
  const post = { ...args, like: 0, createdAt: Timestamp.now() };
  const res = await addDoc(collection(db, "posts"), post)
    .then((docRef) => docRef.id)
    .catch((err) => {
      console.log(err);
      return false;
    });
  return res;
}

// いいね関数
export async function likePost(docId: string) {
  // 現在の値を取得する
  const docRef = doc(db, "posts", docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const res = await updateDoc(docRef, { like: data.like + 1 })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    return res;
  } else {
    // エラー
    return false;
  }
}
