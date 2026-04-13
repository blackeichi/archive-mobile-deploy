import { createMarkdownRules } from "@/lib/markdown/createMarkdownRules";
import { markdownStyles } from "@/lib/markdown/markdownStyles";
import type { HighlightMap } from "@/lib/markdown/types";
import React, { useMemo } from "react";
import Markdown, { MarkdownIt } from "react-native-markdown-display";

type Props = {
  content: string;
  highlightMap?: HighlightMap;
};

function MarkdownViewer({ content, highlightMap = {} }: Props) {
  const rules = useMemo(
    () => createMarkdownRules(highlightMap),
    [highlightMap],
  );

  return (
    <Markdown
      markdownit={MarkdownIt({ typographer: true })}
      rules={rules}
      style={markdownStyles}
    >
      {content}
    </Markdown>
  );
}

export default React.memo(MarkdownViewer);
