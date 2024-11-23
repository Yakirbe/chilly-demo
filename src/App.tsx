import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import VideoFeed from './components/VideoFeed';
import { Message, StepResponse, PermissionResponse } from './types';
import { INSTALLATION_STEPS, MOCK_MESSAGES } from './data/mockData';
import { mockAnalyzeScreenshot } from './services/mockAnalysis';

function App() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const captureScreen = async (stream: MediaStream) => {
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    const screenshot = canvas.toDataURL('image/png');
    video.pause();
    
    return screenshot;
  };

  const handleSendMessage = (
    content: string,
    attachments: string[] = [],
    actionType?: 'permission-request' | 'step-response',
    type: 'user' | 'assistant' = 'assistant'
  ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      attachments,
      ...(actionType && {
        actions: {
          type: actionType,
          options: actionType === 'permission-request' ? ['ok', 'not-ok'] : ['done', 'problem'],
        },
      }),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handlePermissionResponse = async (response: PermissionResponse) => {
    if (response === 'ok') {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false,
        });
        setStream(stream);
        
        const screenshot = await captureScreen(stream);
        if (screenshot) {
          handleSendMessage(
            INSTALLATION_STEPS[0].text,
            [screenshot],
            'step-response'
          );
        }
      } catch (err) {
        console.error('Error accessing screen:', err);
        handleSendMessage('Screen sharing permission was denied. Please try again when ready.', [], 'permission-request');
      }
    } else {
      handleSendMessage("No problem! When you're ready to proceed, just let me know and I'll guide you through the screen sharing setup.", [], 'permission-request');
    }
  };

  const handleStepResponse = async (response: StepResponse) => {
    if (!stream) return;
    
    setIsAnalyzing(true);
    
    try {
      const screenshot = await captureScreen(stream);
      if (screenshot) {
        const analysis = mockAnalyzeScreenshot(INSTALLATION_STEPS[currentStep]);
        
        if (analysis.includes('space before your OpenAI API key')) {
          handleSendMessage(
            analysis,
            [screenshot],
            'step-response'
          );
        } else {
          setCurrentStep(prev => prev + 1);
          if (currentStep + 1 < INSTALLATION_STEPS.length) {
            handleSendMessage(
              INSTALLATION_STEPS[currentStep + 1].text,
              [screenshot],
              'step-response'
            );
          } else {
            handleSendMessage(
              "🎉 Congratulations! LangGraph Studio is now installed and ready to use. You can start building and visualizing your graphs. Is there anything else you need help with?",
              [screenshot]
            );
          }
        }
      }
    } catch (error) {
      console.error('Error during screen capture:', error);
      handleSendMessage("I couldn't capture the screen. Please try again.", [], undefined);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUserInput = async (content: string) => {
    handleSendMessage(content, [], undefined, 'user');
    
    if (stream) {
      const screenshot = await captureScreen(stream);
      if (screenshot) {
        handleSendMessage(
          "I understand you want to proceed. Let's continue with the installation process. Please follow the next step:",
          [screenshot],
          'step-response'
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-semibold">LangGraph Studio Installation Guide</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-4xl bg-white shadow-lg my-4 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <div className="space-y-2">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                onStepResponse={handleStepResponse}
                onPermissionResponse={handlePermissionResponse}
                isAnalyzing={isAnalyzing}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <ChatInput onSendMessage={handleUserInput} />
      </main>

      {stream && <VideoFeed stream={stream} />}
    </div>
  );
}

export default App;