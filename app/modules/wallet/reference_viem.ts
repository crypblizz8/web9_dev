export const DEFAULT_VIEM_WALLET = {
  'components/WalletConnect.tsx': `
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
                const [walletState, setWalletState] = useState<WalletState>(initialWalletState);

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
                      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                      window.ethereum.removeListener('chainChanged', handleChainChanged);
                    }
                  };
                }, [walletState.address]);

                const connectWallet = async () => {
                  if (typeof window === 'undefined' || !window.ethereum) {
                    setWalletState({
                      ...initialWalletState,
                      error: 'No Ethereum wallet found. Please install MetaMask or another wallet.',
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
                      error: error instanceof Error ? error.message : 'An unknown error occurred',
                    });
                  }
                };

                const disconnectWallet = () => {
                  setWalletState(initialWalletState);
                };

                return (
                  <div>
                    
                    {walletState.isConnected ? (
                      <>
                        <div>
                          {walletState.address}
                        </div>
                        <button 
                          onClick={disconnectWallet}
                        >
                          Disconnect Wallet
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={connectWallet}
                        disabled={walletState.isConnecting}
                      >
                        {walletState.isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </button>
                    )}

                    {walletState.error && (
                      <div>
                        {walletState.error}
                      </div>
                    )}
                  </div>
                );
              }
          `,
  // const ConnectButton = () => {
  //   // Add client-side only rendering protection
  //   const [mounted, setMounted] = useState(false);
  //   const [buttonState, setButtonState] = useState({
  //     address: '',
  //     isConnected: false
  //   });

  //   useEffect(() => {
  //     // Only import and use the hooks on the client side
  //     const initializeWallet = async () => {
  //       try {
  //         // Dynamic import of the wallet functionality
  //         const { useAppKit, useAppKitAccount } = await import('@reown/appkit/react');

  //         // Create a custom hook function to access wallet state
  //         const getWalletState = () => {
  //           const { open } = useAppKit();
  //           const { address, isConnected } = useAppKitAccount();

  //           setButtonState({
  //             address,
  //             isConnected
  //           });

  //           // Set up click handler
  //           window.handleWalletClick = () => {
  //             if (!isConnected) {
  //               open();
  //             } else {
  //               open({ view: 'Account' });
  //             }
  //           };
  //         };

  //         // Initialize the wallet connection
  //         getWalletState();
  //         setMounted(true);
  //       } catch (err) {
  //         console.error("Failed to initialize wallet:", err);
  //         setMounted(true); // Still mark as mounted so we show the fallback button
  //       }
  //     };

  //     initializeWallet();
  //   }, []);

  //   const formatAddress = (addr: string | undefined) => {
  //     if (!addr) return '';
  //     return \`\${addr.slice(0, 6)}...\${addr.slice(-4)}\`;
  //   };

  //   // Server-side or initial render
  //   if (!mounted) {
  //     return (
  //       <button
  //         className='px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors'
  //         disabled
  //       >
  //         Loading...
  //       </button>
  //     );
  //   }

  //   // Client-side render after hooks are initialized
  //   return (
  //     <button
  //       onClick={() => window.handleWalletClick?.()}
  //       className='px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors'
  //     >
  //       {buttonState.isConnected ? formatAddress(buttonState.address) : 'Connect'}
  //     </button>
  //   );
  // };

  // // Add necessary type for the window object
  // declare global {
  //   interface Window {
  //     handleWalletClick?: () => void;
  //   }
  // }

  // export default ConnectButton;
  // `,
  'components/Header.tsx': `
        import ConnectButton from './ConnectButton';
  
        export const Header = () => {
            return (
            <header className='px-5 py-4 flex justify-between items-center border-b border-gray-200'>
                <div className='flex items-center space-x-3'>
                <h1 className='text-2xl font-bold'>dApp</h1>
                </div>
                <ConnectButton />
            </header>
            );
        };`,
  //   'config/index.ts': `import { cookieStorage, createStorage } from 'wagmi';
  //         import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
  //         import { base, baseSepolia } from '@reown/appkit/networks';
  //         import type { AppKitNetwork } from '@reown/appkit/networks';

  //         // Environment variables
  //         export const projectId = "55f0a883b25ede7b5f3a96399168e93f" || '';

  //         if (!projectId) {
  //             throw new Error('Project ID is not defined');
  //         }

  //         // Define networks - just Base and Base Sepolia
  //         export const networks = [base, baseSepolia] as [
  //             AppKitNetwork,
  //             ...AppKitNetwork[]
  //         ];

  //         // Select the appropriate network based on environment variables
  //         const selectedNetwork = process.env.NEXT_PUBLIC_CHAIN_ID
  //             ? networks.find(
  //                 (network) => network.id === Number(process.env.NEXT_PUBLIC_CHAIN_ID)
  //             )
  //             : baseSepolia; // Default to base if not specified

  //         // Create the adapter with the appropriate networks
  //         export const wagmiAdapter = new WagmiAdapter({
  //             storage: createStorage({
  //             storage: cookieStorage,
  //             }),
  //             ssr: true,
  //             projectId,
  //             networks: [selectedNetwork] as [AppKitNetwork, ...AppKitNetwork[]],
  //         });

  //         export const config = wagmiAdapter.wagmiConfig;
  //         `,
  //   'context/index.tsx': `
  //       'use client';

  //         import { wagmiAdapter, networks } from '../config';
  //         import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  //         import { createAppKit } from '@reown/appkit/react';
  //         import React, { type ReactNode } from 'react';
  //         import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

  //         const queryClient = new QueryClient();

  //         const metadata = {
  //             name: 'next-reown-appkit',
  //             description: 'next-reown-appkit',
  //             url: 'https://github.com/0xonerb/next-reown-appkit-ssr',
  //             icons: ['https://avatars.githubusercontent.com/u/179229932'],
  //         };

  //         export const modal = createAppKit({
  //             adapters: [wagmiAdapter],
  //             projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  //             networks,
  //             metadata,
  //             themeMode: 'light',
  //             features: {
  //             analytics: true,
  //             },
  //             themeVariables: {
  //             '--w3m-accent': '#000000',
  //             },
  //         });

  //         function ContextProvider({
  //             children,
  //             cookies,
  //         }: {
  //             children: ReactNode;
  //             cookies: string | null;
  //         }) {
  //             const initialState = cookieToInitialState(
  //             wagmiAdapter.wagmiConfig as Config,
  //             cookies
  //             );
  //             return (
  //             <WagmiProvider
  //                 config={wagmiAdapter.wagmiConfig as Config}
  //                 initialState={initialState}
  //             >
  //                 <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  //             </WagmiProvider>
  //             );
  //         }

  //         export default ContextProvider;
  //         `,
  '/pages/index.js': `
          export default function Home({ data }) {
          return (
              <div>
              <h1>Hello {data}</h1>
              </div>
          );
          }
          
          export function getServerSideProps() {
          return {
              props: { data: "ttttt" },
          }
      }`,
  '/pages/index.tsx': `import type { NextPage } from 'next';
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
        <h1>Wallet Button</h1>
        <WalletConnect />
      </main>

    </div>
  );
};

export default Home;`,
  '/pages/_app.tsx': `import '../styles.css';
  import type { AppProps } from 'next/app';
  
  export default function App({ Component, pageProps }: AppProps) {
      return (
              <Component {...pageProps} />
      );
  }`,
  'tsconfig.json': `{
      "compilerOptions": {
        "target": "ES2017",
        "lib": [
          "dom",
          "dom.iterable",
          "esnext"
        ],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": false,
        "noEmit": true,
        "incremental": true,
        "module": "esnext",
        "esModuleInterop": true,
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "forceConsistentCasingInFileNames": true
      },
      "include": [
        "next-env.d.ts",
        "**/*.ts",
        "**/*.tsx"
      ],
      "exclude": [
        "pages/_app.js",
        "pages/index.js"
      ]
    }`,
  '.env.development': `NEXT_PUBLIC_PROJECT_ID=55f0a883b25ede7b5f3a96399168e93f`,
};
