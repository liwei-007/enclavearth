import ReactMarkdown from "@/components/markdown/ReactMarkdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import request from "@/utils/axios";
import React, { useState } from "react";

const ImageSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await request.post<{ output: { text: string } }>("/", {
      input: {
        prompt: `生成二维码 ${searchQuery}，只返回图片地址，不需要其他文字`,
      },
      parameters: {},
    });
    setLoading(false);
    setMessage(response?.output?.text);
  };

  return (
    <div className="flex flex-col p-10 h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">二维码生成</h1>
      <form onSubmit={handleSubmit} className="flex space-x-4 mb-8">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="请输入 URL"
        />
        <Button disabled={!searchQuery || loading} type="submit">
          {loading ? "生成中，请稍后..." : "提交"}
        </Button>
      </form>
      {/* 答案展示区域 */}
      {message && (
        <div className="bg-white p-6 rounded-md shadow-md mb-8 max-w-96">
          <ReactMarkdown content={message} />
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
