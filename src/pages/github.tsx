import ReactMarkdown from "@/components/markdown/ReactMarkdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";

import { SseClient, SseOptions } from "@/utils/sse";

const GitHubSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 配置 SSE 请求选项
  const options: SseOptions = {
    url: "/api/app",
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
    SseClientRef.sendMessage({
      input: {
        prompt: `以 markdown 列表带样式的形式输出 github 搜索列表 { keyword: ${searchQuery} }，只包含列表部分并且链接处加粗展示`,
      },
      model: "qwen-plus",
    });
  };

  return (
    <div className="flex flex-col p-10 h-screen">
      <form onSubmit={handleSubmit} className="flex space-x-4 mb-8">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="请输入关键词"
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

export default GitHubSearch;
