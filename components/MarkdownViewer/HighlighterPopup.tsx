import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

const COLORS = [
  { name: "노랑", value: "#fde047" },
  { name: "주황", value: "#fdba74" },
  { name: "초록", value: "#86efac" },
  { name: "파랑", value: "#93c5fd" },
  { name: "분홍", value: "#f9a8d4" },
  { name: "보라", value: "#c4b5fd" },
];

type Position = {
  x: number;
  y: number;
};

type Props = {
  isOpen: boolean;
  position: Position;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  onRemove: () => void;
  onRemoveSentences: () => void;
  hasHighlight: boolean;
  hasChildHighlights: boolean;
};

export function HighlighterPopup({
  isOpen,
  position,
  onClose,
  onSelectColor,
  onRemove,
  onRemoveSentences,
  hasHighlight,
  hasChildHighlights,
}: Props) {
  if (!isOpen) return null;

  const showColorPicker = !hasHighlight && !hasChildHighlights;

  return (
    <Modal visible={isOpen} transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.popup,
            {
              left: position.x,
              top: position.y,
            },
          ]}
          onPress={() => {}}
        >
          {showColorPicker ? (
            <View style={styles.content}>
              <Text style={styles.label}>문단 하이라이트 색상</Text>
              <View style={styles.colorRow}>
                {COLORS.map((color) => (
                  <Pressable
                    key={color.value}
                    onPress={() => onSelectColor(color.value)}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color.value },
                    ]}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.actionGroup}>
              {hasHighlight ? (
                <Pressable style={styles.removeButton} onPress={onRemove}>
                  <Text style={styles.removeButtonText}>문단 하이라이트 지우기</Text>
                </Pressable>
              ) : null}

              {hasChildHighlights ? (
                <Pressable style={styles.removeSentenceButton} onPress={onRemoveSentences}>
                  <Text style={styles.removeSentenceButtonText}>
                    이 문단의 문장 하이라이트 모두 지우기
                  </Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  popup: {
    position: "absolute",
    zIndex: 50,
    backgroundColor: "#404040",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    maxWidth: 280,
  },
  content: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#d4d4d4",
    marginBottom: 4,
  },
  colorRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#525252",
  },
  actionGroup: {
    gap: 8,
  },
  removeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fca5a5",
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  removeSentenceButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fed7aa",
    borderRadius: 8,
  },
  removeSentenceButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7c2d12",
  },
});
