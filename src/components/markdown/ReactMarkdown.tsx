import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

const MarkdownComponent = ({
  content = ' "# 标题\n这是一段Markdown文本。"',
}: Props) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownComponent;
