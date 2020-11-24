import firebase, { db } from "../../plugins/firebase";
import React from "react";
class MessageBox extends React.Component {
  constructor() {
    super();
    console.log("Called constructor");

    //初期値
    this.state = {
      posts: [{ id: 0, title: "Never Ending Story" }],
    };
  }

  static async getInitialProps() {
    let result = await db
      .collection("posts")
      .doc("pLJDgb5B7fy7IK0yL6bS")
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log("not exists");
        }
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
    return { post: result };
  }

  // componentDidMount() {
  //   console.log("Called componentDidMount");

  //   const items = [];
  //   db.collection("posts")
  //     .doc("pLJDgb5B7fy7IK0yL6bS")
  //     .get()
  //     .then((doc) => {
  //       const { title, body } = doc.data();

  //       items.push({
  //         id: doc.id,
  //         title: title,
  //         body: body,
  //       });
  //     });

  //   // //state を更新(した気になる...がしかし)
  //   this.setState({ posts: items });

  //   // console.log("Called setState in componentDidMount");

  //   // //state が変わってない！！
  //   console.log(this.state.posts); // => "なんでもしますから"
  // }

  render() {
    console.log("Called render");

    const post = this.props.post;
    console.log(this.props.post);
    //ここでようやく setState で予約した state の変更を確認
    console.log(this.state.posts);
    // console.log(JSON.stringify(this.state.posts)); //=> "なんでもするとは言ってない"
    // console.log(this.state.posts.length);
    // console.log(Array.from(this.state.posts));
    return (
      <div>
        <h2>{post.title}</h2>
      </div>
    );
  }
}

export default MessageBox;
