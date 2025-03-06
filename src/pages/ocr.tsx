import ReactMarkdown from "@/components/markdown/ReactMarkdown";
import FileUploadButton from "@/components/ui/upload";
import { fileToDataUrl } from "@/utils/fileToDataUrl";
import { SseClient, SseOptions } from "@/utils/sse";
import Image from "next/image";
import { useRef, useState } from "react";

const OCR: React.FC = () => {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleFileChange = async (file: any) => {
    if (file) {
      const base64 = await fileToDataUrl(file);
      setImageUrl(base64);
      setLoading(true);
      setMessage("");

      SseClientRef.sendMessage({
        model: "qwen-vl-ocr",
        input: [
          {
            type: "image_url",
            image_url: {
              url: base64,
            },
          },
        ],
      });
    } else {
      console.log("未选择文件");
    }
  };
  return (
    <>
      <FileUploadButton onFileChange={handleFileChange} />
      {imageUrl && (
        <div className="max-w-96">
          <Image
            src={imageUrl}
            alt="示例图片"
            width={384}
            height={720}
            className="w-full h-auto"
            objectFit="contain"
            sizes="100vw"
          />
        </div>
      )}

      {/* 答案展示区域 */}
      <div>
        {!message && loading && "生成中..."}
        {message && (
          <div className="bg-white p-6 rounded-md shadow-md mb-8">
            <ReactMarkdown content={message} />
          </div>
        )}
      </div>
    </>
  );
};

export default OCR;
