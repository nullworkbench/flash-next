import { FC, useEffect, useRef } from "react";
// highlight.js
import hljs from "highlight.js/lib/common";
// highlight.jsのテーマ指定
// import "highlight.js/styles/vs2015.css";
// import "highlight.js/styles/atom-one-dark.css";
// import "highlight.js/styles/base16/woodland.css";
import "highlight.js/styles/base16/material-darker.css";

type Props = { code: string };

const CodeArea: FC<Props> = ({ code }: Props) => {
  const ref = useRef(null);

  // コードの言語を判定（不明の場合はnull）
  const language = hljs.highlightAuto(code).language;

  // mounted時にhljs実行
  useEffect(() => {
    hljs.highlightElement(ref.current!);
  }, []);
  return (
    <pre className="relative py-2">
      <span className="absolute top-5 left-4 px-3 text-sm text-black bg-gray-300 rounded-md">
        {language == "bash" ? "" : language}
      </span>
      <code
        ref={ref}
        className="px-2 py-1 font-code rounded-md"
        style={{
          padding: "1.5rem 2rem",
          paddingTop: language
            ? language == "bash"
              ? "1.8rem"
              : "3rem"
            : "1.8rem",
        }} // hljsで上書きされないように
      >
        {code}
      </code>
    </pre>
  );
};

export default CodeArea;
