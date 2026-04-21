import { HighlightMap } from "@/constants/types";
import { splitIntoSentences } from "@/lib/markdown/sentence";
import React from "react";
import {
  GestureResponderEvent,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";

type MarkdownNode = {
  key?: string;
  attributes?: {
    href?: string;
    src?: string;
  };
};

type MarkdownRenderStyles = Record<string, any>;

type CounterKey = "h1" | "h2" | "h3" | "h4" | "p" | "li" | "blockquote";

function flattenText(value: React.ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(flattenText).join("");
  if (React.isValidElement(value)) {
    return flattenText(
      (value.props as { children?: React.ReactNode }).children,
    );
  }
  return "";
}

function normalizeHexColor(color: string) {
  const hex = color.replace("#", "").trim();
  if (hex.length === 3) {
    return hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  return hex.slice(0, 6);
}

function getContrastTextColor(backgroundColor: string) {
  const hex = normalizeHexColor(backgroundColor);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return "#111827";
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#111827" : "#F9FAFB";
}

function applyTextColorRecursively(
  node: React.ReactNode,
  textColor: string,
): React.ReactNode {
  if (node == null || typeof node === "boolean") return node;

  if (typeof node === "string" || typeof node === "number") {
    return <Text style={{ color: textColor }}>{node}</Text>;
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>
        {applyTextColorRecursively(child, textColor)}
      </React.Fragment>
    ));
  }

  if (!React.isValidElement(node)) return node;

  const element = node as React.ReactElement<{ style?: any; children?: React.ReactNode }>;
  const nextChildren = applyTextColorRecursively(element.props.children, textColor);
  const isTextElement = element.type === Text;

  return React.cloneElement(element, {
    ...(isTextElement
      ? {
          style: Array.isArray(element.props.style)
            ? [...element.props.style, { color: textColor }]
            : [element.props.style, { color: textColor }],
        }
      : null),
    children: nextChildren,
  });
}

export function createMarkdownRules(
  highlightMap: HighlightMap = {},
  handleLongPress: (id: string, e: GestureResponderEvent) => void,
  handleLongPressParagraph: (params: { id: string; text: string }) => void,
) {
  const counters: Record<CounterKey, number> = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    p: 0,
    li: 0,
    blockquote: 0,
  };

  const nextId = (tag: CounterKey) => {
    const id = `${tag}-${counters[tag]}`;
    counters[tag] += 1;
    return id;
  };

  const getHighlightStyle = (id: string) => {
    const color = highlightMap[id];
    if (!color) return null;

    return {
      backgroundColor: color,
      borderRadius: 8,
      color: getContrastTextColor(color),
    } as const;
  };

  return {
    heading1: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => {
      const id = nextId("h1");
      const highlightStyle = getHighlightStyle(id);
      const textColor = highlightStyle?.color;
      return (
        <Text
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.heading1, highlightStyle]}
        >
          {textColor ? applyTextColorRecursively(children, textColor) : children}
        </Text>
      );
    },

    heading2: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => {
      const id = nextId("h2");
      const highlightStyle = getHighlightStyle(id);
      const textColor = highlightStyle?.color;
      return (
        <Text
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.heading2, highlightStyle]}
        >
          {textColor ? applyTextColorRecursively(children, textColor) : children}
        </Text>
      );
    },

    heading3: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => {
      const id = nextId("h3");
      const highlightStyle = getHighlightStyle(id);
      const textColor = highlightStyle?.color;
      return (
        <Text
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.heading3, highlightStyle]}
        >
          {textColor ? applyTextColorRecursively(children, textColor) : children}
        </Text>
      );
    },

    heading4: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => {
      const id = nextId("h4");
      const highlightStyle = getHighlightStyle(id);
      const textColor = highlightStyle?.color;
      return (
        <Text
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.heading4, highlightStyle]}
        >
          {textColor ? applyTextColorRecursively(children, textColor) : children}
        </Text>
      );
    },

    paragraph: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => {
      const id = nextId("p");
      const rawText = flattenText(children).trim();
      const paragraphColor = highlightMap[id];
      const sentences = splitIntoSentences(rawText);

      return (
        <Pressable
          key={node.key}
          delayLongPress={220}
          onLongPress={() => {
            if (rawText) handleLongPressParagraph({ id, text: rawText });
          }}
        >
          <View>
            {sentences.map((sentence, index) => {
              const sentenceId = `${id}:s-${index}`;
              const sentenceColor = highlightMap[sentenceId] || paragraphColor;
              return (
                <Text
                  key={sentenceId}
                  style={[
                    styles.paragraph,
                    { marginBottom: 4 },
                    sentenceColor
                      ? {
                          backgroundColor: sentenceColor,
                          borderRadius: 8,
                          color: getContrastTextColor(sentenceColor),
                        }
                      : null,
                  ]}
                >
                  {sentence}
                </Text>
              );
            })}
          </View>
        </Pressable>
      );
    },

    list_item: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => {
      const id = nextId("li");
      const highlightStyle = getHighlightStyle(id);
      const textColor = highlightStyle?.color;
      return (
        <Pressable
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.listItem, highlightStyle]}
        >
          <Text style={[styles.listItemBullet, textColor ? { color: textColor } : null]}>
            •{" "}
          </Text>
          <View style={styles.listItemContent}>
            {textColor ? applyTextColorRecursively(children, textColor) : children}
          </View>
        </Pressable>
      );
    },

    blockquote: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => {
      const id = nextId("blockquote");
      const highlightStyle = getHighlightStyle(id);
      const textColor = highlightStyle?.color;
      return (
        <Pressable
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.blockquote, highlightStyle]}
        >
          {textColor ? applyTextColorRecursively(children, textColor) : children}
        </Pressable>
      );
    },

    link: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => (
      <Text
        key={node.key}
        style={styles.link}
        onPress={() => {
          const href = node.attributes?.href;
          if (href) {
            Linking.openURL(href);
          }
        }}
      >
        {children}
      </Text>
    ),

    image: (
      node: MarkdownNode,
      _children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => (
      <Image
        key={node.key}
        source={{ uri: node.attributes?.src }}
        style={styles.image}
        resizeMode="cover"
      />
    ),

    hr: (
      node: MarkdownNode,
      _children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => <View key={node.key} style={styles.hr} />,
  };
}
