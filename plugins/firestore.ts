import { collectionGroup, limit, orderBy, query } from "@firebase/firestore";
import { db } from "./firebase";

export function getAllPosts() {
  const q = query(
    collectionGroup(db, "posts"),
    orderBy("createdAt"),
    limit(10)
  );
  return q;
}
