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
    }
    console.log('prompt', prompt);
    router.push('./generate');
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
          <div className='relative w-full' style={{ paddingRight: '5px' }}>
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

      <style jsx global>{`
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

// 'use client';

// import { useState, useRef } from 'react';
// import CodeDisplay from './components/CodeDisplay';
// import Preview from './components/Preview';
// import ChatInterface from './components/ChatInterface';
// import Tabs from './components/ui/Tabs';

// export default function Home() {
//   const [code, setCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const chatInterfaceRef = useRef<any>(null);

//   const handleGenerateCode = async (inputPrompt: string) => {
//     if (!inputPrompt.trim()) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt: inputPrompt }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to generate code');
//       }

//       setCode(data.code);

//       // Add assistant response to chat
//       // We can add a simple confirmation message here
//       if (chatInterfaceRef.current) {
//         chatInterfaceRef.current.addAssistantMessage(
//           'Code generated successfully! Check the preview tab to see the result.'
//         );
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Something went wrong');

//       // Add error message to chat
//       if (chatInterfaceRef.current) {
//         chatInterfaceRef.current.addAssistantMessage(
//           `Error: ${
//             err instanceof Error ? err.message : 'Something went wrong'
//           }`
//         );
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const tabs = [
//     {
//       label: 'Code',
//       icon: (
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           width='16'
//           height='16'
//           viewBox='0 0 24 24'
//           fill='none'
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'
//         >
//           <polyline points='16 18 22 12 16 6'></polyline>
//           <polyline points='8 6 2 12 8 18'></polyline>
//         </svg>
//       ),
//       content: <CodeDisplay code={code} />,
//     },
//     {
//       label: 'Preview',
//       icon: (
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           width='16'
//           height='16'
//           viewBox='0 0 24 24'
//           fill='none'
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'
//         >
//           <rect x='2' y='3' width='20' height='14' rx='2' ry='2'></rect>
//           <line x1='8' y1='21' x2='16' y2='21'></line>
//           <line x1='12' y1='17' x2='12' y2='21'></line>
//         </svg>
//       ),
//       content: <Preview code={code} />,
//     },
//   ];

//   return (
//     <main className='flex h-screen overflow-hidden'>
//       {/* Left sidebar - Chat interface */}
//       <div className='w-1/3 border-r border-muted'>
//         <ChatInterface
//           ref={chatInterfaceRef}
//           onSubmit={handleGenerateCode}
//           isLoading={isLoading}
//         />
//       </div>

//       {/* Right side - Code and Preview tabs */}
//       <div className='flex-1 flex flex-col'>
//         <header className='p-4 border-b border-muted flex justify-between items-center'>
//           <div className='flex items-center space-x-2'>
//             <span className='text-lg font-medium'>Generated Code</span>
//             {isLoading && (
//               <span className='inline-block animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full ml-2'></span>
//             )}
//           </div>

//           <div className='flex items-center space-x-2'>
//             <button className='p-1.5 rounded-md hover:bg-muted'>
//               <svg
//                 xmlns='http://www.w3.org/2000/svg'
//                 width='16'
//                 height='16'
//                 viewBox='0 0 24 24'
//                 fill='none'
//                 stroke='currentColor'
//                 strokeWidth='2'
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//               >
//                 <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
//                 <polyline points='15 3 21 3 21 9'></polyline>
//                 <line x1='10' y1='14' x2='21' y2='3'></line>
//               </svg>
//             </button>
//             <button className='p-1.5 rounded-md hover:bg-muted'>
//               <svg
//                 xmlns='http://www.w3.org/2000/svg'
//                 width='16'
//                 height='16'
//                 viewBox='0 0 24 24'
//                 fill='none'
//                 stroke='currentColor'
//                 strokeWidth='2'
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//               >
//                 <polyline points='16 16 12 12 8 16'></polyline>
//                 <line x1='12' y1='12' x2='12' y2='21'></line>
//                 <path d='M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3'></path>
//                 <polyline points='16 16 12 12 8 16'></polyline>
//               </svg>
//             </button>
//           </div>
//         </header>

//         <div className='flex-1 overflow-auto'>
//           {error && (
//             <div className='m-4 p-3 bg-red-100 text-red-800 rounded-md'>
//               {error}
//             </div>
//           )}

//           <div className='h-full'>
//             <Tabs tabs={tabs} />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
