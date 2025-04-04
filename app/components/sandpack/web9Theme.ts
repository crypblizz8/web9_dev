import { SandpackTheme } from '@codesandbox/sandpack-react';

// Custom theme that matches the web9 UI
export const web9Theme: SandpackTheme = {
  colors: {
    surface1: '#1e1e1e', // Darker background
    surface2: '#2d2d2d', // Slightly lighter background for contrast
    surface3: '#3e3e3e', // Even lighter background for hover states
    clickable: '#999999', // Default text color for buttons
    base: '#dbdbdb', // Default text color
    disabled: '#4d4d4d', // Disabled state color
    hover: '#ffffff', // Hover text color
    accent: '#0099ff', // Primary accent (blue in your UI)
    error: '#ff5a5a', // Error color
    errorSurface: '#352525', // Error background
  },
  syntax: {
    keyword: '#ff79c6', // Pink for keywords
    property: '#8be9fd', // Cyan for properties
    plain: '#f8f8f2', // Default text
    static: '#bd93f9', // Purple for static stuff
    string: '#f1fa8c', // Yellow for strings
    definition: '#50fa7b', // Green for definitions
    punctuation: '#f8f8f2', // Default for punctuation
    tag: '#ff79c6', // Pink for HTML tags
    comment: '#6272a4', // Blue-gray for comments
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace',
    size: '14px',
    lineHeight: '1.5',
  },
};
