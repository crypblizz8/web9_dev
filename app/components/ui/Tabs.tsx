import React, { useState, ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: number;
}

export default function Tabs({ tabs, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex border-b border-muted'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === index
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className='flex-1 overflow-auto'>{tabs[activeTab].content}</div>
    </div>
  );
}
