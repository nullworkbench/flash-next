import firebase, { db } from "../plugins/firebase";
import highlightjs from "../components/highlight";

import Head from "next/head";
import Link from "next/link";
import styles from "../styles/index.module.scss";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      posts: [],
    };
  }

  // collectionが更新された時
  onCollectionUpdate = (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      const { title, body, createdAt } = doc.data();
      items.push({
        id: doc.id,
        title: title,
        body: body,
        createdAt: createdAt,
      });
    });
    this.setState({
      posts: items,
    });
    // console.log(this.state.posts);

    // @@@置き換え＆highlight.js
    highlightjs();
  };

  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }
  logout() {
    firebase.auth().signOut();
  }

  // post処理
  async handlePost(event) {
    event.preventDefault(); // formのsubmitをキャンセル

    const title = document.getElementById("new_post_title").value;
    const body = document.getElementById("new_post_body").value;

    const res = await db.collection("posts").add({
      title: title,
      body: body,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  // delete処理
  handleDelete(docId) {
    if (confirm("Are you sure want to Delete?")) {
      db.collection("posts").doc(docId).delete();
    }
  }

  // update処理
  async handleUpdate(docId) {
    const title = document.getElementById("renew_post_title_" + docId).value;
    document.getElementById("renew_post_title_" + docId).value = "";
    const res = await db
      .collection("posts")
      .doc(docId)
      .update({ title: title })
      .then(() => {
        // success
        console.log("success");
      })
      .catch((error) => {
        // error
        console.log(error);
      });
  }

  // 改行によって高さを改変
  execTextareaHeight() {
    const textarea = document.getElementById("new_post_body");
    const lines = (textarea.value + "\n").match(/\n/g).length;
    textarea.style.height = lines + 1 + "rem";
  }

  async componentDidMount() {
    // posts取得・リアルタイム更新
    this.unsubscribe = db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot(this.onCollectionUpdate);

    // firebaseのauthの状態が変わった時にthis.state.userにユーザー情報を代入
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
      // console.log(user);
    });
  }

  componentWillUnmount() {
    //posts 監視終了
    this.unsubscribe();
  }

  render() {
    return (
      <div>
        <Head>
          <title>Flash</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* LOGIN START */}
        <div>
          {this.state.user ? (
            <button onClick={this.logout}>Logout</button>
          ) : (
            <button onClick={this.login}>Login</button>
          )}
        </div>
        {/* LOGIN END */}

        {/* 新規投稿 START */}
        <div id="new_post" className={styles.new_post}>
          <form onSubmit={this.handlePost}>
            <input type="text" id="new_post_title" placeholder="title" />
            <textarea
              id="new_post_body"
              onChange={() => this.execTextareaHeight()}
            />
            <button type="submit">POST</button>
          </form>
        </div>
        {/* 新規投稿 END */}

        {/* 投稿一覧 START */}
        <div id="posts">
          {this.state.posts.map((post) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <div className={styles.post_body + " post_body"}>{post.body}</div>
              <button onClick={() => this.handleDelete(post.id)}>DELETE</button>
              {/* onClick={this.handleDelete(post.id)} とすると {}内がプログラムとして認識され、handleDelete()が発火してしまう */}
              <Link href="/posts/[id]" as={`/posts/${post.id}`}>
                <a>Detail</a>
              </Link>
              <div id="renew">
                <input
                  type="text"
                  id={"renew_post_title_" + post.id}
                  placeholder={post.title}
                />
                <button onClick={() => this.handleUpdate(post.id)}>
                  UPDATE
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* 投稿一覧 END */}
        <button onClick={this.replaceHighlights}>REPLACE</button>
        <div>
          <pre>
            <code>
              {`
  function $initHighlight(block, cls) {
    try {
      if (cls.search(/\bno\-highlight\b/) != -1)
        return process(block, true, 0x0F) + 
           ' class=""';
    } catch (e) {
    /* handle exception */
    }
    for (var i = 0 / 2; i < classes.length; i++) {
      if (checkCondition(classes[i]) === undefined)
        return /\d+[\s/]/g;
    }
  }
  `}
            </code>
          </pre>
        </div>
      </div>
    );
  }
}
export default Index;
