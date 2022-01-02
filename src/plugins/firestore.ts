import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  Timestamp,
  addDoc,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { useUserInfo } from "@/stores/contexts";

// doc.data()からPost型のオブジェクトに変換
async function makePostFromDocData(
  docId: string,
  data: DocumentData
): Promise<Post> {
  // dataから取得
  const { body, userId, createdAt } = data;
  const likes = await getLikes(docId);
  // 配列に追加
  const post: Post = {
    docId,
    body,
    likes,
    userId,
    createdAt: createdAt.toDate().toLocaleString("ja-JP"), // 日本式の日付にフォーマット
  };
  return post;
}

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
      const post = await makePostFromDocData(snapshot.id, data);
      posts.push(post);
    }
  }
  return posts;
}

// docIDから投稿を取得
export async function getPostFromID(id: string): Promise<Post | boolean> {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const post = makePostFromDocData(docSnap.id, docSnap.data());
    return post;
  }
  return false;
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
export async function likePost(docId: string, uid: string): Promise<boolean> {
  // いいねオブジェクト作成
  const likeObj = { userId: uid, createdAt: Timestamp.now() };
  // 対象のドキュメントのlikesコレクションに追加
  const res = await addDoc(collection(db, `posts/${docId}/likes`), likeObj)
    .then((docRef) => true)
    .catch((err) => {
      console.log(err);
      return false;
    });
  return res;
}

// いいね解除関数
export async function unlikePost(
  postId: string,
  uid: string
): Promise<boolean> {
  // いいねオブジェクトのdocIdを特定
  const q = query(
    collection(db, `posts/${postId}/likes`),
    where("userId", "==", uid)
  );
  const querySnapshot = await getDocs(q);
  const snapshots: QueryDocumentSnapshot<DocumentData>[] = [];
  querySnapshot.forEach(async (d) => {
    snapshots.push(d);
  });
  const a = async () => {
    for (const snapshot of snapshots) {
      const res = await deleteDoc(
        doc(db, "posts", `${postId}/likes/${snapshot.id}`)
      )
        .then(() => true)
        .catch((err) => {
          console.log(err);
          return false;
        });
      return res;
    }
    return false;
  };
  return a();
}
