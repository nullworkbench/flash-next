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
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

async function getLikes(docId: string): Promise<Like[]> {
  // docIdのサブコレクションlikes
  const q = query(
    collection(db, `/posts/${docId}/likes`),
    orderBy("createdAt", "desc"),
    limit(99)
  );
  // 取得（エラーが起きたら空配列）
  const querySnapshot = await getDocs(q).catch((err) => []);
  // likesを配列にまとめてreturn
  const likes: Like[] = [];
  querySnapshot.forEach((snap) => {
    const data = snap.data();
    if (data.userId && data.createdAt) {
      const { userId, createdAt } = data;
      likes.push({
        userId,
        createdAt: createdAt.toDate().toLocaleString("ja-JP"),
      });
    }
  });
  return likes;
}

export async function getRecentPosts(num: number): Promise<Post[]> {
  // postsの取得
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(num)
  );
  const querySnapshot = await getDocs(q);
  // for文を使って処理したいので配列に格納し直す
  const snapshots: QueryDocumentSnapshot<DocumentData>[] = [];
  querySnapshot.forEach((doc) => {
    snapshots.push(doc);
  });
  // postsを構成
  const posts: Post[] = [];
  for (const snapshot of snapshots) {
    const data = snapshot.data();
    // Post型に合わないdocは弾く
    if (data.body && data.userId && data.createdAt) {
      // dataから取得
      const { body, userId, createdAt } = data;
      const likes = await getLikes(snapshot.id);
      // 配列に追加
      const post: Post = {
        docId: snapshot.id,
        body,
        likes,
        userId,
        createdAt: createdAt.toDate().toLocaleString("ja-JP"), // 日本式の日付にフォーマット
      };
      posts.push(post);
    }
  }
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
export async function likePost(docId: string): Promise<boolean> {
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
