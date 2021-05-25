import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Credits() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Credits
        </h1>

        <p className={styles.description}>
          Favicon : <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
        </p>
      </main>

      <footer className={styles.footer}>
        Created by 
        <a href="https://yogski.github.io"
          target="_blank"
          rel="noopener noreferrer">
            Yogi Saputro  
        </a>,{` `}
        <a
          href="https://vercel.com?utm_source=typescript-nextjs-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{` `}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
