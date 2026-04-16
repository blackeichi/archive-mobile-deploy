import { HighlightMap } from "@/constants/types";
import { useHighlightController } from "@/hooks/useHighlightController";
import React from "react";
import { View } from "react-native";
import { HighlighterPopup } from "./HighlighterPopup";
import MarkdownContent from "./MarkdownContent";

type Props = {
  content: string;
  highlightMap?: HighlightMap;
  setHighLights: (map: HighlightMap) => void;
  setIsChanged: (changed: boolean) => void;
};

function MarkdownViewer({
  content,
  highlightMap = {},
  setHighLights,
  setIsChanged,
}: Props) {
  const { popupState, handleTap, closePopup, selectColor, removeHighlight } =
    useHighlightController({
      highlightMap,
      setHighLights,
      setIsChanged,
    });

  return (
    <View style={{ flex: 1 }}>
      <MarkdownContent
        content={content}
        highlightMap={highlightMap}
        handleTap={handleTap}
      />

      <HighlighterPopup
        isOpen={popupState.isOpen}
        position={popupState.position}
        onClose={closePopup}
        onSelectColor={selectColor}
        onRemove={removeHighlight}
        hasHighlight={popupState.hasHighlight}
      />
    </View>
  );
}

export default React.memo(MarkdownViewer);
