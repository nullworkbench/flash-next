import firebase, { db } from "../plugins/firebase";

import Head from "next/head";
import styles from "../styles/Home.module.css";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      posts: [],
    };
  }

  // async getPosts() {
  //   const items = [];
  //   await db
  //     .collection("posts")
  //     .orderBy("createdAt", "desc")
  //     .get()
  //     .then((docs) => {
  //       docs.forEach((doc) => {
  //         let item = doc.data();
  //         item.id = doc.id;
  //         items.push(item);
  //       });
  //       this.setState({ posts: items }); // this.state.posts.pushはダメなのでsetStateで
  //     });
  //   console.log(this.state.posts);
  //   console.log(this.state.posts.length);
  // }

  onCollectionUpdate = (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      const { title, createdAt } = doc.data();
      items.push({
        id: doc.id,
        title: title,
        createdAt: createdAt,
      });
    });
    this.setState({
      posts: items,
    });
    console.log(this.state.posts);
  };

  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }
  logout() {
    firebase.auth().signOut();
  }

  async handlePost(event) {
    event.preventDefault();

    const title = document.getElementById("new_post_title").value;

    const res = await db.collection("posts").add({
      title: title,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  handleDelete(docId) {
    db.collection("posts").doc(docId).delete();
  }

  async handleUpdate(docId) {
    const title = document.getElementById("renew_post_title").value;
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
    console.log(res);
  }

  async componentDidMount() {
    // await this.getPosts();

    // db.collection("posts").onSnapshot((snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     if (change.type === "added") {
    //       console.log("added");
    //       this.getPosts();
    //     } else if (change.type === "modified") {
    //       console.log("modified");
    //       this.getPosts();
    //     } else if (change.type === "removed") {
    //       console.log("removed");
    //       this.getPosts();
    //     }
    //   });
    // });

    this.unsubscribe = db
      .collection("posts")
      .onSnapshot(this.onCollectionUpdate);

    // firebaseのauthの状態が変わった時にthis.state.userにユーザー情報を代入
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
      // console.log(user);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    // db.collection("posts").onSnapshot(() => {});
  }

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Flash</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div>
          {this.state.user ? (
            <button onClick={this.logout}>Logout</button>
          ) : (
            <button onClick={this.login}>Login</button>
          )}
        </div>

        <div id="new_post">
          <form onSubmit={this.handlePost}>
            <input type="text" id="new_post_title" placeholder="title" />
            <textarea id="new_post_body" cols="30" rows="10"></textarea>
            <button type="submit">POST</button>
          </form>
        </div>

        <div id="posts">
          {this.state.posts.map((post) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <span>{post.id}</span>
              <button onClick={() => this.handleDelete(post.id)}>DELETE</button>
              {/* onClick={this.handleDelete(post.id)} とすると {}内がプログラムとして認識され、handleDelete()が発火してしまう */}
              <div id="renew">
                <input
                  type="text"
                  id="renew_post_title"
                  placeholder={post.title}
                />
                <button onClick={() => this.handleUpdate(post.id)}>
                  UPDATE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default Index;
