import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const config = {
  // NEXT_PUBLIC_を先頭につけないと、Next.js Server側でしか環境変数を読み込んでくれない
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FNEXT_PUBLIC_IREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// firebase init
const app = initializeApp(config);
export const db = getFirestore(app);
export const auth = getAuth();

// auth
const provider = new GoogleAuthProvider();
export function signInWithGoogle(): Promise<User | boolean> {
  const res = signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const u = result.user;
      const user: User = {
        displayName: u.displayName ?? "名称未設定さん",
        photoURL: u.photoURL ?? "",
        uid: u.uid,
      };
      console.log("signIn successful");
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`SignIn Error: ${errorCode}. ${errorMessage}`);
      return false;
    });
  return res;
}
export function signOutNow(): Promise<boolean> {
  const res = signOut(auth)
    .then(() => {
      // Sign out successful
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return res;
}
