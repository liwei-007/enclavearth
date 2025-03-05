export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // 监听文件读取完成事件
    reader.onload = () => {
      if (reader.result) {
        const base64 = reader.result.toString();
        resolve(base64);
      } else {
        reject(new Error("文件读取结果为空"));
      }
    };

    // 监听文件读取错误事件
    reader.onerror = () => {
      reject(new Error("文件读取过程中发生错误"));
    };

    // 开始以 DataURL 格式读取文件
    reader.readAsDataURL(file);
  });
}
