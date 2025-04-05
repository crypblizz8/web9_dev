import { DEFAULT_VIEM_WALLET } from '../wallet/reference_viem';

export const DEFAULT_CURVEGRID_VOTING = {
  ...DEFAULT_VIEM_WALLET,
  'pages/index.tsx': `import { useState } from 'react';
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
`,
  'hooks/useMultiBass.ts': `'use client';
import type {
  PostMethodArgs,
  MethodCallResponse,
  TransactionToSignResponse,
  Event,
} from '@curvegrid/multibaas-sdk';
import type { SendTransactionParameters } from '@wagmi/core';
import {
  Configuration,
  ContractsApi,
  EventsApi,
  ChainsApi,
} from '@curvegrid/multibaas-sdk';
import { useAccount } from 'wagmi';
import { useCallback, useMemo } from 'react';

interface ChainStatus {
  chainID: number;
  blockNumber: number;
}

interface MultiBaasHook {
  getChainStatus: () => Promise<ChainStatus | null>;
  clearVote: () => Promise<SendTransactionParameters>;
  getVotes: () => Promise<string[] | null>;
  hasVoted: (ethAddress: string) => Promise<boolean | null>;
  castVote: (choice: string) => Promise<SendTransactionParameters>;
  getUserVotes: (ethAddress: string) => Promise<string | null>;
  getVotedEvents: () => Promise<Array<Event> | null>;
}

const useMultiBaas = (): MultiBaasHook => {
  const mbBaseUrl = 'XXX';
  const mbApiKey =
    'XXX';
  const votingContractLabel = 'XXX';
  const votingAddressAlias = 'XXX';

  const chain = 'ethereum';

  const mbConfig = useMemo(() => {
    return new Configuration({
      basePath: new URL('/api/v0', mbBaseUrl).toString(),
      accessToken: mbApiKey,
    });
  }, [mbBaseUrl, mbApiKey]);

  const contractsApi = useMemo(() => new ContractsApi(mbConfig), [mbConfig]);
  const eventsApi = useMemo(() => new EventsApi(mbConfig), [mbConfig]);
  const chainsApi = useMemo(() => new ChainsApi(mbConfig), [mbConfig]);

  const { address, isConnected } = useAccount();

  const getChainStatus = async (): Promise<ChainStatus | null> => {
    try {
      const response = await chainsApi.getChainStatus(chain);
      return response.data.result as ChainStatus;
    } catch (err) {
      console.error('Error getting chain status:', err);
      return null;
    }
  };

  const callContractFunction = useCallback(
    async (
      methodName: string,
      args: PostMethodArgs['args'] = []
    ): Promise<
      MethodCallResponse['output'] | TransactionToSignResponse['tx']
    > => {
      const payload: PostMethodArgs = {
        args,
        contractOverride: true,
        ...(isConnected && address ? { from: address } : {}),
      };

      const response = await contractsApi.callContractFunction(
        chain,
        votingAddressAlias,
        votingContractLabel,
        methodName,
        payload
      );

      if (response.data.result.kind === 'MethodCallResponse') {
        return response.data.result.output;
      } else if (response.data.result.kind === 'TransactionToSignResponse') {
        return response.data.result.tx;
      } else {
        throw new Error(
          \`Unexpected response type: \${response.data.result.kind}\`
        );
      }
    },
    [
      contractsApi,
      chain,
      votingAddressAlias,
      votingContractLabel,
      isConnected,
      address,
    ]
  );

  const clearVote = useCallback(async (): Promise<SendTransactionParameters> => {
    return await callContractFunction('clearVote');
  }, [callContractFunction]);

  const getVotes = useCallback(async (): Promise<string[] | null> => {
    try {
      const votes = await callContractFunction('getVotes');
      return votes;
    } catch (err) {
      console.error('Error getting votes:', err);
      return null;
    }
  }, [callContractFunction]);

  const hasVoted = useCallback(
    async (ethAddress: string): Promise<boolean | null> => {
      try {
        const result = await callContractFunction('hasVoted', [ethAddress]);
        return result;
      } catch (err) {
        console.error('Error checking if user has voted:', err);
        return null;
      }
    },
    [callContractFunction]
  );

  const castVote = useCallback(
    async (choice: string): Promise<SendTransactionParameters> => {
      return await callContractFunction('vote', [choice]);
    },
    [callContractFunction]
  );

  const getUserVotes = useCallback(
    async (ethAddress: string): Promise<string | null> => {
      try {
        const result = await callContractFunction('votes', [ethAddress]);
        return result as string;
      } catch (err) {
        console.error("Error getting user's vote:", err);
        return null;
      }
    },
    [callContractFunction]
  );

  const getVotedEvents = useCallback(async (): Promise<Array<Event> | null> => {
    try {
      const eventSignature = 'Voted(address,uint256,int8)';
      const response = await eventsApi.listEvents(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        chain,
        votingAddressAlias,
        votingContractLabel,
        eventSignature,
        50
      );

      return response.data.result;
    } catch (err) {
      console.error('Error getting voted events:', err);
      return null;
    }
  }, [eventsApi, chain, votingAddressAlias, votingContractLabel]);

  return {
    getChainStatus,
    clearVote,
    getVotes,
    hasVoted,
    castVote,
    getUserVotes,
    getVotedEvents,
  };
};

export default useMultiBaas;
`,
  'components/Events.tsx': `'use client';
import type { UseWaitForTransactionReceiptReturnType } from 'wagmi';
import React, { useEffect, useState, useCallback } from 'react';
import useMultiBaas from '../hooks/useMultiBass';

interface EventInput {
  name: string;
  type: string;
  value: string;
}

interface EventData {
  event: {
    name: string;
    inputs: EventInput[];
  };
  triggeredAt: string;
  transaction: {
    txHash: string;
  };
}

interface EventsProps {
  txReceipt: UseWaitForTransactionReceiptReturnType['data'] | undefined;
}

const Events: React.FC<EventsProps> = ({ txReceipt }) => {
  const { getVotedEvents } = useMultiBaas();
  const [events, setEvents] = useState<EventData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Wrap fetchEvents with useCallback
  const fetchEvents = useCallback(async () => {
    setIsFetching(true);
    try {
      const fetchedEvents = await getVotedEvents();
      if (fetchedEvents) {
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsFetching(false);
    }
  }, [getVotedEvents]);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events whenever txReceipt changes
  useEffect(() => {
    if (txReceipt) {
      fetchEvents();
    }
  }, [txReceipt, fetchEvents]);

  return (
    <div className='container'>
      <h1 className='title'>Recent Events</h1>
      <div className='spinner-parent'>
        {isFetching && (
          <div className='overlay'>
            <div className='spinner'></div>
          </div>
        )}
        {!isFetching && events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul className='events-list'>
            {events.map((event, index) => (
              <li key={index} className='event-item'>
                <div className='event-name'>
                  <strong>{event.event.name}</strong> - {event.triggeredAt}
                </div>
                <div className='event-details'>
                  {event.event.inputs.map((input, idx) => (
                    <p key={idx}>
                      <strong>{input.name}:</strong> {input.value}
                    </p>
                  ))}
                  <p>
                    <strong>Transaction Hash:</strong>{' '}
                    {event.transaction.txHash}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Events;
`,
  'components/Voting.tsx': `'use client';
import React, { useEffect, useState, useCallback } from 'react';
import useMultiBaas from '../hooks/useMultiBass';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, UseWaitForTransactionReceiptReturnType } from 'wagmi';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import VoteButton from './VoteButton';

interface VotingProps {
  setTxReceipt: (receipt: UseWaitForTransactionReceiptReturnType['data']) => void;
}

const Voting: React.FC<VotingProps> = ({ setTxReceipt }) => {
  const { getVotes, castVote, clearVote, hasVoted, getUserVotes } = useMultiBaas();
  const { address, isConnected, status } = useAppKitAccount();
  const { open: openConnectModal, close } = useAppKit();
  const { sendTransactionAsync } = useSendTransaction();
  const { data: txReceipt, isLoading: isTxProcessing } = useWaitForTransactionReceipt();

  const [votesCount, setVotesCount] = useState<number[]>([]);
  const [currentVoteIndex, setCurrentVoteIndex] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | undefined>();

  const fetchVotes = useCallback(async () => {
    try {
      const votesArray = await getVotes();
      if (votesArray) {
        setVotesCount(votesArray.map((vote) => parseInt(vote)));
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  }, [getVotes]);

  const checkUserVote = useCallback(async () => {
    if (address) {
      try {
        const hasVotedResult = await hasVoted(address);
        if (hasVotedResult) {
          const userVoteIndex = await getUserVotes(address);
          if (userVoteIndex !== null) {
            setCurrentVoteIndex(parseInt(userVoteIndex));
          } else {
            setCurrentVoteIndex(null);
          }
        } else {
          setCurrentVoteIndex(null);
        }
      } catch (error) {
        console.error('Error checking user vote:', error);
      }
    }
  }, [address, hasVoted, getUserVotes]);

  useEffect(() => {
    if (isConnected) {
      fetchVotes();
      checkUserVote();
    }
  }, [isConnected, fetchVotes, checkUserVote]);

  useEffect(() => {
    if (txReceipt) {
      setTxReceipt(txReceipt);
    }
  }, [txReceipt, setTxReceipt]);

  const handleVote = async (index: number) => {
    if (!isConnected) {
      openConnectModal({ view: 'Account' });
      return;
    }
    try {
      const tx = currentVoteIndex === index ? await clearVote() : await castVote(index.toString());
      const hash = await sendTransactionAsync(tx);
      setTxHash(hash);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  return (
    <div className='container'>
      <h1 className='title'>Cast your vote</h1>
      {!isConnected ? (
        <div className='text-center'>Please connect your wallet to vote</div>
      ) : (
        <div className='spinner-parent'>
          {votesCount.map((voteCount, index) => (
            <VoteButton
              key={index}
              index={index}
              voteCount={voteCount}
              isActive={index === currentVoteIndex}
              isDisabled={isTxProcessing}
              handleVote={handleVote}
            />
          ))}
          {isTxProcessing && (
            <div className='overlay'>
              <div className='spinner'></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Voting;
`,
  'components/VoteButton.tsx': `import { FC } from 'react';
interface VoteButtonProps {
  index: number;
  voteCount: number;
  isActive: boolean;
  isDisabled: boolean;
  handleVote: (index: number) => void;
}

const VoteButton: FC<VoteButtonProps> = ({
  index,
  voteCount,
  isActive,
  isDisabled,
  handleVote,
}) => {
  const backgroundColor = isActive
    ? 'bg-button-voted hover:bg-button-clear-vote'
    : 'bg-button-default hover:bg-button-cast-vote';
  const cursor = isDisabled ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={() => handleVote(index)}
      disabled={isDisabled}
    >
      Option {index + 1}: {voteCount} votes
    </button>
  );
};

export default VoteButton;
`,
  'env.development': `
NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID=55f0a883b25ede7b5f3a96399168e93f
NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL='https://si2rmlb7ffem7famtstpa3xz7m.multibaas.com/'
NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzQzNzc5MTczLCJqdGkiOiJlZjg1ODMzNi00YmVhLTQxZjItOWRjYy1mNGRiODA3OWUzZGUifQ.907ZZTyBqcL4PogL8Bxczkyw8Vl5L8gm28pap5jgvSA
NEXT_PUBLIC_MULTIBAAS_VOTING_CONTRACT_LABEL='simplevoting'
NEXT_PUBLIC_MULTIBAAS_VOTING_ADDRESS_ALIAS='simplevoting1'
NEXT_PUBLIC_MULTIBAAS_CHAIN_ID='84532'
`,
};
