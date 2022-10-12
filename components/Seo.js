import Head from "next/head";

export default function Seo({ pageTitle }) {
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>
      <meta
        name="description"
        content="A simple messaging board created with Next.js and Firebase"
      ></meta>
      <meta property="og:title" content={pageTitle} />
    </Head>
  );
}
