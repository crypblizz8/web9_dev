'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  UseWaitForTransactionReceiptReturnType,
} from 'wagmi';
import useMultiBaas from '../hooks/useMultiBass';
import VoteButton from './VoteButton';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';

interface VotingProps {
  setTxReceipt: (
    receipt: UseWaitForTransactionReceiptReturnType['data']
  ) => void;
}

const Voting: React.FC<VotingProps> = ({ setTxReceipt }) => {
  const { getVotes, castVote, clearVote, hasVoted, getUserVotes } =
    useMultiBaas();
  const { address, isConnected, status } = useAppKitAccount();

  const { open: openConnectModal, close } = useAppKit();
  //   const { address, isConnected, status } = useAppKitAccount();

  //   const handleClick = () => {
  //     if (!isConnected) {
  //       open();
  //     } else {
  //         openConnectModal({ view: 'Account' });
  //     }
  //   };
  //   const { openConnectModal } = useConnectModal();

  const { sendTransactionAsync } = useSendTransaction();

  const [votesCount, setVotesCount] = useState<number[]>([]);
  const [currentVoteIndex, setCurrentVoteIndex] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}`>();

  const { data: txReceipt, isLoading: isTxProcessing } =
    useWaitForTransactionReceipt({ hash: txHash });

  // Wrap fetchVotes with useCallback
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

  // Wrap checkUserVote with useCallback
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
  }, [isConnected, txReceipt, fetchVotes, checkUserVote]);

  useEffect(() => {
    if (txReceipt) {
      setTxReceipt(txReceipt);
    }
  }, [txReceipt, setTxReceipt]);

  const handleVote = async (index: number) => {
    if (!isConnected) {
      //   openConnectModal?.();
      openConnectModal({ view: 'Account' });

      return;
    }
    try {
      const tx =
        currentVoteIndex === index
          ? await clearVote()
          : await castVote(index.toString());
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
