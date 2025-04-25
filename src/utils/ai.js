// utils/ai.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
});

async function generateReplySuggestions(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that generates professional and concise reply suggestions to customer feedback.",
      },
      {
        role: "user",
        content: `Please provide 3 polite and professional reply suggestions to the following customer feedback:\n\n"${text}"`,
      },
    ],
    temperature: 0.7,
  });

  const replyText = response.choices[0].message.content.trim();

  // Split suggestions using regex to capture numbered list format
  const suggestions = replyText
    .split(/\n\d+\.\s+/) // Split on newline followed by "1. ", "2. ", etc.
    .filter(Boolean);    // Remove empty entries

  return suggestions;
}

export default generateReplySuggestions;
