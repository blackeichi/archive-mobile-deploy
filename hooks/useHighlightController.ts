import { HighlightMap } from "@/constants/types";
import { removeParagraphSentenceHighlights } from "@/lib/markdown/sentence";
import { useCallback, useState } from "react";
import { GestureResponderEvent } from "react-native";

type UseHighlightControllerParams = {
  highlightMap: HighlightMap;
  setHighLights: (map: HighlightMap) => void;
  setIsChanged: (changed: boolean) => void;
};

export function useHighlightController({
  highlightMap,
  setHighLights,
  setIsChanged,
}: UseHighlightControllerParams) {
  const [popupState, setPopupState] = useState({
    isOpen: false,
    position: { x: 30, y: 0 },
    elementId: null as string | null,
    hasHighlight: false,
    hasChildHighlights: false,
  });

  const handleLongPress = useCallback(
    (id: string, e: GestureResponderEvent) => {
      const { pageY } = e.nativeEvent;
      const hasChildHighlights = Object.keys(highlightMap).some((key) =>
        key.startsWith(`${id}:s-`),
      );

      setPopupState({
        isOpen: true,
        position: { x: 30, y: pageY + 4 },
        elementId: id,
        hasHighlight: !!highlightMap[id],
        hasChildHighlights,
      });
    },
    [highlightMap],
  );

  const closePopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const selectColor = useCallback(
    (color: string) => {
      if (popupState.elementId) {
        const clearedChildren = removeParagraphSentenceHighlights(
          highlightMap,
          popupState.elementId,
        );

        setHighLights({
          ...clearedChildren,
          [popupState.elementId]: color,
        });
        setIsChanged(true);
      }

      setPopupState((prev) => ({ ...prev, isOpen: false }));
    },
    [popupState.elementId, setHighLights, highlightMap, setIsChanged],
  );

  const removeHighlight = useCallback(() => {
    if (popupState.elementId) {
      const nextMap = { ...highlightMap };
      delete nextMap[popupState.elementId];
      setHighLights(nextMap);
      setIsChanged(true);
    }

    setPopupState((prev) => ({ ...prev, isOpen: false }));
  }, [popupState.elementId, setHighLights, highlightMap, setIsChanged]);

  const removeSentenceHighlights = useCallback(() => {
    if (popupState.elementId) {
      const nextMap = removeParagraphSentenceHighlights(
        highlightMap,
        popupState.elementId,
      );
      setHighLights(nextMap);
      setIsChanged(true);
    }

    setPopupState((prev) => ({ ...prev, isOpen: false }));
  }, [popupState.elementId, setHighLights, highlightMap, setIsChanged]);

  return {
    popupState,
    handleLongPress,
    closePopup,
    selectColor,
    removeHighlight,
    removeSentenceHighlights,
  };
}
