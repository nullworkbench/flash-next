import { auth, signInWithGoogle, signOutNow } from "@/plugins/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useUserInfo } from "@/stores/contexts";
import Link from "next/link";
import Icon from "./Icon";
import Modal from "./Modal";
import { useState } from "react";

const GlobalHeader: React.FC = () => {
  // userInfoのモーダルが開いているか
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);

  // userDataをstoreから取得
  const { data: userInfo, mutate: mutateUserInfo } = useUserInfo();
  // userを空、もしくは更新する関数
  const updateUser = (u: User | null) => {
    mutateUserInfo(u);
  };

  // firebaseAuthの認証状態をリッスン
  onAuthStateChanged(auth, (u) => {
    if (u) {
      const newUser: User = {
        displayName: u.displayName ?? "名称未設定さん",
        photoURL: u.photoURL ?? "",
        uid: u.uid,
      };
      updateUser(newUser);
    } else {
      // Not signned in
    }
  });

  async function signIn() {
    const res = await signInWithGoogle();
    if (res && res != true) {
      updateUser(res);
    }
  }
  async function signOut() {
    // signOutが正常に終了すればuserを空に
    const res = await signOutNow();
    if (res) {
      updateUser(null);
    } else {
      // signOut failed
    }
  }

  return (
    <header
      className="nmp sticky z-50 top-4 flex justify-between items-center mx-auto p-4 px-8 mt-8 sp:px-5"
      style={{ width: "95%" }}
    >
      <div>
        <Link href="/about" passHref>
          <a className="text-gray-400 hover:text-blue-400 transition-colors">
            What&apos;s Flash?
          </a>
        </Link>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 w-5 filter drop-shadow-lg">
        <Link href="/" passHref>
          <a>
            <Icon type="FlashLogo" />
          </a>
        </Link>
      </div>
      {/* User */}

      {userInfo ? (
        // ログイン済み
        <div className="w-10 h-10">
          <button onClick={() => setIsUserInfoModalOpen(true)}>
            <img
              src={userInfo.photoURL ?? ""}
              className="rounded-full"
              alt="ユーザーアイコン"
            />
          </button>
          <Modal
            isOpen={isUserInfoModalOpen}
            closeModal={() => setIsUserInfoModalOpen(false)}
          >
            <div className="p-8">
              <img
                src={userInfo.photoURL ?? ""}
                className="w-1/4 mx-auto mb-3 rounded-full"
                alt="ユーザーアイコン"
              />
              <p className="text-center text-2xl font-semibold mb-10">
                {userInfo.displayName}
              </p>
              <button
                className="block mx-auto px-12 py-2 rounded-lg bg-blue-200"
                onClick={() => signOut()}
              >
                sign out
              </button>
            </div>
          </Modal>
        </div>
      ) : (
        // 未ログイン
        <button className="py-2" onClick={() => signIn()}>
          signIn
        </button>
      )}
    </header>
  );
};

export default GlobalHeader;
