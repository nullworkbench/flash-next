import firebase, { db } from "../../plugins/firebase";
import highlightjs from "../../components/highlight";

import { useRouter, withRouter } from "next/router";

function Detail({ post }) {
  return (
    <div>
      <h2>{post[0].title}</h2>
      <div className="post_body">{post[0].body}</div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let post = [];
  const res = await db
    .collection("posts")
    .doc(context.query.id)
    .get()
    .then((doc) => {
      //   console.log(doc.data());
      post.push({
        title: doc.data().title,
        body: doc.data().body,
      });
    });
  return {
    props: {
      post,
    },
  };
}

export default withRouter(Detail);
