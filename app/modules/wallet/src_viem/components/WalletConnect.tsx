import React, { useState, useEffect } from 'react';
import { createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';

type WalletState = {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
};

const initialWalletState: WalletState = {
  address: null,
  isConnecting: false,
  isConnected: false,
  error: null,
};

export default function WalletConnect() {
  const [walletState, setWalletState] =
    useState<WalletState>(initialWalletState);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const client = createWalletClient({
            chain: mainnet,
            transport: custom(window.ethereum),
          });

          const addresses = await client.getAddresses();

          if (addresses && addresses.length > 0) {
            setWalletState({
              address: addresses[0],
              isConnecting: false,
              isConnected: true,
              error: null,
            });
          }
        } catch (error) {
          console.log('No existing connection');
        }
      }
    };

    checkConnection();
  }, []);

  // Set up event listeners for wallet changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setWalletState(initialWalletState);
      } else if (accounts[0] !== walletState.address) {
        // User switched accounts
        setWalletState({
          address: accounts[0],
          isConnecting: false,
          isConnected: true,
          error: null,
        });
      }
    };

    const handleChainChanged = () => {
      // When chain changes, simply refresh the page
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletState.address]);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setWalletState({
        ...initialWalletState,
        error:
          'No Ethereum wallet found. Please install MetaMask or another wallet.',
      });
      return;
    }

    setWalletState({
      ...walletState,
      isConnecting: true,
      error: null,
    });

    try {
      const client = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });

      // Request account access
      const addresses = await client.requestAddresses();

      if (addresses && addresses.length > 0) {
        setWalletState({
          address: addresses[0],
          isConnecting: false,
          isConnected: true,
          error: null,
        });
      } else {
        throw new Error('No addresses returned');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState({
        ...initialWalletState,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const disconnectWallet = () => {
    setWalletState(initialWalletState);
  };

  return (
    <div>
      <h2>Wallet Connection</h2>

      {walletState.isConnected ? (
        <>
          <div>{walletState.address}</div>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </>
      ) : (
        <button onClick={connectWallet} disabled={walletState.isConnecting}>
          {walletState.isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}

      {walletState.error && <div>{walletState.error}</div>}
    </div>
  );
}
