'use client';

import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const handleClick = () => {
    if (!isConnected) {
      open();
    } else {
      open({ view: 'Account' });
    }
  };

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={handleClick}
      className='px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors'
    >
      {isConnected ? formatAddress(address) : 'Connect'}
    </button>
  );
}

export default ConnectButton;
