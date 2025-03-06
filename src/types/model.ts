export type ModelType =
  | "deepseek-chat"
  | "qwen-plus"
  | "qwen-vl-ocr"
  | "hunyuan-turbo"
  | "generalv3.5";

export type AppModelType = "qwen-plus" | "generalv3.5" | "wanx2.1-t2i-turbo";

type ModelConfig = {
  baseURL: string;
  apiKey: string;
};

export const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  "deepseek-chat": {
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_KEY!,
  },
  "qwen-plus": {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: process.env.NEXT_PUBLIC_QWEN_KEY!,
  },
  "qwen-vl-ocr": {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: process.env.NEXT_PUBLIC_QWEN_KEY!,
  },
  "hunyuan-turbo": {
    baseURL: "https://api.hunyuan.cloud.tencent.com/v1",
    apiKey: process.env.NEXT_PUBLIC_HUNYUAN_KEY!,
  },
  "generalv3.5": {
    baseURL: "https://spark-api-open.xf-yun.com/v1",
    apiKey: "tHozYLgAAJQHCAPtKYBB:ICpogzTzakfznfKdBNPz",
  },
};

export const APP_MODEL_CONFIGS: Record<AppModelType, ModelConfig> = {
  "qwen-plus": {
    baseURL:
      "https://dashscope.aliyuncs.com/api/v1/apps/d7045172f58049279283515fa53f98bd/completion",
    apiKey: process.env.NEXT_PUBLIC_QWEN_KEY!,
  },
  "generalv3.5": {
    baseURL: "https://spark-api-open.xf-yun.com/v1/chat/completions",
    apiKey: "tHozYLgAAJQHCAPtKYBB:ICpogzTzakfznfKdBNPz",
  },
  "wanx2.1-t2i-turbo": {
    baseURL:
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis",
    apiKey: process.env.NEXT_PUBLIC_QWEN_KEY!,
  },
};
