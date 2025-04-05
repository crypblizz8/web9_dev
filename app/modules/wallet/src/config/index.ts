//v3 iteration
// AppKit with Base and Base Sepolia
import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia } from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';

// Environment variables
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '';

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
