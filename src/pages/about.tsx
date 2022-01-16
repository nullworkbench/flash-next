import { NextPage } from "next";
import Link from "next/link";
import CodeArea from "@/components/CodeArea";

const About: NextPage = () => {
  return (
    <div className="container mx-auto max-w-3xl w-11/12">
      {/* ヒーロー */}
      <section className="mb-24">
        <h2 className="text-8xl font-bold sp:text-7xl">
          Extremely Easy Code Sharing Network.
        </h2>
      </section>
      {/* Flashとは */}
      <section>
        <h2 className="text-4xl font-bold mb-4">What is Flash?</h2>
        <p>
          Flash is a <strong>Extremely Easy Code Sharing Network</strong>.
        </p>
        <p>
          Share your favorite functions, solutions, or something useful to
          anyone who learning programming at any languages.
          <span className="block text-gray-500 mt-2">
            e.g. JavaScirpt, Swift, Ruby, C, Rust and more...
          </span>
        </p>
      </section>
      {/* ミッション */}
      <section>
        <h2 className="text-4xl font-bold mb-3">Our Misson</h2>
        <p className="text-xl pb-2">
          &ldquo; To be all developvers around world can share the code within{" "}
          <span className="text-2xl font-semibold">1 minute</span>. &rdquo;
        </p>
        <p>
          In nowadays, we can find solutions of almost problems in the internet
          when we faced to problems or issues. But sometims, we can&apos;t find
          the solution or originally there is no search results. Because most of
          developers don&apos;t write about solution to blogs or websites.
          Blogging is a good way of sharing code. But writing it will takes
          time. This is why they don&apos;t write blogs.
        </p>
        <p>
          Getting over this problem is <strong>why Flash was born</strong>.
        </p>
        <p>
          Flash is easy to use and it will help developers to share any
          solutions to everyone who facing same problem.
        </p>
      </section>
      {/* 使い方 */}
      <section>
        <h2 className="text-4xl font-bold mb-4">How to use it</h2>
        <p>
          When you&apos;ve found a solution that isn&apos;t in the search
          results yet, <strong>copy the working code</strong>. Then{" "}
          <strong>paste it to Flash</strong>, and <strong>Post</strong>.
          That&apos;s it.
        </p>
        <p>
          <ol className="list-decimal pl-8">
            <li className="mb-2">Copy the code.</li>
            <li className="mb-2">
              Paste to Flash. And surround code with @. Flash will autmatially
              syntax highlight your code.
              <div>
                <p>
                  Ex) If you write like this{" "}
                  <span className="px-2 py-1 text-sm bg-gray-300">
                    <code>@@@ display: block; @@@</code>
                  </span>
                </p>
                <p>Flash will show as like this</p>
                <CodeArea code={"display: block;"} />
              </div>
              <span className="text-gray-500">
                (optional: In addition, please write descriptions.)
              </span>
            </li>
            <li>Post it.</li>
          </ol>
        </p>
        <p>Just posting it, your code will help someone in the world ;)</p>
      </section>
      {/* 投稿への誘導 */}
      <section className="text-center mt-24">
        <h2 className="text-4xl font-bold mb-8">Let&apos;s Flash it!</h2>
        <Link href={"/"} passHref>
          <a className="px-20 py-4 bg-yellow-300 rounded-md focus:outline-none">
            Start using Flash
          </a>
        </Link>
      </section>
      <div style={{ paddingBottom: "10rem" }}></div>
      <style jsx>{`
        p {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default About;
