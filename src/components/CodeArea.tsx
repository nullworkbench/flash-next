import { FC, useEffect } from "react";
// highlight.js
import hljs from "highlight.js";
// highlight.jsのテーマ指定
import "highlight.js/styles/vs2015.css";

const CodeArea: FC = ({ children }) => {
  // mounted時にhljs実行s
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  return (
    <pre>
      <code className="font-code">{children}</code>
    </pre>
  );
};

export default CodeArea;
