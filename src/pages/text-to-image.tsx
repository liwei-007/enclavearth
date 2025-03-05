import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
// import Image from "next/image";

const ImageSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/textToImage`, {
      method: "POST",
      body: JSON.stringify({
        input: {
          prompt: searchQuery,
        },
        parameters: {
          size: "1024*1024",
          n: 1,
        },
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const { result } = await response.json();
    setLoading(false);
    setImageUrl(result?.output?.results[0]?.url);
  };

  return (
    <div className="flex flex-col p-10 h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">文生图</h1>
      <form onSubmit={handleSubmit} className="flex space-x-4 mb-8">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="请输入图片描述"
        />
        <Button disabled={!searchQuery || loading} type="submit">
          {loading ? "生成中，请稍后..." : "提交"}
        </Button>
      </form>
      {/* 答案展示区域 */}
      {imageUrl && (
        <>
          <div className="bg-white p-6 rounded-md shadow-md mb-8 w-96 h-96 relative">
            {/* <Image src={imageUrl} fill objectFit="cover" alt="" /> */}
            <img src={imageUrl} alt="" />
          </div>
          <a
            href={imageUrl}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mt-4 flex justify-center w-20"
          >
            下载
          </a>
        </>
      )}
    </div>
  );
};

export default ImageSearch;
