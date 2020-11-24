import firebase, { db } from "../../plugins/firebase";
// import highlightjs from "../../components/highlight";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
    };
  }

  // static async getInitialProps({ query }) {
  //   console.log(query.id);
  //   // this.setState({
  //   //   docId: query.id,
  //   // });
  //   const docId = query.id;
  //   return {
  //     docId,
  //   };
  // }

  componentDidMount() {
    let items = [];
    db.collection("posts")
      .doc("pLJDgb5B7fy7IK0yL6bS")
      .get()
      .then((doc) => {
        const { title, body } = doc.data();

        items.push({
          id: doc.id,
          title: title,
          body: body,
        });
      });
    this.setState({
      post: items,
    });
  }

  render() {
    // const post = this.state.post;
    return (
      <div>
        <button onClick={() => console.log(this.state.post[0].title)}>
          AAAAAA
        </button>
        {/* {console.log(this.state.post[0].title)} */}
        {/* <h2>{this.state.post[0].title}</h2> */}
        {/* <div className="post_body">{post.body}</div> */}
      </div>
    );
  }
}

export default Detail;
