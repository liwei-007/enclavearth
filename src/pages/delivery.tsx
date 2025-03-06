import ReactMarkdown from "@/components/markdown/ReactMarkdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import ga from "react-ga4";

import { SseClient, SseOptions } from "@/utils/sse";

const ImageSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 配置 SSE 请求选项
  const options: SseOptions = {
    url: "/api/stream/api",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    onMessage: (event) => {
      const { data } = event;
      try {
        const validData = JSON.parse(data);
        setMessage((preMessage) => preMessage + validData?.Content);
        if (validData?.IsDone) {
          setLoading(false);
        }
        console.log("Received message:", JSON.parse(data));
      } catch {}
    },
    onError: (error) => {
      console.error("SSE error:", error);
    },
    onOpen: () => {
      console.log("SSE connection opened");
    },
    onClose: () => {
      console.log("SSE connection closed");
    },
  };

  const SseClientRef = useRef(new SseClient(options)).current;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    ga.event({
      category: "submit-button", // 事件类别
      action: "click", // 用户执行的动作
      label: "click delivery", // 关于事件的额外信息
      value: 1, // 一个数值，通常用于量化事件
    });

    SseClientRef.sendMessage({
      input: {
        prompt: `查询完整的物流信息 ${searchQuery}，只返回物流详情`,
      },
      model: "qwen-plus",
    });
  };

  return (
    <div className="flex flex-col p-10 h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">快递查询</h1>
      <form onSubmit={handleSubmit} className="flex space-x-4 mb-8">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="请输入快递单号"
        />
        <Button disabled={!searchQuery || loading} type="submit">
          {loading ? "查询中，请稍后..." : "提交"}
        </Button>
      </form>
      {/* 答案展示区域 */}
      {message && (
        <div className="bg-white p-6 rounded-md shadow-md mb-8">
          <ReactMarkdown content={message} />
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
