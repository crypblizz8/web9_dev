import { useState } from 'react';

// Define the file structure type
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface FileExplorerProps {
  files: FileNode[];
  onSelectFile: (path: string) => void;
  selectedPath: string;
}

// Component to render a single file or directory
const FileItem = ({
  node,
  depth = 0,
  onSelectFile,
  selectedPath,
  isOpen,
  onToggle,
}: {
  node: FileNode;
  depth?: number;
  onSelectFile: (path: string) => void;
  selectedPath: string;
  isOpen?: boolean;
  onToggle?: () => void;
}) => {
  const isSelected = node.path === selectedPath;
  const paddingLeft = `${depth * 16 + 8}px`;

  // Get file icon based on file type or extension
  const getFileIcon = () => {
    if (node.type === 'directory') {
      return isOpen ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='text-gray-400'
        >
          <path d='M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1' />
          <path d='M5 19h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2Z' />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='text-gray-400'
        >
          <path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' />
        </svg>
      );
    }

    // Check file extension
    const ext = node.name.split('.').pop();

    if (ext === 'tsx' || ext === 'jsx') {
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='text-blue-400'
        >
          <polyline points='16 18 22 12 16 6' />
          <polyline points='8 6 2 12 8 18' />
        </svg>
      );
    }

    if (ext === 'css') {
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='text-purple-400'
        >
          <path d='M12 2l9 4.9V17L12 22 3 17V7L12 2z' />
        </svg>
      );
    }

    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='text-gray-400'
      >
        <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
        <polyline points='14 2 14 8 20 8' />
        <line x1='16' y1='13' x2='8' y2='13' />
        <line x1='16' y1='17' x2='8' y2='17' />
        <polyline points='10 9 9 9 8 9' />
      </svg>
    );
  };

  // For files, render a clickable item
  if (node.type === 'file') {
    return (
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-blue-100 text-blue-800' : ''
        }`}
        style={{ paddingLeft }}
        onClick={() => onSelectFile(node.path)}
      >
        <span className='mr-2'>{getFileIcon()}</span>
        <span className='text-sm truncate'>{node.name}</span>
      </div>
    );
  }

  // For directories, render a toggle-able item with children
  return (
    <div>
      <div
        className='flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100'
        style={{ paddingLeft }}
        onClick={onToggle}
      >
        <span className='mr-2'>{getFileIcon()}</span>
        <span className='text-sm font-medium'>{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileItem
              key={child.path}
              node={child}
              depth={depth + 1}
              onSelectFile={onSelectFile}
              selectedPath={selectedPath}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileExplorer({
  files,
  onSelectFile,
  selectedPath,
}: FileExplorerProps) {
  // Track which directories are open
  const [openDirs, setOpenDirs] = useState<Record<string, boolean>>({
    '/app': true,
    '/components': true,
  });

  const toggleDir = (path: string) => {
    setOpenDirs((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <div className='h-full overflow-y-auto border-r border-gray-200 bg-white'>
      <div className='p-3 border-b border-gray-200'>
        <div className='text-sm font-medium text-gray-500'>Files</div>
      </div>
      <div>
        {files.map((node) => (
          <FileItem
            key={node.path}
            node={node}
            onSelectFile={onSelectFile}
            selectedPath={selectedPath}
            isOpen={!!openDirs[node.path]}
            onToggle={() => toggleDir(node.path)}
          />
        ))}
      </div>
    </div>
  );
}
