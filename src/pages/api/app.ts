import request from "@/utils/axios";
import { NextApiRequest } from "next";

type ModelType = "generalv3.5" | "qwen-plus";
type ModelConfig = {
  baseURL: string;
  apiKey: string;
};

const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  "qwen-plus": {
    baseURL:
      "https://dashscope.aliyuncs.com/api/v1/apps/d7045172f58049279283515fa53f98bd/completion",
    apiKey: process.env.NEXT_PUBLIC_QWEN_KEY!,
  },
  "generalv3.5": {
    baseURL: "https://spark-api-open.xf-yun.com/v1/chat/completions",
    apiKey: "dJFSOjOupsoxVAyNffxL:buIgpyokaDABlaidxjHX",
  },
};

export default async function handler(req: NextApiRequest, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { input, model } = req.body;

  const apiKey = MODEL_CONFIGS[model as ModelType]?.apiKey;
  const baseURL = MODEL_CONFIGS[model as ModelType].baseURL;

  if (!input || !model) {
    return res
      .status(400)
      .json({ error: "Missing required fields: input or model" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  //   messages: [
  //     {
  //       role: "user",
  //       content: input,
  //     },
  //   ],

  try {
    const response = await request.post<any>(
      baseURL,
      {
        // model,
        input,
        parameters: {
          incremental_output: "true", // 增量输出
        },
        debug: {},
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "X-DashScope-SSE": "enable", // 流式输出
          "Content-Type": "application/json",
        },
        responseType: "stream", // 确保以流的形式处理响应
      }
    );

    if (response.statusCode === 200) {
      // 处理流式响应
      response.on("data", (chunk: any) => {
        const chunkStr = chunk.toString();
        const lines = chunkStr.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const dataPart = line.slice(5).trim();
            try {
              const jsonData = JSON.parse(dataPart);
              res.write(
                `data: ${JSON.stringify({
                  Content: jsonData?.output?.text,
                  IsDone: false,
                })}\n\n`
              );
              res.flush();
              console.log("Parsed data:", jsonData);
            } catch (parseError) {
              console.error("Error parsing JSON data:", parseError);
            }
          }
        }
      });

      response.on("end", () => {
        // 发送最终完整内容
        res.write(
          `data: ${JSON.stringify({ Content: "", IsDone: true })}\n\n `
        );
        res.end();
      });
    } else {
      console.log("Request failed:");
      //   if (response.data.request_id) {
      //     console.log(`request_id=${response.data.request_id}`);
      //   }
      //   console.log(`code=${response.status}`);
      //   if (response.data.message) {
      //     console.log(`message=${response.data.message}`);
      //   } else {
      //     console.log("message=Unknown error");
      //   }
    }
  } catch (error) {
    console.log("error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the answer." });
  }
}
