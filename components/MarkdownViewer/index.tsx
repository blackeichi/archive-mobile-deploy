import { HighlightMap } from "@/constants/types";
import { useHighlightController } from "@/hooks/useHighlightController";
import {
  getSentenceHighlightKeys,
  removeParagraphSentenceHighlights,
  splitIntoSentences,
} from "@/lib/markdown/sentence";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { HighlighterPopup } from "./HighlighterPopup";
import MarkdownContent from "./MarkdownContent";
import { SentencePickerModal } from "./SentencePickerModal";

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
  const {
    popupState,
    handleLongPress,
    closePopup,
    selectColor,
    removeHighlight,
    removeSentenceHighlights,
  } = useHighlightController({
    highlightMap,
    setHighLights,
    setIsChanged,
  });
  const [sentenceMode, setSentenceMode] = useState<{
    visible: boolean;
    paragraphId: string | null;
    text: string;
    activeColor: string;
  }>({
    visible: false,
    paragraphId: null,
    text: "",
    activeColor: "#fde047",
  });

  const openSentencePicker = ({ id, text }: { id: string; text: string }) => {
    const sentanceKey = Object.keys(highlightMap).findIndex((key) =>
      key.startsWith(`${id}:s-`),
    );
    setSentenceMode({
      visible: true,
      paragraphId: id,
      text,
      activeColor: highlightMap[sentanceKey] || "#fde047",
    });
  };

  const closeSentencePicker = () => {
    setSentenceMode((prev) => ({
      ...prev,
      visible: false,
      paragraphId: null,
      text: "",
    }));
  };

  const sentences = useMemo(
    () => splitIntoSentences(sentenceMode.text),
    [sentenceMode.text],
  );

  const highlightedSentenceIndexes = useMemo(() => {
    if (!sentenceMode.paragraphId) return [];

    return getSentenceHighlightKeys(highlightMap, sentenceMode.paragraphId).map(
      (key) => Number(key.split(":s-")[1] ?? -1),
    );
  }, [highlightMap, sentenceMode.paragraphId]);

  const handleSelectSentenceColor = (color: string) => {
    if (!sentenceMode.paragraphId) {
      setSentenceMode((prev) => ({ ...prev, activeColor: color }));
      return;
    }

    const nextMap = { ...highlightMap };
    const keys = getSentenceHighlightKeys(nextMap, sentenceMode.paragraphId);

    keys.forEach((key) => {
      nextMap[key] = color;
    });

    delete nextMap[sentenceMode.paragraphId];

    setHighLights(nextMap);
    setIsChanged(true);
    setSentenceMode((prev) => ({ ...prev, activeColor: color }));
  };

  const handleClearSentenceHighlights = () => {
    if (!sentenceMode.paragraphId) return;

    const nextMap = removeParagraphSentenceHighlights(
      highlightMap,
      sentenceMode.paragraphId,
    );
    setHighLights(nextMap);
    setIsChanged(true);
    closeSentencePicker();
  };

  return (
    <View style={{ flex: 1 }}>
      <MarkdownContent
        content={content}
        highlightMap={highlightMap}
        handleLongPress={handleLongPress}
        handleLongPressParagraph={openSentencePicker}
      />

      <HighlighterPopup
        isOpen={popupState.isOpen}
        position={popupState.position}
        onClose={closePopup}
        onSelectColor={selectColor}
        onRemove={removeHighlight}
        onRemoveSentences={removeSentenceHighlights}
        hasHighlight={popupState.hasHighlight}
        hasChildHighlights={popupState.hasChildHighlights}
      />

      <SentencePickerModal
        highlightMap={highlightMap}
        setHighLights={setHighLights}
        setIsChanged={setIsChanged}
        visible={sentenceMode.visible}
        sentences={sentences}
        paragraphId={sentenceMode.paragraphId as string}
        activeColor={sentenceMode.activeColor}
        highlightedSentenceIndexes={highlightedSentenceIndexes}
        onClose={closeSentencePicker}
        onSelectColor={handleSelectSentenceColor}
        onClearAll={handleClearSentenceHighlights}
      />
    </View>
  );
}

export default React.memo(MarkdownViewer);
