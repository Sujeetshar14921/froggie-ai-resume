import dotenv from "dotenv";
dotenv.config();

const rawKey =
  process.env.GEMINI_API_KEY ||
  process.env.OPENAI_API_KEY ||
  "";
const apiKey = rawKey.replace(/["']/g, "").trim();
const baseURL = (process.env.OPENAI_BASE_URL || "").replace(/["']/g, "").trim();
const defaultModel = (
  process.env.GEMINI_MODEL ||
  process.env.OPENAI_MODEL ||
  "gemini-2.5-flash"
)
  .replace(/["']/g, "")
  .trim();

/**
 * Universal AI Client with zero-latency Google Gemini & OpenAI interoperability
 * Provides native Gemini Function Calling, Multi-turn conversations, and fallback resilience.
 */
class UniversalAiClient {
  constructor({ apiKey, baseURL, model }) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.model = model || "gemini-2.5-flash";
  }

  get isGemini() {
    return (
      this.apiKey.startsWith("AIza") ||
      Boolean(this.baseURL?.includes("googleapis.com")) ||
      Boolean(process.env.GEMINI_API_KEY)
    );
  }

  /**
   * Directly call Gemini generateContent with support for tools / function declarations
   */
  async generateContent({
    model,
    contents,
    tools,
    systemInstruction,
    generationConfig = {},
  }) {
    const targetModel = model || this.model;
    const modelsToTry = [
      targetModel,
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-1.5-flash",
      "gemini-2.5-pro",
    ];

    const uniqueModels = [...new Set(modelsToTry)];
    let lastError = null;

    for (const m of uniqueModels) {
      try {
        const body = {
          contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: String(contents) }] }],
          generationConfig: {
            temperature: 0.7,
            ...generationConfig,
          },
        };

        if (systemInstruction) {
          body.systemInstruction =
            typeof systemInstruction === "string"
              ? { parts: [{ text: systemInstruction }] }
              : systemInstruction;
        }

        if (tools && tools.length > 0) {
          body.tools = tools;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${this.apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.candidates && data.candidates.length > 0) {
          const candidate = data.candidates[0];
          const parts = candidate?.content?.parts || [];
          const textPart = parts.find((p) => p.text !== undefined);
          const funcCallPart = parts.find((p) => p.functionCall !== undefined);

          return {
            model: m,
            text: textPart?.text || "",
            functionCall: funcCallPart?.functionCall || null,
            candidate,
            raw: data,
          };
        } else if (data.error) {
          lastError = new Error(data.error.message || `Gemini API Error (${data.error.code})`);
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("All Gemini models failed to generate content.");
  }

  get chat() {
    return {
      completions: {
        create: async ({
          model,
          messages,
          response_format,
          temperature = 0.7,
          tools,
        }) => {
          const targetModel = model || this.model;

          if (this.isGemini) {
            // Extract system messages
            const systemMsg = messages
              .filter((msg) => msg.role === "system")
              .map((msg) => msg.content)
              .join("\n\n");

            // Format contents for Gemini
            const contents = messages
              .filter((msg) => msg.role !== "system")
              .map((msg) => {
                const parts = [];
                if (msg.functionResponse) {
                  parts.push({ functionResponse: msg.functionResponse });
                } else if (msg.functionCall) {
                  parts.push({ functionCall: msg.functionCall });
                } else {
                  parts.push({
                    text:
                      typeof msg.content === "string"
                        ? msg.content
                        : JSON.stringify(msg.content),
                  });
                }

                return {
                  role: msg.role === "assistant" ? "model" : "user",
                  parts,
                };
              });

            // Convert OpenAI tools format to Gemini functionDeclarations if passed
            let geminiTools = null;
            if (tools && Array.isArray(tools)) {
              const declarations = tools
                .filter((t) => t.type === "function" && t.function)
                .map((t) => ({
                  name: t.function.name,
                  description: t.function.description || "",
                  parameters: t.function.parameters || { type: "OBJECT", properties: {} },
                }));

              if (declarations.length > 0) {
                geminiTools = [{ functionDeclarations: declarations }];
              } else if (tools[0]?.functionDeclarations) {
                geminiTools = tools;
              }
            }

            const generationConfig = {
              temperature,
              ...(response_format?.type === "json_object"
                ? { responseMimeType: "application/json" }
                : {}),
            };

            const result = await this.generateContent({
              model: targetModel,
              contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Hello" }] }],
              tools: geminiTools,
              systemInstruction: systemMsg,
              generationConfig,
            });

            return {
              choices: [
                {
                  message: {
                    content: result.text,
                    role: "assistant",
                    functionCall: result.functionCall,
                    tool_calls: result.functionCall
                      ? [
                          {
                            id: `call_${Date.now()}`,
                            type: "function",
                            function: {
                              name: result.functionCall.name,
                              arguments: JSON.stringify(result.functionCall.args || {}),
                            },
                          },
                        ]
                      : undefined,
                  },
                },
              ],
            };
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
              tools,
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