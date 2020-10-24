import hljs from "highlight.js";

export default function highlightjs() {
  // @@@をpre codeに置き換え
  // HTMLCollectionは配列でないためforEachが使えるように配列として代入
  const objs = Array.from(document.getElementsByClassName("post_body"));

  // 全ての@@@を置き換える
  objs.forEach((obj) => {
    while (obj.innerHTML.match(/@@@/)) {
      if (obj.innerHTML.match(/@@@\n/)) {
        obj.innerHTML = obj.innerHTML.replace(/@@@\n/, "<pre><code>");
      } else {
        obj.innerHTML = obj.innerHTML.replace("@@@", "<pre><code>");
      }
      obj.innerHTML = obj.innerHTML.replace("@@@", "</code></pre>");
    }
  });

  // highlight.js実行
  hljs.initHighlighting();
  hljs.initHighlighting.called = false; //hljs側でinitが１回しか走らないようになっているので、そのフラグを折る。
}
