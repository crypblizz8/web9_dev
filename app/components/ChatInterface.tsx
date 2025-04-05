import {
  useState,
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

// Add display name to fix lint error
const ChatInterface = forwardRef<
  {
    addAssistantMessage: (content: string) => void;
    addUserMessage: (message: Message) => void;
    setInputValue: (value: string) => void;
    updateSystemMessage: (content: string) => void;
  },
  ChatInterfaceProps
>(({ onSubmit, isLoading }, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: "Welcome to Vib3! Let's start building.",
    },
  ]);

  useEffect(() => {
    if (isLoading) {
      const loadingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Generating code...',
      };
      setMessages((prev) => [...prev, loadingMessage]);
    }
  }, [isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      // Add user message to chat if it doesn't already exist
      const messageExists = messages.some(
        (msg) => msg.role === 'user' && msg.content === inputValue
      );

      if (!messageExists) {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: inputValue,
        };

        setMessages((prev) => [...prev, userMessage]);
      }

      // Send to parent for processing
      onSubmit(inputValue);

      // Clear input
      setInputValue('');
    }
  };

  const addAssistantMessage = (content: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const addUserMessage = (message: Message) => {
    // Check if a message with this content already exists to avoid duplicates
    const messageExists = messages.some(
      (msg) => msg.role === 'user' && msg.content === message.content
    );

    if (!messageExists) {
      setMessages((prev) => [...prev, message]);
    }
  };

  const updateSystemMessage = (content: string) => {
    // Only update the system message
    setMessages((prev) => {
      // Find the system message
      const updatedMessages = [...prev];
      const systemMessageIndex = updatedMessages.findIndex(
        (msg) => msg.role === 'system'
      );

      if (systemMessageIndex !== -1) {
        // Update existing system message
        updatedMessages[systemMessageIndex] = {
          ...updatedMessages[systemMessageIndex],
          content: "Welcome to Vib3! Let's start building.",
        };
      }

      return updatedMessages;
    });
  };

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    addAssistantMessage,
    addUserMessage,
    setInputValue,
    updateSystemMessage,
  }));

  return (
    <div className='flex flex-col h-full w-full bg-[#1e1e1e]'>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
            data-role={message.role}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-transparent border-2 border-[#3B3B3B] text-white'
                  : 'bg-[#3B3B3B] text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-[#3B3B3B] p-3 rounded-lg'>
              <div className='flex space-x-2'>
                <div className='w-2 h-2 rounded-full bg-gray-400 animate-bounce'></div>
                <div className='w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75'></div>
                <div className='w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150'></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className='p-4'
      >
        <div className='relative'>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Tell me what to build'
            className='w-full h-[120px] bg-transparent border border-[#EEEDE1] rounded-lg px-6 pt-5 pb-11 focus:outline-none focus:border-[#507C36] focus:ring-1 focus:ring-[#507C36] transition-colors duration-150 resize-none overflow-y-auto text-[#EEEDE1]'
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type='submit'
            disabled={isLoading || !inputValue.trim()}
            className='absolute right-4 bottom-4 w-6 h-6 bg-[#507C36] rounded flex items-center justify-center hover:bg-[#5d8f3f] transition-colors duration-150 disabled:opacity-50'
          >
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
          </button>
        </div>
      </form>

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
          border: 3px solid #1e1e1e;
        }
        textarea::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
});

// Add display name
ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
