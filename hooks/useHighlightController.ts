import { HighlightMap } from "@/constants/types";
import { useDoubleTap } from "@/hooks/useDoubleTap";
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
    position: { x: 0, y: 0 },
    elementId: null as string | null,
    hasHighlight: false,
  });

  const handleDoubleTap = useCallback(
    (id: string, e: GestureResponderEvent) => {
      const { pageY } = e.nativeEvent;

      setPopupState({
        isOpen: true,
        position: { x: 30, y: pageY + 4 },
        elementId: id,
        hasHighlight: !!highlightMap[id],
      });
    },
    [highlightMap],
  );

  const handleTap = useDoubleTap({
    onDoubleTap: handleDoubleTap,
  });

  const closePopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const selectColor = useCallback(
    (color: string) => {
      if (popupState.elementId && setHighLights) {
        setHighLights({
          ...highlightMap,
          [popupState.elementId]: color,
        });
        setIsChanged(true);
      }

      setPopupState((prev) => ({ ...prev, isOpen: false }));
    },
    [popupState.elementId, setHighLights, highlightMap, setIsChanged],
  );

  const removeHighlight = useCallback(() => {
    if (popupState.elementId && setHighLights) {
      const nextMap = { ...highlightMap };
      delete nextMap[popupState.elementId];
      setHighLights(nextMap);
      setIsChanged(true);
    }

    setPopupState((prev) => ({ ...prev, isOpen: false }));
  }, [popupState.elementId, setHighLights, highlightMap, setIsChanged]);

  return {
    popupState,
    handleTap,
    closePopup,
    selectColor,
    removeHighlight,
  };
}
