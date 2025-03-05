// const OSS = require("ali-oss");
import OSS from "ali-oss";

class AliOSSHelper {
  client: any;
  constructor() // endpoint: any,
  // bucket?: any
  {
    this.client = new OSS({
      // 从环境变量中获取AccessKey ID的值
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID ?? "",
      // 从环境变量中获取AccessKey Secret的值
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET ?? "",
      //   endpoint,
      bucket: "read-static-image",
    });
  }

  /**
   * 上传文件到 OSS
   * @param objectKey 上传到 OSS 后的文件名
   * @param localFilePath 本地文件的路径或文件对象
   * @returns {Promise<OSS.PutObjectResult>} 上传结果
   */
  async uploadFile(objectKey: any, localFilePath: any) {
    try {
      const result = await this.client.put(objectKey, localFilePath, {
        meta: { temp: "demo" },
        mime: "json",
        headers: { "Content-Type": "text/plain" },
      });
      console.log("文件上传成功:", result);
      return result;
    } catch (error) {
      console.error("文件上传失败:", error);
      throw error;
    }
  }
}
export default AliOSSHelper;
