import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import the WalletConnect component with SSR disabled
const WalletConnect = dynamic(() => import('../components/WalletConnect'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Next.js Viem Wallet Connect</title>
        <meta
          name='description'
          content='Simple wallet connection with Next.js and Viem'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1>Next.js Viem Wallet Connect</h1>

        <p>A simple implementation for connecting to Ethereum wallets</p>

        <WalletConnect />

        <div>
          <div>
            <h2>About This Demo</h2>
            <p>
              This example shows how to connect to an Ethereum wallet using Viem
              in a Next.js application with page router and SSR compatibility.
            </p>
          </div>

          <div>
            <h2>SSR Compatible</h2>
            <p>
              The wallet component is dynamically imported with SSR disabled to
              ensure browser-specific code only runs on the client.
            </p>
          </div>
        </div>
      </main>

      <footer>
        <a href='https://viem.sh' target='_blank' rel='noopener noreferrer'>
          Built with Next.js and Viem
        </a>
      </footer>
    </div>
  );
};

export default Home;
