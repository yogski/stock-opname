import { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/global.css';
import 'antd/dist/antd.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <title>Stock Opname</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="The simplest stock opname tool on internet" />
      <meta name="theme-color" content="#000000" />
    </Head>
    <Component {...pageProps} />
    </>
  );
}
