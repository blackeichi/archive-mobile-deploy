import { HighlightMap } from "@/constants/types";
import { createMarkdownRules } from "@/lib/markdown/createMarkdownRules";
import { markdownStyles } from "@/lib/markdown/markdownStyles";
import React, { useMemo } from "react";
import Markdown, { MarkdownIt } from "react-native-markdown-display";

type MarkdownContentProps = {
  content: string;
  highlightMap: HighlightMap;
  handleLongPress: (id: string, e: any) => void;
  handleLongPressParagraph: (params: { id: string; text: string }) => void;
};

const MarkdownContent = ({
  content,
  highlightMap,
  handleLongPress,
  handleLongPressParagraph,
}: MarkdownContentProps) => {
  const rules = useMemo(
    () =>
      createMarkdownRules(
        highlightMap,
        handleLongPress,
        handleLongPressParagraph,
      ),
    [highlightMap, handleLongPress, handleLongPressParagraph],
  );

  const markdownIt = useMemo(() => MarkdownIt({ typographer: true }), []);

  return (
    <Markdown markdownit={markdownIt} rules={rules} style={markdownStyles}>
      {content}
    </Markdown>
  );
};

export default React.memo(MarkdownContent);
