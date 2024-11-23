import React from 'react';
import { User, Bot, Loader, Copy, Check } from 'lucide-react';
import { Message } from '../types';
import ActionButtons from './ActionButtons';
import ScreenshotViewer from './ScreenshotViewer';
import { useClipboard } from 'use-clipboard-copy';

interface ChatMessageProps {
  message: Message;
  onStepResponse?: (response: 'done' | 'problem') => void;
  onPermissionResponse?: (response: 'ok' | 'not-ok') => void;
  isAnalyzing?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onStepResponse,
  onPermissionResponse,
  isAnalyzing,
}) => {
  const clipboard = useClipboard();
  const [copiedBlockIndex, setCopiedBlockIndex] = React.useState<number | null>(null);

  const handleResponse = (response: 'ok' | 'not-ok' | 'done' | 'problem') => {
    if ((response === 'ok' || response === 'not-ok') && onPermissionResponse) {
      onPermissionResponse(response);
    } else if ((response === 'done' || response === 'problem') && onStepResponse) {
      onStepResponse(response);
    }
  };

  const handleCopyCode = (code: string, index: number) => {
    clipboard.copy(code);
    setCopiedBlockIndex(index);
    setTimeout(() => setCopiedBlockIndex(null), 2000);
  };

  const renderContent = () => {
    const content = message.content;
    
    // Split content by code blocks first
    const parts = content.split(/(```[^`]*```)/g);
    
    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            // Code block
            const code = part.slice(3, -3);
            const language = code.split('\n')[0];
            const codeContent = language ? code.slice(language.length + 1) : code;
            const cleanCode = codeContent.trim();
            
            return (
              <div key={index} className="bg-gray-800 text-white p-4 rounded-lg relative font-mono">
                <button
                  onClick={() => handleCopyCode(cleanCode, index)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                  title="Copy code"
                >
                  {copiedBlockIndex === index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <pre className="overflow-x-auto">
                  <code>{cleanCode}</code>
                </pre>
              </div>
            );
          } else {
            // Split by newlines first
            const paragraphs = part.split('\n\n').filter(Boolean);
            
            return (
              <div key={index} className="space-y-2">
                {paragraphs.map((paragraph, pIndex) => {
                  // Process links and bold within each paragraph
                  const processedText = paragraph.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((segment, i) => {
                    // Check if it's a bold text pattern
                    if (segment.startsWith('**') && segment.endsWith('**')) {
                      return <strong key={i}>{segment.slice(2, -2)}</strong>;
                    }
                    
                    // Check if it's a link pattern
                    const linkMatch = segment.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (linkMatch) {
                      return (
                        <a
                          key={i}
                          href={linkMatch[2]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline"
                        >
                          {linkMatch[1]}
                        </a>
                      );
                    }
                    
                    // Regular text
                    return segment;
                  });
                  
                  return <p key={pIndex}>{processedText}</p>;
                })}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex gap-4 p-4 ${
        message.type === 'user' ? 'bg-white flex-row-reverse' : 'bg-gray-50'
      }`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'
      }`}>
        {message.type === 'user' ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className={`flex-grow max-w-[80%] space-y-2 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-4 max-w-md">
            <ScreenshotViewer src={message.attachments[0]} />
          </div>
        )}

        <div className={`prose max-w-none ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
          {renderContent()}
        </div>

        {isAnalyzing && (
          <div className={`flex items-center gap-2 text-sm text-gray-500 ${message.type === 'user' ? 'justify-end' : ''}`}>
            <Loader className="w-4 h-4 animate-spin" />
            Analyzing screenshot...
          </div>
        )}

        {message.actions && (
          <div className={message.type === 'user' ? 'flex justify-end' : ''}>
            <ActionButtons
              type={message.actions.type}
              onResponse={handleResponse}
            />
          </div>
        )}

        <span className={`text-xs text-gray-400 block ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;