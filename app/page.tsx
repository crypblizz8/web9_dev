'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: boolean;
  }>({
    votingApp: false,
    portfolioApp: false,
    dexApp: false,
    connectWallet: false,
    networkModule: false,
    gasEstimator: false,
  });

  const toggleOption = (optionKey: string) => {
    setSelectedOptions((prev) => {
      // If this is an app type option, unselect the other app types
      if (
        optionKey === 'votingApp' ||
        optionKey === 'portfolioApp' ||
        optionKey === 'dexApp'
      ) {
        return {
          ...prev,
          votingApp: optionKey === 'votingApp' ? !prev[optionKey] : false,
          portfolioApp: optionKey === 'portfolioApp' ? !prev[optionKey] : false,
          dexApp: optionKey === 'dexApp' ? !prev[optionKey] : false,
        };
      }
      // Otherwise, just toggle the selected option
      return {
        ...prev,
        [optionKey]: !prev[optionKey],
      };
    });
  };

  // Generate example text based on selected options
  const getExampleText = () => {
    const appTypes = [];
    const features = [];

    // App types
    if (selectedOptions.votingApp) appTypes.push('Voting');
    if (selectedOptions.portfolioApp) appTypes.push('Portfolio Tracker');
    if (selectedOptions.dexApp) appTypes.push('Decentralized Exchange');

    // Features
    if (selectedOptions.connectWallet)
      features.push('wallet connection functionality');
    if (selectedOptions.networkModule)
      features.push('network selection capability');
    if (selectedOptions.gasEstimator) features.push('gas fee estimation');

    if (appTypes.length === 0 && features.length === 0) {
      return 'Build a...';
    }

    if (appTypes.length === 0 && features.length > 0) {
      if (features.length === 1) {
        return `Build a dapp with ${features[0]}.`;
      } else if (features.length === 2) {
        return `Build a dapp with ${features[0]} and ${features[1]}.`;
      } else {
        return `Build a dapp with ${features[0]}, ${features[1]}, and ${features[2]}.`;
      }
    }

    const appType = appTypes[0]; // Only one app type can be selected at a time

    if (features.length === 0) {
      return `Build a ${appType} application.`;
    } else if (features.length === 1) {
      return `Build a ${appType} application with ${features[0]}.`;
    } else if (features.length === 2) {
      return `Build a ${appType} application with ${features[0]} and ${features[1]}.`;
    } else {
      return `Build a ${appType} application with ${features[0]}, ${features[1]}, and ${features[2]}.`;
    }
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      console.log('Submitting prompt:', prompt);
      console.log('Selected options:', selectedOptions);

      // Navigate to the next page
      router.push('/generate');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className='min-h-screen bg-black text-white flex flex-col'>
      {/* Header */}
      <header className='p-6'>
        <div className='flex items-center gap-2 pl-5'>
          <div className='flex flex-row items-center gap-2 h-8'>
            <Image
              src='/vib3_logo.png'
              alt='Vib3 Logo'
              width={32}
              height={32}
            />
            <Image
              src='/vib3_text_logo.png'
              alt='Vib3'
              width={67}
              height={24}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className='flex-1 flex flex-col items-center justify-center px-4 max-w-[1200px] mx-auto w-full'>
        <Image
          src='/vib3_logo.png'
          alt='Vib3 Logo'
          width={96}
          height={96}
          className='mb-8'
        />

        <div className='text-center mb-16'>
          <div className='inline-block'>
            <h1 className='text-[48px] font-black leading-[0.95] font-["Bricolage_Grotesque"] text-[#EEEDE1]'>
              Turn your ideas
            </h1>
            <h1 className='text-[48px] font-black leading-[1.1] flex items-center justify-center gap-2 font-["Bricolage_Grotesque"] text-[#EEEDE1]'>
              into
              <span className='relative'>
                <span className='relative z-10'>dapps</span>
                <span
                  className='absolute left-0 right-0 bottom-0 h-[50%] bg-[#507C36]'
                  style={{ bottom: '-5%' }}
                ></span>
              </span>
            </h1>
          </div>
        </div>

        <div className='w-full max-w-[920px] mb-6'>
          <p className='text-[#9CA3AF] text-base mb-3'>
            What app do you want to build today?
          </p>
          <div className='grid grid-cols-3 gap-6 w-full mb-8'>
            {/* Voting app */}
            <div
              className={`flex items-center gap-3 w-full h-[70px] rounded-lg border-2 ${
                selectedOptions.votingApp
                  ? 'border-[#3B3B3B] bg-[#3B3B3B]'
                  : 'border-[#333] bg-transparent'
              } pl-[23px] pr-[13px] py-[9px] cursor-pointer transition-all duration-150 ease-in-out`}
              onClick={() => toggleOption('votingApp')}
            >
              <div className='w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center'>
                <Image
                  src='/icons/vote.svg'
                  alt='Vote'
                  width={20}
                  height={20}
                  className='[filter:invert(67%)_sepia(9%)_saturate(274%)_hue-rotate(181deg)_brightness(92%)_contrast(86%)]'
                />
              </div>
              <span className='flex-grow font-["Bricolage_Grotesque"] text-base text-[#9CA3AF]'>
                Voting App
              </span>
              <div
                className={`w-4 h-4 flex-shrink-0 rounded-sm border ${
                  selectedOptions.votingApp
                    ? 'border-[#EEEDE1] bg-[#507C36]'
                    : 'border-[#333]'
                }`}
              />
            </div>

            {/* Portfolio Tracker */}
            <div
              className={`flex items-center gap-3 w-full h-[70px] rounded-lg border-2 ${
                selectedOptions.portfolioApp
                  ? 'border-[#3B3B3B] bg-[#3B3B3B]'
                  : 'border-[#333] bg-transparent'
              } pl-[23px] pr-[13px] py-[9px] cursor-pointer transition-all duration-150 ease-in-out`}
              onClick={() => toggleOption('portfolioApp')}
            >
              <div className='w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center'>
                <Image
                  src='/icons/dashboard.svg'
                  alt='Dashboard'
                  width={20}
                  height={20}
                  className='[filter:invert(67%)_sepia(9%)_saturate(274%)_hue-rotate(181deg)_brightness(92%)_contrast(86%)]'
                />
              </div>
              <span className='flex-grow font-["Bricolage_Grotesque"] text-base text-[#9CA3AF]'>
                Portfolio Tracker
              </span>
              <div
                className={`w-4 h-4 flex-shrink-0 rounded-sm border ${
                  selectedOptions.portfolioApp
                    ? 'border-[#EEEDE1] bg-[#507C36]'
                    : 'border-[#333]'
                }`}
              />
            </div>

            {/* Decentralized Exchange */}
            <div
              className={`flex items-center gap-3 w-full h-[70px] rounded-lg border-2 ${
                selectedOptions.dexApp
                  ? 'border-[#3B3B3B] bg-[#3B3B3B]'
                  : 'border-[#333] bg-transparent'
              } pl-[23px] pr-[13px] py-[9px] cursor-pointer transition-all duration-150 ease-in-out`}
              onClick={() => toggleOption('dexApp')}
            >
              <div className='w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center'>
                <Image
                  src='/icons/dashboard.svg'
                  alt='Exchange'
                  width={20}
                  height={20}
                  className='[filter:invert(67%)_sepia(9%)_saturate(274%)_hue-rotate(181deg)_brightness(92%)_contrast(86%)]'
                />
              </div>
              <span className='flex-grow font-["Bricolage_Grotesque"] text-base text-[#9CA3AF]'>
                Decentralized Exchange
              </span>
              <div
                className={`w-4 h-4 flex-shrink-0 rounded-sm border ${
                  selectedOptions.dexApp
                    ? 'border-[#EEEDE1] bg-[#507C36]'
                    : 'border-[#333]'
                }`}
              />
            </div>
          </div>

          <p className='text-[#9CA3AF] text-base mb-3'>
            What features do you want?
          </p>
          <div className='grid grid-cols-3 gap-6 w-full mb-8'>
            {/* Connect Wallet Button */}
            <div
              className={`flex items-center gap-3 w-full h-[70px] rounded-lg border-2 ${
                selectedOptions.connectWallet
                  ? 'border-[#3B3B3B] bg-[#3B3B3B]'
                  : 'border-[#333] bg-transparent'
              } pl-[23px] pr-[13px] py-[9px] cursor-pointer transition-all duration-150 ease-in-out`}
              onClick={() => toggleOption('connectWallet')}
            >
              <div className='w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center'>
                <Image
                  src='/icons/wallet.svg'
                  alt='Wallet'
                  width={20}
                  height={20}
                  className='[filter:invert(67%)_sepia(9%)_saturate(274%)_hue-rotate(181deg)_brightness(92%)_contrast(86%)]'
                />
              </div>
              <span className='flex-grow font-["Bricolage_Grotesque"] text-base text-[#9CA3AF]'>
                Connect Wallet Button
              </span>
              <div
                className={`w-4 h-4 flex-shrink-0 rounded-sm border ${
                  selectedOptions.connectWallet
                    ? 'border-[#EEEDE1] bg-[#507C36]'
                    : 'border-[#333]'
                }`}
              />
            </div>

            {/* Select Network Module */}
            <div
              className={`flex items-center gap-3 w-full h-[70px] rounded-lg border-2 ${
                selectedOptions.networkModule
                  ? 'border-[#3B3B3B] bg-[#3B3B3B]'
                  : 'border-[#333] bg-transparent'
              } pl-[23px] pr-[13px] py-[9px] cursor-pointer transition-all duration-150 ease-in-out`}
              onClick={() => toggleOption('networkModule')}
            >
              <div className='w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center'>
                <Image
                  src='/icons/dashboard.svg'
                  alt='Network'
                  width={20}
                  height={20}
                  className='[filter:invert(67%)_sepia(9%)_saturate(274%)_hue-rotate(181deg)_brightness(92%)_contrast(86%)]'
                />
              </div>
              <span className='flex-grow font-["Bricolage_Grotesque"] text-base text-[#9CA3AF]'>
                Select Network Module
              </span>
              <div
                className={`w-4 h-4 flex-shrink-0 rounded-sm border ${
                  selectedOptions.networkModule
                    ? 'border-[#EEEDE1] bg-[#507C36]'
                    : 'border-[#333]'
                }`}
              />
            </div>

            {/* Gas Estimator */}
            <div
              className={`flex items-center gap-3 w-full h-[70px] rounded-lg border-2 ${
                selectedOptions.gasEstimator
                  ? 'border-[#3B3B3B] bg-[#3B3B3B]'
                  : 'border-[#333] bg-transparent'
              } pl-[23px] pr-[13px] py-[9px] cursor-pointer transition-all duration-150 ease-in-out`}
              onClick={() => toggleOption('gasEstimator')}
            >
              <div className='w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center'>
                <Image
                  src='/icons/wallet.svg'
                  alt='Gas'
                  width={20}
                  height={20}
                  className='[filter:invert(67%)_sepia(9%)_saturate(274%)_hue-rotate(181deg)_brightness(92%)_contrast(86%)]'
                />
              </div>
              <span className='flex-grow font-["Bricolage_Grotesque"] text-base text-[#9CA3AF]'>
                Gas Estimator
              </span>
              <div
                className={`w-4 h-4 flex-shrink-0 rounded-sm border ${
                  selectedOptions.gasEstimator
                    ? 'border-[#EEEDE1] bg-[#507C36]'
                    : 'border-[#333]'
                }`}
              />
            </div>
          </div>
        </div>

        <div className='w-full max-w-[920px] mx-auto'>
          <div
            className='relative w-full'
            style={{ paddingRight: '5px' }}
          >
            <textarea
              value={prompt || getExampleText()}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              placeholder='Add more ideas here...'
              className='w-full h-[120px] bg-transparent border border-[#EEEDE1] rounded-lg px-6 pt-5 pb-11 focus:outline-none focus:border-[#507C36] focus:ring-1 focus:ring-[#507C36] transition-colors duration-150 resize-none overflow-y-auto'
              style={{ paddingRight: '35px' }}
              onKeyDown={handleKeyDown}
            />
            <div
              className='absolute right-4 bottom-4 cursor-pointer'
              onClick={handleSubmit}
            >
              <div className='w-6 h-6 bg-[#507C36] rounded flex items-center justify-center hover:bg-[#5d8f3f] transition-colors duration-150'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7 1L7 13M7 1L1 7M7 1L13 7'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style
        jsx
        global
      >{`
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
          margin: 5px 0;
        }
        textarea::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 10px;
          border: 3px solid black;
        }
      `}</style>
    </div>
  );
}
