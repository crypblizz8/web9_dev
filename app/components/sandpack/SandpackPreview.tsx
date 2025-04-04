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
import {
  DEFAULT_NEXTJS_FILES,
  NEXT_APP_ROUTER_TEMPLATE_THREE,
} from '@/utils/modules';

const SandpackTabs = () => {
  const { sandpack } = useSandpack();
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');

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
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'console'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('console')}
        >
          Console
        </button>
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
  files?: Record<string, string>;
  activePath?: string;
}

export default function SandpackPreview(props: SandpackPreviewProps) {
  const files = props.files || DEFAULT_NEXTJS_FILES;

  console.log('files....', files);
  const activePath = props.activePath || '/app/page.tsx';

  // ('/app/page.js');

  return (
    <div className='h-full'>
      <SandpackProvider
        template='nextjs'
        theme={web9Theme}
        files={files}
        options={{
          activeFile: activePath,
          // visibleFiles: Object.keys(files),
          visibleFiles: files ? Object.keys(files) : [],
          classes: {
            'sp-layout': 'custom-layout',
            'sp-tabs': 'custom-tabs',
          },
        }}
      >
        {/* <SandpackProvider
        template='vanilla' // Use vanilla instead of nextjs
        theme={web9Theme}
        files={files}
        options={{
          activeFile: activePath,
          visibleFiles: files ? Object.keys(files) : [],
          classes: {
            'sp-layout': 'custom-layout',
            'sp-tabs': 'custom-tabs',
          },
        }}
      > */}

        {/* <SandpackProvider
        template='nextjs'
        files={files}
        customSetup={{
          dependencies: {
            next: 'latest',
            react: 'latest',
            'react-dom': 'latest',
          },
          entry: '/app/page.tsx', // Set the entry file
        }}
      > */}

        {/* <SandpackProvider
        template='nextjs'
        files={NEXT_APP_ROUTER_TEMPLATE_THREE.files}
        options={NEXT_APP_ROUTER_TEMPLATE_THREE.options}
        customSetup={NEXT_APP_ROUTER_TEMPLATE_THREE.customSetup}
      > */}
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
