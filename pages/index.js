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
      isFetching: true,
      user: null,
      posts: [],
    };
  }

  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }
  logout() {
    firebase.auth().signOut();
  }

  // this.stateがundefindになってしまうのでアロー関数を使う
  showUserInfo = () => {
    console.log(this.state.user);
  };

  // posts取得
  getPosts = async () => {
    // const items = [];

    const snapshots = await db
      .collectionGroup("posts")
      .orderBy("createdAt", "desc")
      .get();
    console.log("1: snapshots end");
    // console.log(snapshots);

    // const res = await snapshots.forEach(async (doc) => {
    //   const { title, body, userId, createdAt } = doc.data();
    //   // usernameを取得
    //   const userRef = await db.collection("users").doc(userId).get();
    //   const username = userRef.data().name;
    //   // console.log(username);

    //   items.push({
    //     id: doc.id,
    //     title: title,
    //     body: body,
    //     username: username,
    //     createdAt: createdAt,
    //   });

    //   console.log("2: forEach end");
    // });

    const items = snapshots.docs.map((doc) => {
      return Object.assign(doc.data(), { id: doc.id });
    });

    this.setState({
      posts: items,
      isFetching: false,
    });

    // console.log(this.state.posts);
  };

  // post処理
  handlePost = async () => {
    // const user = this.state.user;
    // console.log(this.state.user);

    const title = document.getElementById("new_post_title");
    const body = document.getElementById("new_post_body");

    const res = await db
      .collection("users")
      .doc(this.state.user.uid)
      .collection("posts")
      .add({
        title: title.value,
        body: body.value,
        userId: this.state.user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        // success
        console.log("post succeed");
        title.value = "";
        body.value = "";
      })
      .catch((error) => {
        // error
        console.log(error);
      });
  };

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
        console.log("update succeed");
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

  async addUser(user) {
    const res = await db
      .collection("users")
      .add({
        uid: user.uid,
        name: user.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        // success
        console.log("user addeed");
      })
      .catch((error) => {
        // error
        console.log(error);
      });
  }

  componentDidMount() {
    // posts取得
    this.getPosts();
    // @@@置き換え＆highlight.js
    highlightjs();

    console.log(this.state.posts);

    // firebaseのauthの状態が変わった時にthis.state.userにユーザー情報を代入
    firebase.auth().onAuthStateChanged((user) => {
      const res = db
        .collection("users")
        .where("uid", "==", user.uid)
        .get()
        .then((snapshot) => {
          // userが存在するか確認
          if (snapshot.empty) {
            console.log("no matching");
            this.addUser(user);
          } else {
            console.log("user already exists!");
          }
        })
        .catch((error) => {
          // error
          console.log(error);
        });

      this.setState({ user });
    });
  }

  componentWillUnmount() {
    //posts 監視終了
    // this.unsubscribe();
  }

  render() {
    return (
      <div>
        {console.log("render")}
        {this.state.isFetching ? (
          <div>Loading...</div>
        ) : (
          <div>
            <Head>
              <title>Flash</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* LOGIN START */}
            <div>
              {this.state.user ? (
                <div>
                  <p>Hi, {this.state.user.displayName}</p>
                  <button onClick={this.logout}>Logout</button>
                </div>
              ) : (
                <div>
                  <button onClick={this.login}>Login</button>
                </div>
              )}
            </div>
            {/* LOGIN END */}

            {/* USER INFO START */}
            <div className={styles.userinfo}>
              {/* <span>{this.state.user.displayName}</span> */}
            </div>
            {/* USER INFO END */}

            {/* 新規投稿 START */}
            <div id="new_post" className={styles.new_post}>
              <div>
                <input type="text" id="new_post_title" placeholder="title" />
                <textarea
                  id="new_post_body"
                  onChange={() => this.execTextareaHeight()}
                />
                <button onClick={this.handlePost}>POST</button>
              </div>
            </div>
            {/* 新規投稿 END */}

            {/* 投稿一覧 START */}
            <section className={styles.posts_wrapper}>
              <div id="posts">
                {console.log(this.state.posts)}
                {this.state.posts.map((post) => (
                  <article key={post.id} className={styles.post_wrapper}>
                    <h3>{post.title}</h3>
                    <div className={styles.post_body + " post_body"}>
                      {post.body}
                    </div>
                    <div>
                      <span>{post.username}</span>
                    </div>
                    <button onClick={() => this.handleDelete(post.id)}>
                      DELETE
                    </button>
                    {/* onClick={this.handleDelete(post.id)} とすると {}内がプログラムとして認識され、render時にhandleDelete()が発火してしまう */}
                    <Link
                      href={{ pathname: "/post/[id]", query: { id: post.id } }}
                    >
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
                  </article>
                ))}
              </div>
            </section>
            {/* 投稿一覧 END */}
            <div>
              <br />
              <button onClick={this.showUserInfo}>show user info</button>
              <br />
            </div>
            <div>
              <br />
              <br />
              <br />
              <p>SAMPLE</p>
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
        )}
      </div>
    );
  }
}
export default Index;
