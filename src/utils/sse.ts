import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

export interface SseOptions {
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  onMessage: (event: EventSourceMessage) => void;
  onError?: (error: Error) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export class SseClient {
  private controller: AbortController | null = null;
  private options: SseOptions;

  constructor(options: SseOptions) {
    this.options = {
      method: "GET",
      ...options,
    };
    // 不在构造函数中直接调用 connect 方法
  }

  // 发起 SSE 请求
  public sendMessage(params: Record<string, string | number | object>) {
    const {
      url,
      method,
      headers = {},
      onMessage,
      onError,
      onOpen,
      onClose,
    } = this.options;

    let fullUrl = url;
    let body: string | undefined;

    if (method === "GET") {
      const queryString = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");
      fullUrl = queryString ? `${url}?${queryString}` : url;
    } else if (method === "POST") {
      body = JSON.stringify(params);
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    this.controller = new AbortController();
    const signal = this.controller.signal;

    fetchEventSource(fullUrl, {
      method,
      headers: { ...headers },
      body,
      signal,
      onopen: (): any => {
        if (onOpen) onOpen();
      },
      onmessage: onMessage,
      onerror: (error) => {
        if (this.controller?.signal.aborted) return;
        if (onError) onError(error);
        this.disconnect();
        throw error;
      },
      onclose: () => {
        this.disconnect();
        if (onClose) onClose();
      },
    });
  }

  // 断开 SSE 连接
  public disconnect() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}
