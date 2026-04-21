import { HighlightMap } from "@/constants/types";
import { createMarkdownRules } from "@/lib/markdown/createMarkdownRules";
import { getMarkdownStyles } from "@/lib/markdown/markdownStyles";
import { useAppTheme } from "@/providers/ThemeProvider";
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
  const { theme } = useAppTheme();

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
  const markdownStyles = useMemo(() => getMarkdownStyles(theme), [theme]);

  return (
    <Markdown markdownit={markdownIt} rules={rules} style={markdownStyles}>
      {content}
    </Markdown>
  );
};

export default React.memo(MarkdownContent);
