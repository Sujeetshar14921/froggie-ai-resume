import dotenv from "dotenv";
dotenv.config();

const apiKey = (process.env.OPENAI_API_KEY || "").replace(/["']/g, "").trim();
const baseURL = (process.env.OPENAI_BASE_URL || "").replace(/["']/g, "").trim();
const defaultModel = (process.env.OPENAI_MODEL || "gemini-3.5-flash").replace(/["']/g, "").trim();

/**
 * Universal AI Client with zero-latency Google Gemini & OpenAI interoperability
 */
class UniversalAiClient {
  constructor({ apiKey, baseURL, model }) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.model = model || "gemini-3.5-flash";
  }

  get chat() {
    return {
      completions: {
        create: async ({ model, messages, response_format, temperature = 0.7 }) => {
          const targetModel = model || this.model;
          const isGeminiKey = this.apiKey.startsWith("AIza") || this.baseURL?.includes("googleapis.com");

          if (isGeminiKey) {
            const modelsToTry = [
              targetModel,
              "gemini-3.5-flash",
              "gemini-3-flash-preview",
              "gemini-flash-lite-latest",
              "gemma-4-31b-it",
            ];

            let lastErr = null;
            for (const m of modelsToTry) {
              try {
                const systemMsg = messages
                  .filter((msg) => msg.role === "system")
                  .map((msg) => msg.content)
                  .join("\n\n");

                const userAndHistory = messages
                  .filter((msg) => msg.role !== "system")
                  .map((msg) => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [
                      {
                        text:
                          typeof msg.content === "string"
                            ? msg.content
                            : JSON.stringify(msg.content),
                      },
                    ],
                  }));

                const body = {
                  contents:
                    userAndHistory.length > 0
                      ? userAndHistory
                      : [{ role: "user", parts: [{ text: "Hello" }] }],
                  generationConfig: {
                    temperature: temperature,
                    ...(response_format?.type === "json_object"
                      ? { responseMimeType: "application/json" }
                      : {}),
                  },
                };

                if (systemMsg) {
                  body.systemInstruction = { parts: [{ text: systemMsg }] };
                }

                const res = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${this.apiKey}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  }
                );

                const data = await res.json();
                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                  return {
                    choices: [
                      {
                        message: {
                          content: data.candidates[0].content.parts[0].text,
                          role: "assistant",
                        },
                      },
                    ],
                  };
                } else if (data.error) {
                  lastErr = new Error(
                    data.error.message || `Gemini Error ${data.error.code}`
                  );
                }
              } catch (e) {
                lastErr = e;
              }
            }
            throw lastErr || new Error("Failed all AI models");
          } else {
            const { default: OpenAI } = await import("openai");
            const openai = new OpenAI({
              apiKey: this.apiKey,
              ...(this.baseURL ? { baseURL: this.baseURL } : {}),
            });
            return await openai.chat.completions.create({
              model: targetModel,
              messages,
              response_format,
              temperature,
            });
          }
        },
      },
    };
  }
}

const ai = new UniversalAiClient({
  apiKey,
  baseURL,
  model: defaultModel,
});

export default ai;