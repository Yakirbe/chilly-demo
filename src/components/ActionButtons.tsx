import React from 'react';
import { CheckCircle, XCircle, Camera, Ban } from 'lucide-react';

interface ActionButtonsProps {
  type: 'permission-request' | 'step-response';
  onResponse: (response: 'ok' | 'not-ok' | 'done' | 'problem') => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ type, onResponse }) => {
  if (type === 'permission-request') {
    return (
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onResponse('ok')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Camera className="w-4 h-4" />
          Allow Screen Capture
        </button>
        <button
          onClick={() => onResponse('not-ok')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <Ban className="w-4 h-4" />
          Not Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => onResponse('done')}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <CheckCircle className="w-4 h-4" />
        Done
      </button>
      <button
        onClick={() => onResponse('problem')}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <XCircle className="w-4 h-4" />
        I have a problem
      </button>
    </div>
  );
};

export default ActionButtons;