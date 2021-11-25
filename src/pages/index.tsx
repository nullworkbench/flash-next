import type { NextPage, GetStaticProps } from "next";
import styles from "../styles/Home.module.css";
import CodeArea from "@/components/CodeArea";
import { getRecentPosts, addPost } from "@/plugins/firestore";
import { useUserInfo } from "@/stores/contexts";
import { useState } from "react";

type Props = {
  posts: Post[];
};

export const getStaticProps: GetStaticProps = async () => {
  // 最新の投稿10件を取得
  const posts = await getRecentPosts(10);

  return { props: { posts } };
};

const Home: NextPage<Props> = ({ posts }: Props) => {
  // ユーザー情報
  const { data: userInfo } = useUserInfo();
  // Formのbody
  const [formBody, setFormBody] = useState("");

  // 新規投稿
  async function post() {
    // ログインしているか
    if (userInfo) {
      const post = {
        body: formBody,
        userId: userInfo.uid,
      };
      const docId = await addPost(post);

      docId
        ? console.log(`Document added with ID: ${docId}`)
        : console.log("Unable to add Document.");
    } else {
      alert("Please login first.");
    }
  }

  // bodyをJSX.Elementに整形
  function splitBody(body: string): JSX.Element {
    // bodyを改行文字で区切る
    const splittedBody = body.split("\n");
    // コードが入ったインデックスを保存する配列
    const codeIndexes: number[] = [];
    // コードの開始（@@@）を判定
    let isCodeHead = true;
    // コードが入っている場所を判定
    splittedBody.map((str, strIdx) => {
      if (str.match("@@@")) {
        // 開始タグであればインデックスを保存
        if (isCodeHead) {
          codeIndexes.push(strIdx + 1);
          isCodeHead = false;
        } else {
          isCodeHead = true;
        }
      }
    });
    // CodeAreaを含むBody Elmentを構成
    const bodyElm = (
      <>
        {splittedBody.map((b, idx) => {
          // codeIndexesに含まれていればCodeArea
          if (codeIndexes.includes(idx)) {
            return <CodeArea key={idx}>{b}</CodeArea>;
          }
          // @@@はスキップ
          if (b.match("@@@")) return;
          // 空は改行
          if (b.length == 0) return <br key={idx} />;
          // その他はそのまま出力
          return <p key={idx}>{b}</p>;
        })}
      </>
    );

    return bodyElm;
  }

  return (
    <div className="container mx-auto">
      {/* 新規投稿 */}
      <section className="nmp p-8 max-w-lg mx-auto">
        <textarea
          name="body"
          className="block w-full resize-y bg-transparent outline-none"
          rows={3}
          placeholder="Type Something Flashable..."
          onChange={(e) => {
            setFormBody(e.currentTarget.value);
          }}
        ></textarea>
        <button className="block ml-auto mr-0" onClick={() => post()}>
          Post
        </button>
      </section>
      {/* 投稿一覧 */}
      <section>
        {posts.map((post, postIdx) => {
          return (
            <div key={postIdx} className="nmp p-8 mb-16">
              <div>@{post.userId}</div>
              <div className="my-4">{splitBody(post.body)}</div>
              <div className="text-right text-gray-400">{post.createdAt}</div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Home;
