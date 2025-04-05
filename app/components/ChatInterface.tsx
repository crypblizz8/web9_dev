import { useState, FormEvent, forwardRef, useImperativeHandle } from 'react';

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
  { addAssistantMessage: (content: string) => void },
  ChatInterfaceProps
>(({ onSubmit, isLoading }, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content:
        "Welcome to Web 9! Describe what you want to build, and I'll generate the code for you.",
    },
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      // Add user message to chat
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputValue,
      };

      setMessages((prev) => [...prev, userMessage]);

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

  // Expose the addAssistantMessage method to parent components
  useImperativeHandle(ref, () => ({
    addAssistantMessage,
  }));

  return (
    <div className='flex flex-col h-full'>
      <div className='p-4 border-b border-muted flex items-center'>
        <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-2'>
          web9
        </div>
        <h1 className='text-lg font-medium'>web nine</h1>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-muted p-3 rounded-lg'>
              <div className='flex space-x-2'>
                <div className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce'></div>
                <div className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-75'></div>
                <div className='w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-150'></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className='border-t border-muted p-4'>
        <div className='flex items-center'>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Describe what you want to build...'
            className='flex-1 p-2 border border-muted rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary'
            disabled={isLoading}
          />
          <button
            type='submit'
            disabled={isLoading || !inputValue.trim()}
            className='p-2 bg-primary text-primary-foreground rounded-r-md hover:bg-opacity-90 disabled:opacity-50'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='22' y1='2' x2='11' y2='13'></line>
              <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
});

// Add display name
ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
