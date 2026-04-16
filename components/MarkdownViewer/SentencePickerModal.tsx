import { HighlightMap } from "@/constants/types";
import { buildSentenceId } from "@/lib/markdown/sentence";
import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = [
  { name: "노랑", value: "#fde047" },
  { name: "주황", value: "#fdba74" },
  { name: "초록", value: "#86efac" },
  { name: "파랑", value: "#93c5fd" },
  { name: "분홍", value: "#f9a8d4" },
  { name: "보라", value: "#c4b5fd" },
];

type Props = {
  highlightMap: HighlightMap;
  setHighLights: (map: HighlightMap) => void;
  setIsChanged: (changed: boolean) => void;
  visible: boolean;
  sentences: string[];
  paragraphId: string;
  activeColor: string;
  highlightedSentenceIndexes: number[];
  onClose: () => void;
  onSelectColor: (color: string) => void;
  onClearAll: () => void;
};

export function SentencePickerModal({
  highlightMap,
  setHighLights,
  setIsChanged,
  visible,
  sentences,
  paragraphId,
  activeColor,
  highlightedSentenceIndexes,
  onClose,
  onSelectColor,
  onClearAll,
}: Props) {
  const [colorState, setColorState] = useState(activeColor);
  const [highlightedSet, setHighlightedSet] = useState(
    new Set(highlightedSentenceIndexes),
  );
  const onSave = useCallback(() => {
    onSelectColor(colorState);
    const nextMap = { ...highlightMap };
    sentences.forEach((_, index) => {
      const sentenceId = buildSentenceId(paragraphId, index);
      if (highlightedSet.has(index)) {
        nextMap[sentenceId] = colorState;
      } else {
        delete nextMap[sentenceId];
      }

      setHighLights(nextMap);
      setIsChanged(true);
      onClose();
    });
  }, [
    colorState,
    onSelectColor,
    highlightMap,
    sentences,
    paragraphId,
    highlightedSet,
    setHighLights,
    setIsChanged,
    onClose,
  ]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>문장 하이라이트</Text>
              <Text style={styles.description}>
                색상을 고른 뒤 문장을 눌러 추가하거나 해제하세요.
              </Text>
            </View>
            <Pressable style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>저장</Text>
            </Pressable>
          </View>

          <View style={styles.paletteRow}>
            {COLORS.map((color) => {
              const isActive = colorState === color.value;
              return (
                <Pressable
                  key={color.value}
                  accessibilityRole="button"
                  onPress={() => setColorState(color.value)}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color.value },
                    isActive ? styles.colorButtonActive : null,
                  ]}
                />
              );
            })}
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
          >
            {sentences.map((sentence, index) => {
              const isHighlighted = highlightedSet.has(index);
              return (
                <Pressable
                  key={`sentence-${index}`}
                  onPress={() =>
                    setHighlightedSet((prev) => {
                      const next = new Set(prev);
                      if (next.has(index)) {
                        next.delete(index);
                      } else {
                        next.add(index);
                      }
                      return next;
                    })
                  }
                  style={[
                    styles.sentenceCard,
                    isHighlighted
                      ? {
                          backgroundColor: colorState,
                          borderColor: colorState,
                        }
                      : null,
                  ]}
                >
                  <View style={styles.sentenceHeader}>
                    <Text style={styles.sentenceIndex}>문장 {index + 1}</Text>
                    <Text style={styles.sentenceAction}>
                      {isHighlighted ? "다시 누르면 해제" : "눌러서 추가"}
                    </Text>
                  </View>
                  <Text style={styles.sentenceText}>{sentence}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.clearButton} onPress={onClearAll}>
              <Text style={styles.clearButtonText}>
                이 문단 문장 하이라이트 모두 지우기
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "78%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: "#6b7280",
  },
  saveButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#2563eb",
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },
  paletteRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  colorButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorButtonActive: {
    borderColor: "#111827",
  },
  list: {
    maxHeight: 420,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  sentenceCard: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 12,
  },
  sentenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  sentenceIndex: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  sentenceAction: {
    fontSize: 12,
    color: "#6b7280",
  },
  sentenceText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#1f2937",
  },
  footer: {
    marginTop: 14,
  },
  clearButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#991b1b",
  },
});
