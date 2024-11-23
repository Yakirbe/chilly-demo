import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeScreenshot(imageBase64: string): Promise<string> {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your_openai_api_key_here') {
      return "OpenAI API key not configured. Please add your API key to the .env file.";
    }

    // Remove the data URL prefix
    const base64Image = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze this screenshot and describe what you see, focusing on any UI elements, their state, and potential issues or progress in the installation process.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || 'Unable to analyze the screenshot.';
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "Invalid OpenAI API key. Please check your configuration.";
      }
    }
    console.error('Error analyzing screenshot:', error);
    return 'Failed to analyze the screenshot. Please try again.';
  }
}