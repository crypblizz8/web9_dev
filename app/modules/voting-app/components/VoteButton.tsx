import { FC } from 'react';

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
      className={`vote-button ${backgroundColor} ${cursor}`}
      onClick={() => handleVote(index)}
      disabled={isDisabled}
    >
      Option {index + 1}: {voteCount} votes
    </button>
  );
};

export default VoteButton;
