import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="md:flex md:justify-center md:items-center md:mx-auto bg-slate-100 dark:text-white dark:bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
