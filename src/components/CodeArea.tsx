import { FC, useEffect } from "react";
// highlight.js
import hljs from "highlight.js";
// highlight.jsのテーマ指定
import "highlight.js/styles/vs2015.css";

const CodeArea: FC = ({ children }) => {
  // mounted時にhljs実行
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  return (
    <pre className="py-2">
      <code className="font-code rounded-md" style={{ padding: "1.5rem 2rem" }}>
        {children}
      </code>
    </pre>
  );
};

export default CodeArea;
