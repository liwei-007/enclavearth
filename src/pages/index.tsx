import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { ModelType } from "@/types/model";

const Home: NextPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [model, setModel] = useState<ModelType>("qwen-plus");

  const options: SseOptions = {
    url: "/api/stream/sdk",
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
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-white grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
      {/* 知识问答区域，占据较大空间 */}
      <div className="md:col-span-2 space-y-4 md:space-y-8">
        {/* 标题和模型选择区域 */}
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <h2 className="text-3xl font-bold text-cyan-400 mb-2 md:mb-0">
            知识问答
          </h2>
          <div>
            <Select
              onValueChange={(v: ModelType) => {
                setModel(v);
              }}
              defaultValue="qwen-plus"
            >
              <SelectTrigger className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                <SelectValue placeholder="模型选择" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                <SelectGroup>
                  <SelectItem
                    value="deepseek-chat"
                    className="px-3 py-2 hover:bg-cyan-700"
                  >
                    DeepSeek
                  </SelectItem>
                  <SelectItem
                    value="qwen-plus"
                    className="px-3 py-2 hover:bg-cyan-700"
                  >
                    通义千问
                  </SelectItem>
                  <SelectItem
                    value="hunyuan-turbo"
                    className="px-3 py-2 hover:bg-cyan-700"
                  >
                    混元
                  </SelectItem>
                  <SelectItem
                    value="generalv3.5"
                    className="px-3 py-2 hover:bg-cyan-700"
                  >
                    星火
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 输入框和按钮区域 */}
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-8">
          <form
            onSubmit={handleFetchData}
            className="flex-1 flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0"
          >
            <Input
              onChange={(evt) => {
                setValue(evt.target?.value);
              }}
              placeholder="请输入问题"
              className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
            />
            <Button
              disabled={loading || !value}
              onClick={handleFetchData}
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md"
            >
              {loading ? "生成中，请稍等。。。" : "获取答案"}
            </Button>
          </form>
        </div>

        {/* 答案展示区域 */}
        {message && (
          <div className="bg-gray-800 p-6 rounded-md shadow-md">
            <ReactMarkdown content={message} />
          </div>
        )}
      </div>

      {/* 工具、图像、游戏专区 */}
      <div className="md:col-span-2 space-y-4 md:space-y-8">
        {/* 工具专区 */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">效率工具</h2>
          <nav>
            <ul className="flex flex-col md:flex-row gap-4">
              <li className="flex-1">
                <Link
                  href="/qcode"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">📖</span>
                  二维码生成
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  href="/delivery"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">📦</span>
                  快递查询
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  href="/github"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">🔍</span>
                  GitHub关键词搜索
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        {/* 图像专区 */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">图像生成</h2>
          <nav>
            <ul className="flex flex-col md:flex-row gap-4">
              <li className="flex-1">
                <Link
                  href="/text-to-image"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">🔧</span>
                  文字生成图片
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  href="/placard"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">🎬</span>
                  海报生成
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  href="/ocr"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">ocr</span>
                  图像文字提取
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        {/* 游戏专区 */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">游戏专区</h2>
          <nav>
            <ul className="flex flex-col md:flex-row gap-4">
              <li className="flex-1">
                <Link
                  href="/ai-game"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">🌿</span>
                  丛林探险
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  href="/game"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">🐍</span>
                  贪吃蛇
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  href="/gold-miner-game"
                  className="block bg-gray-900 border border-gray-600 rounded-md py-3 px-4 md:py-4 md:px-6 text-center text-cyan-400 hover:bg-cyan-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  <span className="block text-2xl mb-2">⚒️</span>
                  黄金矿工
                </Link>
              </li>
            </ul>
          </nav>
        </div>
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
