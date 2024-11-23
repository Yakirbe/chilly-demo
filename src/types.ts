export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  attachments?: string[];
  actions?: {
    type: 'permission-request' | 'step-response';
    options: ['ok' | 'not-ok'] | ['done' | 'problem'];
  };
}

export interface InstallationStep {
  id: string;
  text: string;
}

export type StepResponse = 'done' | 'problem';
export type PermissionResponse = 'ok' | 'not-ok';