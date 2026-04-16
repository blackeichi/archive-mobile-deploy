import { HighlightMap } from "@/constants/types";
import { createMarkdownRules } from "@/lib/markdown/createMarkdownRules";
import { markdownStyles } from "@/lib/markdown/markdownStyles";
import React, { useMemo } from "react";
import Markdown, { MarkdownIt } from "react-native-markdown-display";

type MarkdownContentProps = {
  content: string;
  highlightMap: HighlightMap;
  handleTap: (id: string, e: any) => void;
};

const MarkdownContent = ({
  content,
  highlightMap,
  handleTap,
}: MarkdownContentProps) => {
  const rules = useMemo(
    () => createMarkdownRules(highlightMap, handleTap),
    [highlightMap, handleTap],
  );

  const markdownIt = useMemo(() => MarkdownIt({ typographer: true }), []);

  return (
    <Markdown markdownit={markdownIt} rules={rules} style={markdownStyles}>
      {content}
    </Markdown>
  );
};

export default React.memo(MarkdownContent);
