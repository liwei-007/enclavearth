/**
 * 通过 sdk 调用 - 流式
 */
import { MODEL_CONFIGS, ModelType } from "@/types/model";
import { NextApiRequest } from "next";
import OpenAI from "openai";

const openAIClients: Record<ModelType, OpenAI | null> = {
  "deepseek-chat": null,
  "qwen-plus": null,
  "qwen-vl-ocr": null,
  "hunyuan-turbo": null,
  "generalv3.5": null,
};

function getOpenAIClient(model: ModelType): OpenAI {
  if (!openAIClients[model]) {
    const apiKey = MODEL_CONFIGS[model].apiKey;
    const baseURL = MODEL_CONFIGS[model].baseURL;
    openAIClients[model] = new OpenAI({
      baseURL,
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
  return openAIClients[model]!;
}

export default async function handler(req: NextApiRequest, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { input, model } = JSON.parse(req.body);

  if (!input || !model) {
    return res
      .status(400)
      .json({ error: "Missing required fields: input or model" });
  }

  const openai = getOpenAIClient(model);
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  try {
    const stream = await openai.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model,
      stream: true,
    });

    for await (const chunk of stream) {
      if (Array.isArray(chunk.choices) && chunk.choices.length > 0) {
        const content = chunk.choices[0].delta.content;
        if (content) {
          res.write(
            `data: ${JSON.stringify({ Content: content, IsDone: false })}\n\n`
          );
          res.flush(); // 强制刷新缓冲区，确保消息立即发送
        }
      }
    }
    // 发送最终完整内容
    res.write(`data: ${JSON.stringify({ Content: "", IsDone: true })}\n\n `);
    res.end();
  } catch (error) {
    console.log("error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the answer." });
  }
}
