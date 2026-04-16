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

function ScrollCodeBlock({
  children,
  style,
}: {
  children: React.ReactNode;
  style: any;
}) {
  return <View style={style}>{children}</View>;
}

function flattenText(value: React.ReactNode): string {
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (Array.isArray(value)) return value.map(flattenText).join("");
  if (React.isValidElement(value)) {
    return flattenText(
      (value.props as { children?: React.ReactNode }).children,
    );
  }
  return "";
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
      return (
        <Text
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.heading1, getHighlightStyle(id)]}
        >
          {children}
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
      return (
        <Text
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.heading2, getHighlightStyle(id)]}
        >
          {children}
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
      return (
        <Text
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.heading3, getHighlightStyle(id)]}
        >
          {children}
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
      return (
        <Text
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.heading4, getHighlightStyle(id)]}
        >
          {children}
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
      return (
        <Pressable
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.listItem, getHighlightStyle(id)]}
        >
          <Text style={styles.listItemBullet}>• </Text>
          <View style={styles.listItemContent}>{children}</View>
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
      return (
        <Pressable
          key={node.key}
          onLongPress={(e) => handleLongPress(id, e)}
          style={[styles.blockquote, getHighlightStyle(id)]}
        >
          {children}
        </Pressable>
      );
    },

    fence: (
      node: MarkdownNode & { content?: string },
      _children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => (
      <ScrollCodeBlock key={node.key} style={styles.code_block}>
        {node.content}
      </ScrollCodeBlock>
    ),

    code_block: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => (
      <ScrollCodeBlock key={node.key} style={styles.code_block}>
        {children}
      </ScrollCodeBlock>
    ),

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
