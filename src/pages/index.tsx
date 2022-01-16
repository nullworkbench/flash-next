import type { NextPage, GetStaticProps } from "next";
import CodeArea from "@/components/CodeArea";
import {
  getRecentPosts,
  addPost,
  likePost,
  unlikePost,
  getPostFromID,
} from "@/plugins/firestore";
import { getAuth } from "firebase/auth";
import { useUserInfo } from "@/stores/contexts";
import { useRef, useState } from "react";
import Icon from "@/components/Icon";
import PopupMenu from "@/components/PopupMenu";

type Props = {
  initialPosts: Post[];
};

export const getStaticProps: GetStaticProps = async () => {
  // 最新の投稿10件を取得
  const posts = await getRecentPosts(10);
  return { props: { initialPosts: posts } };
};

const Home: NextPage<Props> = ({ initialPosts }: Props) => {
  // 投稿情報
  const [posts, setPosts] = useState(initialPosts);
  // ユーザー情報
  const { data: userInfo } = useUserInfo();
  // Formのbody
  const [formBody, setFormBody] = useState("");

  // 新規投稿
  async function post() {
    // ログインしているか
    if (userInfo) {
      // formが入力されているか
      if (formBody.match(/\S/g)) {
        const post = {
          body: formBody,
          userId: userInfo.uid,
        };
        const docId = await addPost(post);

        if (docId) {
          // 投稿成功
          console.log(`Document added with ID: ${docId}`);
          // 投稿一覧を更新
          const refreshedPost = await getRecentPosts(10);
          setPosts([...refreshedPost]);
          // formのtextareaをクリア
          setFormBody("");
        } else {
          // 投稿失敗
          console.log("Unable to add Document.");
        }
      } else {
        alert("Please enter the content.");
      }
    } else {
      alert("Please login first.");
    }
  }

  // いいね
  async function like(docId: string, idx: number) {
    if (userInfo) {
      const uid = userInfo.uid;
      // いいね済み
      if (posts[idx].likes.find((like) => like.userId == uid)) {
        const res = await unlikePost(docId, uid);
        if (res) {
          // uidが一致するオブジェクトを全て取り除く
          const filteredPosts = posts;
          filteredPosts[idx].likes = filteredPosts[idx].likes.filter(
            (like) => like.userId != uid
          );
          setPosts([...filteredPosts]);
        } else {
          console.log("Error unliking post");
        }
      } else {
        // 未いいね
        const res = await likePost(docId, uid);
        if (res) {
          // いいねオブジェクトの追加
          const newPosts = posts;
          newPosts[idx].likes.push({ userId: uid, createdAt: new Date() });
          setPosts([...newPosts]);
        } else {
          console.log("Error liking post");
        }
      }
    } else {
      alert("Please login first.");
    }
  }

  // bodyをJSX.Elementに整形
  function splitBody(body: string): JSX.Element {
    // bodyを改行文字で区切る
    const splittedBody = body.split("\n");
    // コードが入ったインデックスを保存する配列
    const codeIndexes: { begin: number; size: number }[] = [];
    // コードの開始（@@@）を判定
    let isCodeHead = true;
    // コードが入っている場所を判定
    splittedBody.map((str, strIdx) => {
      if (str.match("@@@")) {
        // 開始タグであればインデックスを保存
        if (isCodeHead) {
          codeIndexes.push({ begin: strIdx + 1, size: 0 });
          isCodeHead = false;
        } else {
          const v = codeIndexes[codeIndexes.length - 1];
          v.size = strIdx - v.begin;
          isCodeHead = true;
        }
      }
    });
    // スキップしてほしいカウント
    let skipCount = 0;
    // CodeAreaを含むBody Elmentを構成
    return (
      <>
        {splittedBody.map((b, bIdx) => {
          // スキップカウント
          if (skipCount > 0) {
            skipCount--;
            return;
          }
          // @@@はスキップ
          if (b.match("@@@")) return;
          // 空は改行
          if (b.length == 0) return <br key={bIdx} />;
          // codeIndexesに含まれていればCodeArea
          for (let i = 0; i < codeIndexes.length; i++) {
            const c = codeIndexes[i];
            if (c.begin == bIdx) {
              skipCount = c.size;
              return (
                <CodeArea
                  key={bIdx}
                  code={[...Array(c.size)]
                    .map((_, idx) => splittedBody[bIdx + idx] + "\n")
                    .join("")}
                />
              );
            }
          }
          // その他はそのまま出力
          return <p key={bIdx}>{b}</p>;
        })}
      </>
    );
  }

  return (
    <div className="container mx-auto">
      {/* 新規投稿 */}
      <section>
        <h3 className="text-center text-2xl font-semibold mb-6">
          Share your Flash
        </h3>
        <div className="nmp p-8 max-w-lg mx-auto">
          <textarea
            name="body"
            className="block w-full resize-y bg-transparent outline-none"
            rows={3}
            placeholder="Type Something Flashable..."
            value={formBody}
            onChange={(e) => {
              setFormBody(e.currentTarget.value);
            }}
          ></textarea>
          <button className="block ml-auto mr-0" onClick={() => post()}>
            Post
          </button>
        </div>
      </section>

      {/* 投稿一覧 */}
      <section>
        <h3 className="text-center text-2xl font-semibold mb-6">
          Recent Flashes
        </h3>
        {posts.map((post, postIdx) => {
          return (
            <div
              key={postIdx}
              className="nmp relative mx-auto p-8 mb-16 sp:p-6 sp:mb-8"
              style={{ width: "95%" }}
            >
              <div className="flex justify-between">
                <div>@{post.userId}</div>
                <div>
                  {getAuth().currentUser &&
                  getAuth().currentUser?.uid == post.userId ? (
                    // 投稿したユーザーでログイン済みの場合のみメニューを表示
                    <PopupMenu docId={post.docId} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="px-4 my-4 sp:px-0">{splitBody(post.body)}</div>
              <div className="flex justify-between px-4 sp:px-0">
                <div
                  onClick={() => like(post.docId, postIdx)}
                  className="flex items-center cursor-pointer"
                >
                  <Icon
                    type="Fire"
                    size={24}
                    fill={
                      post.likes.find((like) => like.userId == userInfo?.uid)
                        ? "#ef4c5f"
                        : "#c7c7c7"
                    }
                  />
                  <span className="pl-3 pt-1">{post.likes.length}</span>
                </div>
                <div className="text-right text-gray-400">{post.createdAt}</div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Home;
