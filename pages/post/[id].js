import firebase, { db } from "../../plugins/firebase";
import highlightjs from "../../components/highlight";

import React from "react";
class MessageBox extends React.Component {
  constructor() {
    super();

    //初期値
    this.state = {};
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

  componentDidMount() {
    console.log("Called componentDidMount");

    let obj = this.props.post.body;
    // 全ての@@@を置き換える
    while (obj.match(/@@@/)) {
      if (obj.match(/@@@\n/)) {
        obj = obj.replace(/@@@\n/, "<pre><code>");
      } else {
        obj = obj.replace("@@@", "<pre><code>");
      }
      obj = obj.replace("@@@", "</code></pre>");
    }

    const target = document.getElementById("post_body");
    target.insertAdjacentHTML("afterbegin", obj);
    highlightjs();
  }

  render() {
    const post = this.props.post;
    return (
      <div>
        <h2>{post.title}</h2>
        <div id="post_body"></div>
      </div>
    );
  }
}

export default MessageBox;
