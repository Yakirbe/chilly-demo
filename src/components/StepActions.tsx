import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface StepActionsProps {
  onResponse: (response: 'done' | 'problem') => void;
}

const StepActions: React.FC<StepActionsProps> = ({ onResponse }) => {
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

export default StepActions;