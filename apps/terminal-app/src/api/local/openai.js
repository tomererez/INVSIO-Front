/**
 * OpenAI API Client
 * Direct connection to OpenAI API, replacing Base44 InvokeLLM
 */

const getApiKey = () => {
    const key = import.meta.env.VITE_OPENAI_API_KEY;
    if (!key) {
        console.error("Missing VITE_OPENAI_API_KEY in environment variables");
        // You might want to throw or return null, depending on desired UX
    }
    return key;
};

export const invokeLLM = async ({ prompt, response_json_schema, messages = [] }) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        return { error: "OpenAI API Key is missing. Please add VITE_OPENAI_API_KEY to your .env file." };
    }

    const systemMessage = {
        role: "system",
        content: "You are a helpful AI assistant for a crypto trading application."
    };

    const userMessage = {
        role: "user",
        content: prompt
    };

    const apiMessages = [systemMessage, ...messages, userMessage];

    try {
        const body = {
            model: "gpt-4-turbo-preview", // Or gpt-4o if available to your key
            messages: apiMessages,
            temperature: 0.7,
        };

        if (response_json_schema) {
            body.response_format = { type: "json_object" };
            // Ensure the prompt asks for JSON if not already
            if (!prompt.includes("JSON")) {
                apiMessages[apiMessages.length - 1].content += "\n\nProvide output in JSON format.";
            }
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "OpenAI API request failed");
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        if (response_json_schema) {
            try {
                return JSON.parse(content);
            } catch (e) {
                console.error("Failed to parse JSON response from OpenAI", e);
                return { error: "Failed to parse AI response" };
            }
        }

        return content;

    } catch (error) {
        console.error("OpenAI API Error:", error);
        return { error: error.message };
    }
};
