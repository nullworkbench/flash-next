import { auth, signInWithGoogle, signOutNow } from "@/plugins/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useUserInfo } from "@/stores/contexts";
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

  function signIn() {
    signInWithGoogle();
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
    <header className="nmp flex justify-between w-11/12 mx-auto p-4 px-8 mt-8">
      <div></div>
      <div className="absolute left-1/2 transform -translate-x-1/2 w-5 filter drop-shadow-lg">
        <Icon type="FlashLogo" />
      </div>
      {/* User */}

      {userInfo ? (
        // ログイン済み
        <div className="w-10 h-10">
          <button onClick={() => setIsUserInfoModalOpen(true)}>
            <img
              src={userInfo?.photoURL!}
              className="rounded-full"
              alt="ユーザーアイコン"
            />
          </button>
          <Modal
            isOpen={isUserInfoModalOpen}
            closeModal={() => setIsUserInfoModalOpen(false)}
          >
            <div>
              <button onClick={() => signOut()}>signOut</button>
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
