import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from 'use-clipboard-copy';

interface CodeBlockProps {
  content: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content }) => {
  const clipboard = useClipboard();
  const [copied, setCopied] = React.useState(false);

  const extractCodeBlock = (content: string) => {
    const match = content.match(/```(\w+)?\n([\s\S]*?)```/);
    return {
      language: match?.[1] || 'plaintext',
      code: match?.[2]?.trim() || content,
    };
  };

  const { language, code } = extractCodeBlock(content);

  const handleCopy = () => {
    clipboard.copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="p-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        className="rounded-lg !mt-0"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;