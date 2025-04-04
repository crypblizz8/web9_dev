/**
 * Parses a structured code response from the AI into individual files
 *
 * Expects code in format:
 * ---FILE: filepath---
 * file content
 * ---FILE: filepath2---
 * file content 2
 * ...
 */
export function parseCodeResponse(response: string): Record<string, string> {
  const files: Record<string, string> = {};

  // Pattern to match file blocks
  const filePattern = /---FILE: ([^-]+)---\n([\s\S]*?)(?=\n---FILE:|$)/g;

  // Find all file matches
  let match;
  while ((match = filePattern.exec(response)) !== null) {
    const [_, path, content] = match;
    files[path.trim()] = content.trim();
  }

  // If no files were found, try to parse as a single HTML file
  if (Object.keys(files).length === 0) {
    // Check if it's likely an HTML file
    if (response.includes('<html') || response.includes('<!DOCTYPE html')) {
      files['/index.html'] = response.trim();
    } else {
      // Default to a single file if we can't detect format
      files['/app/page.tsx'] = response.trim();
    }
  }

  return files;
}

/**
 * Transforms a flat files object into a tree structure for the file explorer
 */
export function createFileTree(files: Record<string, string>) {
  // Create root directories
  const tree = [
    {
      name: 'app',
      path: '/app',
      type: 'directory' as const,
      children: [],
    },
    {
      name: 'components',
      path: '/components',
      type: 'directory' as const,
      children: [],
    },
  ];

  // Sort files by path to process parent directories first
  const sortedPaths = Object.keys(files).sort();

  // Process each file
  for (const path of sortedPaths) {
    // Skip any non-string paths
    if (typeof path !== 'string') continue;

    // Handle root files
    if (!path.includes('/') || path === '/index.html') {
      tree.push({
        name: path.replace('/', ''),
        path: path,
        type: 'file' as const,
      });
      continue;
    }

    // Split path into segments
    const segments = path.split('/').filter((s) => s);
    const fileName = segments.pop() || '';

    // Find the right directory for this file
    let currentLevel = tree;
    let currentPath = '';

    for (const segment of segments) {
      currentPath += '/' + segment;

      // Find the directory at this level
      let dir = currentLevel.find(
        (item) => item.type === 'directory' && item.name === segment
      );

      // Create directory if it doesn't exist
      if (!dir) {
        dir = {
          name: segment,
          path: currentPath,
          type: 'directory' as const,
          children: [],
        };
        currentLevel.push(dir);
      }

      // Move to the next level
      currentLevel = dir.children!;
    }

    // Add the file to the current directory
    currentLevel.push({
      name: fileName,
      path: path,
      type: 'file' as const,
    });
  }

  return tree;
}

/**
 * Updates the prompt to request structured file output
 */
export function createStructuredPrompt(prompt: string): string {
  return `Generate Next.js code for: ${prompt}
    
  Please follow these guidelines:
  - Structure your response as multiple files
  - Use semantic HTML5, modern CSS (with Tailwind), and React/Next.js best practices
  - For each file, start with ---FILE: filepath--- followed by the file content
  - Include all necessary components and styles
  - Create a responsive, modern design
  - Return app/page.tsx as the main component
  - Include a layout.tsx file with proper metadata
  
  For example:
  ---FILE: /app/page.tsx---
  export default function Home() {
    return (
      <main>...</main>
    )
  }
  
  ---FILE: /components/Button.tsx---
  export default function Button() {
    return ...
  }
  
  Implement a complete solution that includes all necessary files.`;
}
