import NavComponent from "@/components/nav/nav";
import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={`flex flex-col justify-center items-center h-screen`}>
        <NavComponent />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
