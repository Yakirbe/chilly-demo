import { Message, InstallationStep } from '../types';

export const INSTALLATION_STEPS: InstallationStep[] = [
  {
    id: 'download-langgraph-studio',
    text: "I can see the LangGraph Studio .dmg file in your Downloads folder.\n\nNow, click this link to download LangGraph Studio: [Download LangGraph Studio](https://langgraph-studio.vercel.app/api/mac/latest)",
  },
  {
    id: 'install-docker-or-orbstack',
    text: "Great job downloading LangGraph Studio!\n\nNow let's set up Docker Desktop. Click the Apple menu in the top-left corner of your screen.",
  },
  {
    id: 'open-system-settings',
    text: "Great job clicking the Apple menu. I can see the System Settings window is now open.\n\nClick 'System Settings' in the dropdown menu.",
  },
  {
    id: 'open-privacy-security',
    text: "The System Settings window is now active.\n\nClick 'Privacy & Security' in the sidebar.",
  },
  {
    id: 'allow-docker',
    text: "Well done.\nYou've found the Privacy & Security section.\n\nNow scroll down and click 'Allow & Restart' next to Docker Desktop.",
  },
  {
    id: 'open-terminal',
    text: "Docker Desktop is now running - I can see the whale icon in your menu bar.\n\nLet's open Terminal - press `Cmd + Space` and type 'Terminal', then press Enter.",
  },
  {
    id: 'clone-repo',
    text: "I can see you've opened Terminal successfully.\n\nNow let's clone the example repository. Run this command:\n```bash\ngit clone https://github.com/langchain-ai/langgraph-example.git\n```",
  },
  {
    id: 'navigate-to-repo',
    text: "The repository has been cloned successfully.\n\nNow navigate to the project directory:\n```bash\ncd langgraph-example\n```",
  },
  {
    id: 'create-env-file',
    text: "You're now in the correct directory.\n\nLet's create and open the environment file:\n```bash\ntouch .env\ncode .env\n```",
  },
  {
    id: 'add-api-keys',
    text: "The .env file is ready for editing.\n\nCopy these API key placeholders into your .env file:\n```bash\nOPENAI_API_KEY=sk-...\nANTHROPIC_API_KEY=sk-...\nTAVILY_API_KEY=tvly-...\n```",
  },
  {
    id: 'remove-langsmith-key',
    text: "I can see all the API keys are properly formatted in your .env file.\n\nNow delete any line that starts with `LANGSMITH_API_KEY` and save the file with `Cmd + S`.",
  },
  {
    id: 'open-dmg',
    text: "The LANGSMITH_API_KEY has been removed.\n\nNow let's install LangGraph Studio - double-click the downloaded `.dmg` file.",
  },
  {
    id: 'drag-to-applications',
    text: "The installer window is now open.\n\nDrag the **LangGraph Studio** icon to the **Applications** folder.",
  },
  {
    id: 'open-langgraph',
    text: "LangGraph Studio has been installed.\n\nPress `Cmd + Space`, type 'LangGraph Studio', and press Enter to launch it.",
  },
  {
    id: 'click-sign-in',
    text: "LangGraph Studio is now running.\n\nClick the '**Sign in with LangSmith**' button.",
  },
  {
    id: 'enter-credentials',
    text: "The login form is visible.\n\nEnter your LangSmith email and password, then click '**Sign In**'.",
  },
  {
    id: 'open-project',
    text: "You've successfully logged in.\n\nClick the '**Open Project**' button in the top-left corner.",
  },
  {
    id: 'select-folder',
    text: "The file picker dialog is open.\n\nNavigate to and select the `langgraph-example` folder.",
  },
  {
    id: 'check-graph',
    text: "The project has been loaded.\n\nLook for connected boxes in the main window. If not visible, click '**Refresh**'.",
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-init-1',
    type: 'assistant',
    content: "👋 Hello! I'll help you install **LangGraph Studio**. I'll guide you through each step and verify your progress using screen sharing.",
    timestamp: new Date('2024-02-20T10:00:00'),
  },
  {
    id: 'msg-init-2',
    type: 'assistant',
    content: "To provide better assistance, I'll need to see your screen. This helps me verify each step and provide accurate guidance. Would you like to proceed with screen sharing?",
    timestamp: new Date('2024-02-20T10:00:05'),
    actions: {
      type: 'permission-request',
      options: ['ok', 'not-ok'],
    },
  }
];