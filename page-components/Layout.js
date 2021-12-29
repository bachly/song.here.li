import React from 'react';
import Head from "next/head";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { basePath, pathname } = useRouter();

  const seoTitle = 'SongHere';
  const description = 'A Bring-Your-Own-Data (BYOD) Web App to manage songs, chords and performances.';
  const logo = '';

  return (
    <>
      <Head>
        <title>{seoTitle}</title>

        <meta charSet="utf-8" />
        <meta
          content={description}
          name="description"
        />
        {/* <meta name="robots" content="noindex" /> */}
        <meta content={seoTitle} property="og:title" />
        <meta content={description} property="og:description" />
        <meta content={`website`} property="og:type" />
        <meta content={logo} property="og:image" />
        <meta content={seoTitle} property="twitter:title" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />

        {/* CSS */}
        {/* <link href={`${basePath}/css/tailwind.css`} rel="stylesheet" type="text/css" /> */}

        {/* Favicons from favicon.io */}
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/favicon_io/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon_io/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/favicon_io/favicon-16x16.png`} />
        <link rel="manifest" href={`${basePath}/favicon_io/site.webmanifest`} />

        {/* Head Javascript */}
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </Head>
      <main>
        {children}
      </main>
    </>
  );
};
