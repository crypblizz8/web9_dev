import { useState } from 'react';
import { UseWaitForTransactionReceiptReturnType } from 'wagmi';
import dynamic from 'next/dynamic';
import Voting from '../components/Voting';
import Events from '../components/Events';
import type { NextPage } from 'next';

// Import the Wimport type { NextPage } from 'next'alletConnect component with SSR disabled
const WalletConnect = dynamic(() => import('../components/WalletConnect'), {
  ssr: false,
});

const Home: NextPage = () => {
  const [txReceipt, setTxReceipt] =
    useState<UseWaitForTransactionReceiptReturnType['data']>();

  return (
    <div>
      <main>
        <div className='container mx-auto px-4 py-8'>
          <WalletConnect />
          <p> hello</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
