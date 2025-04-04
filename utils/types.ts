// File structure types
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

// Message types for chat
export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Types for generated code
export interface GeneratedCode {
  files: Record<string, string>;
  mainFile: string;
}
