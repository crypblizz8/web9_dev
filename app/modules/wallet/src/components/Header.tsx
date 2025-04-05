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
};
