import { useState } from 'react';
import { UseWaitForTransactionReceiptReturnType } from 'wagmi';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Voting from '../components/Voting';
import Events from '../components/Events';

// Import the WalletConnect component with SSR disabled
const WalletConnect = dynamic(
  () => import('../../wallet/components/WalletConnect'),
  {
    ssr: false,
  }
);

export default function Home() {
  const [txReceipt, setTxReceipt] =
    useState<UseWaitForTransactionReceiptReturnType['data']>();

  return (
    <div>
      <main>
        <div className='container mx-auto px-4 py-8'>
          <WalletConnect />
        </div>
        <div>
          <Voting setTxReceipt={setTxReceipt} />
          <Events txReceipt={txReceipt} />
        </div>
      </main>
    </div>
  );
}
