/**
 * 通过 api 调用 - 流式
 */
import { APP_MODEL_CONFIGS, AppModelType } from "@/types/model";
import request from "@/utils/axios";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { input, model } = req.body;

  const apiKey = APP_MODEL_CONFIGS[model as AppModelType].apiKey;
  const baseURL = APP_MODEL_CONFIGS[model as AppModelType].baseURL;

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
  // 星火大模型需要传 model，其他的不需要传
  // input ｜ message 结构不一样
  try {
    const response = await request.post<any>(
      baseURL,
      {
        input,
        parameters: {
          incremental_output: "true", // 增量输出
        },
        // model,
        debug: {},
        // stream: true,
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
