import { InstallationStep } from '../types';

let hasApiKeyError = true; // Start with error state

export function mockAnalyzeScreenshot(currentStep: InstallationStep): string {
  const mockResponses: Record<string, string> = {
    'download-langgraph-studio': 'Perfect! I can see the LangGraph Studio .dmg file in your Downloads folder. The download completed successfully. Let\'s proceed with the installation.',
    'install-docker-or-orbstack': 'Great job clicking the Apple menu! I can see the System Settings window is now open. Let\'s continue with the security settings.',
    'open-system-settings': 'Excellent! The System Settings window is now active. I can see you\'ve navigated there correctly.',
    'open-privacy-security': 'Well done! You\'ve found the Privacy & Security section. I can see all the security options are now visible.',
    'allow-docker': 'Perfect! Docker Desktop is now running - I can see the whale icon in your menu bar. The Docker daemon is active and ready.',
    'open-terminal': 'Great! I can see you\'ve opened Terminal successfully. The command prompt is ready for our next steps.',
    'clone-repo': 'Excellent work! The git clone command completed successfully. I can see the langgraph-example directory has been created.',
    'navigate-to-repo': 'Perfect! You\'re now in the correct directory. I can see the terminal prompt shows you\'re inside langgraph-example.',
    'create-env-file': 'Well done! The .env file has been created successfully. I can see it\'s now ready for editing.',
    'add-api-keys': hasApiKeyError ? 
      'I notice there\'s a space before your OpenAI API key in the .env file. The line looks like this:\n\nOPENAI_API_KEY= sk-...\n\nThis will cause issues. Please remove the space after the = sign so it looks like:\n\nOPENAI_API_KEY=sk-...\n\nAfter fixing this, click "Done" to proceed.' :
      'Perfect! I can see all the API keys are properly formatted in your .env file:\n\nOPENAI_API_KEY=sk-...\nANTHROPIC_API_KEY=sk-...\nTAVILY_API_KEY=tvly-...\n\nThe format is correct with no spaces after the equal signs.',
    'remove-langsmith-key': 'Great job! I can confirm the LANGSMITH_API_KEY line has been removed from the .env file.',
    'open-dmg': 'Perfect! I can see the LangGraph Studio installer window is now open.',
    'drag-to-applications': 'Excellent! LangGraph Studio has been successfully moved to your Applications folder.',
    'open-langgraph': 'Well done! LangGraph Studio is now running. I can see the application window.',
    'click-sign-in': 'Perfect! The LangSmith login form is now visible.',
    'enter-credentials': 'Great! You\'ve successfully logged in to LangGraph Studio with your LangSmith account.',
    'open-project': 'Excellent! I can see the file picker dialog is now open.',
    'select-folder': 'Perfect! The langgraph-example project has been successfully loaded.',
    'check-graph': 'Wonderful! I can see the graph visualization is now displayed in the main window.',
  };

  // If we're on the API keys step and it's the second attempt, clear the error
  if (currentStep.id === 'add-api-keys' && !hasApiKeyError) {
    return mockResponses['add-api-keys'];
  }

  // If we're on the API keys step and it's the first attempt, show error and clear it for next time
  if (currentStep.id === 'add-api-keys' && hasApiKeyError) {
    hasApiKeyError = false;
    return mockResponses['add-api-keys'];
  }

  return mockResponses[currentStep.id] || 'Excellent work! I can see you\'ve completed this step successfully. Let\'s move on to the next one.';
}