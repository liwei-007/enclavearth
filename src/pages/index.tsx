import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type ModelType } from "@/utils/api";
import ReactMarkdown from "@/components/markdown/ReactMarkdown";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SseClient, SseOptions } from "@/utils/sse";
import { NextSeo } from "next-seo";

const Home: NextPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [model, setModel] = useState<ModelType>("qwen-plus");

  const options: SseOptions = {
    url: "/api/answer",
    method: "POST",
    headers: {
      "Content-Type": "text/event-stream",
    },
    onMessage: (event) => {
      const { data } = event;
      try {
        const validData = JSON.parse(data);
        setMessage((prevAnswer) => prevAnswer + validData.Content);
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

  const handleFetchData = async () => {
    setLoading(true);
    setMessage("");

    SseClientRef.sendMessage({
      input: value,
      model,
    });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* 标题和模型选择区域 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">知识问答</h2>
        <div className="w-48">
          <Select
            onValueChange={(v: ModelType) => {
              setModel(v);
            }}
            defaultValue="qwen-plus"
          >
            <SelectTrigger>
              <SelectValue placeholder="模型选择" />
            </SelectTrigger>
            <SelectContent className="border border-gray-300 rounded-md shadow-lg">
              <SelectGroup>
                <SelectItem value="deepseek-chat">DeepSeek</SelectItem>
                <SelectItem value="qwen-plus">通义千问</SelectItem>
                <SelectItem value="hunyuan-turbo">混元</SelectItem>
                <SelectItem value="generalv3.5">星火</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 输入框和按钮区域 */}
      <div className="flex items-center space-x-4 mb-8">
        <form onSubmit={handleFetchData} className="flex-1 flex space-x-4">
          <Input
            onChange={(evt) => {
              setValue(evt.target?.value);
            }}
            placeholder="请输入问题"
          />
          <Button
            disabled={loading || !value}
            onClick={handleFetchData}
            type="submit"
          >
            {loading ? "生成中，请稍等。。。" : "获取答案"}
          </Button>
        </form>
      </div>

      {/* 答案展示区域 */}
      {message && (
        <div className="bg-white p-6 rounded-md shadow-md mb-8">
          <ReactMarkdown content={message} />
        </div>
      )}
      {/* 工具专区 */}
      <div className="bg-white p-6 rounded-md shadow-md mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">效率工具</h2>
        <nav>
          <ul className="flex flex-col md:flex-row gap-4">
            <li className="flex-1">
              <Link
                href="/qcode"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="block text-2xl mb-2">📖</span>
                二维码生成
              </Link>
            </li>
            <li className="flex-1">
              <Link
                href="/delivery"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="block text-2xl mb-2">📦</span>
                快递查询
              </Link>
            </li>
            <li className="flex-1">
              <Link
                href="/github"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="block text-2xl mb-2">🔍</span>
                GitHub关键词搜索
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* 图像专区 */}
      <div className="bg-white p-6 rounded-md shadow-md mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">图像生成</h2>
        <nav>
          <ul className="flex flex-col md:flex-row gap-4">
            <li className="flex-1">
              <Link
                href="/text-to-image"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="block text-2xl mb-2">🔧</span>
                文字生成图片
              </Link>
            </li>
            <li className="flex-1">
              <Link
                href="/placard"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="block text-2xl mb-2">🎬</span>
                海报生成
              </Link>
            </li>
            <li className="flex-1">
              <Link
                href="/ocr"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="block text-2xl mb-2">ocr</span>
                图像文字提取
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* 游戏专区 */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">游戏专区</h2>
        <nav>
          <ul className="flex flex-col md:flex-row gap-4">
            <li className="flex-1">
              <Link
                href="/ai-game"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <span className="block text-2xl mb-2">🌿</span>
                丛林探险
              </Link>
            </li>
            <li className="flex-1">
              <Link
                href="/game"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="block text-2xl mb-2">🐍</span>
                贪吃蛇
              </Link>
            </li>
            <li className="flex-1">
              <Link
                href="/gold-miner-game"
                className="block bg-white border border-gray-300 rounded-md py-4 px-6 text-center text-gray-700 hover:bg-amber-100 hover:text-amber-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <span className="block text-2xl mb-2">⚒️</span>
                黄金矿工
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <NextSeo title="HOME" description="this is a home page" />
    </div>
  );
};

export async function getServerSideProps() {
  try {
    return {
      props: {
        data: {},
      },
    };
  } catch (error) {
    console.error("接口请求出错:", error);
    return {
      props: {
        data: null,
      },
    };
  }
}

export default Home;
