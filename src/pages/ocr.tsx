import ReactMarkdown from "@/components/markdown/ReactMarkdown";
import FileUploadButton from "@/components/ui/upload";
import { getAnswerContent } from "@/utils/api";
import { fileToDataUrl } from "@/utils/fileToDataUrl";
import Image from "next/image";
import { useState } from "react";

const OCR: React.FC = () => {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const onMessageChunk = (chunk: string) => {
    setMessage((prevAnswer) => prevAnswer + chunk);
  };
  const handleFileChange = async (file: any) => {
    if (file) {
      const base64 = await fileToDataUrl(file);
      setImageUrl(base64);
      setLoading(true);
      setMessage("");
      try {
        await getAnswerContent({
          input: [
            {
              type: "image_url",
              image_url: {
                url: base64,
              },
            },
          ],
          model: "qwen-vl-ocr",
          onMessageChunk,
        });
      } finally {
        setLoading(false);
      }
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
