import { useCallback, useRef } from "react";
import { GestureResponderEvent } from "react-native";

type UseDoubleTapOptions = {
  delay?: number;
  onDoubleTap: (id: string, e: GestureResponderEvent) => void;
  //   onSingleTap?: () => void;
};

export function useDoubleTap({
  delay = 300,
  onDoubleTap,
  //   onSingleTap,
}: UseDoubleTapOptions) {
  const lastTapRef = useRef(0);
  const singleTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleTap = useCallback(
    (id: string, e: GestureResponderEvent) => {
      const now = Date.now();

      if (now - lastTapRef.current < delay) {
        if (singleTapTimeoutRef.current) {
          clearTimeout(singleTapTimeoutRef.current);
          singleTapTimeoutRef.current = null;
        }

        onDoubleTap(id, e);
      }
      /* else {
      if (onSingleTap) {
        singleTapTimeoutRef.current = setTimeout(() => {
          onSingleTap();
          singleTapTimeoutRef.current = null;
        }, delay);
      }
    } */

      lastTapRef.current = now;
    },
    [delay, onDoubleTap /* onSingleTap */],
  );

  return handleTap;
}
