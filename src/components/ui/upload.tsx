import React, { useRef } from "react";
import { Button } from "./button";

const FileUploadButton = ({
  onFileChange,
}: {
  onFileChange: (file?: File) => void;
}) => {
  const fileInputRef = useRef<any>(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChangeEvent = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      console.log("所选文件:", file);
      // 触发传递进来的回调函数，并将文件信息作为参数传递
      if (typeof onFileChange === "function") {
        onFileChange(file);
      }
    } else {
      if (typeof onFileChange === "function") {
        onFileChange(undefined);
      }
    }
  };

  return (
    <div className="p-8">
      <div>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChangeEvent}
        />
        <Button id="uploadButton" onClick={handleButtonClick}>
          选择图片
        </Button>
      </div>
    </div>
  );
};

export default FileUploadButton;
