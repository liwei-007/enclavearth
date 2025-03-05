import request from "@/utils/axios";
let intervalId: NodeJS.Timeout;
const handler = async (
  req: { body: any; method: "POST" | "GET"; headers: any },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { result?: unknown; error?: string }): void; new (): any };
    };
  }
) => {
  if (req?.method == "POST") {
    try {
      const jsonData = JSON.parse(req?.body);

      try {
        // 发送初始的文本到图像合成请求
        const response = await request.post<{ output: { task_id: string } }>(
          "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis",
          {
            input: jsonData?.input,
            parameters: jsonData?.parameters ?? {},
            model: jsonData?.model ?? "wanx2.1-t2i-turbo",
          },
          {
            headers: {
              "X-DashScope-Async": "enable",
            },
          }
        );

        // 检查是否成功获取任务 ID
        if (response?.output?.task_id) {
          const taskId = response.output.task_id;

          // 轮询任务状态的函数
          const pollTaskStatus = () => {
            return new Promise((resolve, reject) => {
              intervalId = setInterval(async () => {
                try {
                  // 发送请求获取任务状态
                  const data = await request.get<{ output: any }>(
                    `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
                    {}
                  );
                  console.log("Task status poll:", data);

                  // 检查任务状态
                  if (data?.output?.task_status === "SUCCEEDED") {
                    clearInterval(intervalId);
                    resolve(data);
                  } else if (data?.output?.task_status === "FAILED") {
                    clearInterval(intervalId);
                    resolve(data);
                  }
                } catch (error) {
                  clearInterval(intervalId);
                  reject(error);
                }
              }, 3000); // 每 3 秒轮询一次，可以根据需要调整
            });
          };

          // 开始轮询任务状态
          const finalData = await pollTaskStatus();
          res.status(200).json({ result: finalData });
        } else {
          res.status(400).json({ error: "Failed to get task ID" });
        }
      } catch (error) {
        console.error("Error in handler:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } catch {}
  }
};

export default handler;
