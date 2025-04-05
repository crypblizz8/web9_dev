// Based on working code

export const DEFAULT_WALLET_FILES = {
  'components/ConnectButton.tsx': `
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
                return \`\${addr.slice(0, 6)}...\${addr.slice(-4)}\`;
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
        `,
  //   'components/ConnectButton.tsx': `

  // import React, { useState, useEffect } from 'react';

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
  'config/index.ts': `import { cookieStorage, createStorage } from 'wagmi';
      import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
      import { base, baseSepolia } from '@reown/appkit/networks';
      import type { AppKitNetwork } from '@reown/appkit/networks';

      // Environment variables
      export const projectId = "55f0a883b25ede7b5f3a96399168e93f" || '';

      if (!projectId) {
          throw new Error('Project ID is not defined');
      }

      // Define networks - just Base and Base Sepolia
      export const networks = [base, baseSepolia] as [
          AppKitNetwork,
          ...AppKitNetwork[]
      ];

      // Select the appropriate network based on environment variables
      const selectedNetwork = process.env.NEXT_PUBLIC_CHAIN_ID
          ? networks.find(
              (network) => network.id === Number(process.env.NEXT_PUBLIC_CHAIN_ID)
          )
          : baseSepolia; // Default to base if not specified

      // Create the adapter with the appropriate networks
      export const wagmiAdapter = new WagmiAdapter({
          storage: createStorage({
          storage: cookieStorage,
          }),
          ssr: true,
          projectId,
          networks: [selectedNetwork] as [AppKitNetwork, ...AppKitNetwork[]],
      });

      export const config = wagmiAdapter.wagmiConfig;
      `,
  'context/index.tsx': `
    'use client';

      import { wagmiAdapter, networks } from '../config';
      import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
      import { createAppKit } from '@reown/appkit/react';
      import React, { type ReactNode } from 'react';
      import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

      const queryClient = new QueryClient();

      const metadata = {
          name: 'next-reown-appkit',
          description: 'next-reown-appkit',
          url: 'https://github.com/0xonerb/next-reown-appkit-ssr',
          icons: ['https://avatars.githubusercontent.com/u/179229932'],
      };

      export const modal = createAppKit({
          adapters: [wagmiAdapter],
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
          networks,
          metadata,
          themeMode: 'light',
          features: {
          analytics: true,
          },
          themeVariables: {
          '--w3m-accent': '#000000',
          },
      });

      function ContextProvider({
          children,
          cookies,
      }: {
          children: ReactNode;
          cookies: string | null;
      }) {
          const initialState = cookieToInitialState(
          wagmiAdapter.wagmiConfig as Config,
          cookies
          );
          return (
          <WagmiProvider
              config={wagmiAdapter.wagmiConfig as Config}
              initialState={initialState}
          >
              <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </WagmiProvider>
          );
      }

      export default ContextProvider;
      `,
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
  '/pages/index.tsx': `import ConnectButton from '../components/ConnectButton';

export default function Home() {
    return (
        <main>
            <p>hello yyy </p>
            <ConnectButton/>
        </main>
    );
}`,
  '/pages/_app.tsx': `import '../styles.css';
import type { AppProps } from 'next/app';
import ContextProvider from '../context';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ContextProvider cookies={null}>
            <Component {...pageProps} />
        </ContextProvider>
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
