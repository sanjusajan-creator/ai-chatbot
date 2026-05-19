import { flushSync } from 'react-dom';
const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;
export default async function run(prompt, onChunk) {
  const response = await fetch('/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });
  if (!response.ok) {
    console.error('NVIDIA Error:', response.status, await response.text());
    return '';
  }
  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .getReader();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const token = json?.choices?.[0]?.delta?.content;
        if (token) {
          // force immediate render per chunk
          flushSync(() => onChunk?.(token));
        }
      } catch {}
    }
  }
}

// export default async function run(prompt) {
//   try {
//     const response = await fetch('/api/chat', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ prompt })
//     });

//     if (!response.ok) {
//       console.error('API Error:', response.status, response.statusText);
//       const errorData = await response.json();
//       console.error('Error details:', errorData);
//       return;
//     }

//     const data = await response.json();
    
//     // Cleanly logs the content matching the exact behavior of your old Gemini file
//     console.log(data.content);
//   } catch (error) {
//     console.error('Fetch Error:', error);
//   }
// }


// import { GoogleGenAI } from '@google/genai';
// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// const genAI = new GoogleGenAI({ apiKey });
// export default async function run(prompt) {
//   const response = await genAI.models.generateContent({
//     model: 'gemini-2.5-flash',
//     contents: prompt,
//   });
//   console.log(response.text);
//   return response.text;
// }
