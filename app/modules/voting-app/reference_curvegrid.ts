import { DEFAULT_VIEM_WALLET } from '../wallet/reference_viem';

export const DEFAULT_CURVEGRID_VOTING = {
  ...DEFAULT_VIEM_WALLET,
  '.env.development': `NEXT_PUBLIC_PROJECT_ID=XXX`,
};
