import { useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview as SandpackPreviewWindow,
  SandpackFileExplorer,
  useSandpack,
  SandpackConsole,
} from '@codesandbox/sandpack-react';
import { web9Theme } from './web9Theme';
import { DEFAULT_WALLET_FILES } from '../../modules/wallet/reference';
import { DEFAULT_VIEM_WALLET } from '@/app/modules/wallet/reference_viem';

const SandpackTabs = () => {
  const { sandpack } = useSandpack();
  const [activeTab, setActiveTab] = useState<'preview'>('preview');

  return (
    <div className='flex flex-col h-full'>
      <div className='flex border-b border-gray-700'>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'preview'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        {/* <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'console'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('console')}
        >
          Console
        </button> */}
      </div>
      <div className='flex-1 overflow-auto bg-white'>
        {activeTab === 'preview' ? (
          <SandpackPreviewWindow showNavigator={true} />
        ) : (
          <SandpackConsole />
        )}
      </div>
    </div>
  );
};

interface SandpackPreviewProps {
  files?: any;
  activePath?: string;
}

export default function SandpackPreview({
  files = DEFAULT_VIEM_WALLET,
  // files: { files },
  activePath = '/app/page.tsx',
}: SandpackPreviewProps) {
  return (
    <div className='h-full'>
      <SandpackProvider
        template='nextjs'
        theme={web9Theme}
        files={files}
        options={{
          activeFile: activePath,
          visibleFiles: Object.keys(files),
          classes: {
            'sp-layout': 'custom-layout',
            'sp-tabs': 'custom-tabs',
          },
        }}
        customSetup={{
          dependencies: {
            '@reown/appkit': '^1.6.8',
            '@reown/appkit-adapter-wagmi': '^1.6.8',
            '@tailwindcss/postcss': '^4.1.3',
            '@tanstack/react-query': '^5.71.10',
            '@types/node': '^22.14.0',
            '@types/react': '18.2.0',
            '@types/react-dom': '18.2.0',
            '@next/swc-wasm-nodejs': '12.1.6',
            autoprefixer: '^10.4.21',
            next: '12.1.6',
            react: '18.2.0',
            'react-dom': '18.2.0',
            typescript: '^5.8.2',
            viem: '^2.25.0',
            wagmi: '^2.14.16',
          },
        }}
      >
        <SandpackLayout className='!border-0 !bg-[#1e1e1e] !rounded-none'>
          <div className='flex flex-col h-full overflow-hidden'>
            <div className='flex-1 flex'>
              <div className='w-48 border-r border-gray-800 bg-[#1e1e1e]'>
                <SandpackFileExplorer className='!bg-[#1e1e1e] !border-0' />
              </div>
              <div className='flex-1'>
                <SandpackCodeEditor
                  showTabs
                  showLineNumbers
                  showInlineErrors
                  wrapContent
                  closableTabs={false}
                />
              </div>
            </div>
            <div className='h-1/2 border-t border-gray-800 bg-[#1e1e1e]'>
              <SandpackTabs />
            </div>
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
