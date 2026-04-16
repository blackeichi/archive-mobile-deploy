import { HighlightMap } from "@/constants/types";
import React from "react";
import { Image, Linking, Text, View } from "react-native";

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

export function createMarkdownRules(highlightMap: HighlightMap = {}) {
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
      paddingHorizontal: 4,
      paddingVertical: 2,
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
        <Text key={node.key} style={[styles.heading1, getHighlightStyle(id)]}>
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
        <Text key={node.key} style={[styles.heading2, getHighlightStyle(id)]}>
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
        <Text key={node.key} style={[styles.heading3, getHighlightStyle(id)]}>
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
        <Text key={node.key} style={[styles.heading4, getHighlightStyle(id)]}>
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
      return (
        <Text key={node.key} style={[styles.paragraph, getHighlightStyle(id)]}>
          {children}
        </Text>
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
        <View key={node.key} style={[styles.listItem, getHighlightStyle(id)]}>
          <Text style={styles.listItemBullet}>• </Text>
          <View style={styles.listItemContent}>{children}</View>
        </View>
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
        <View key={node.key} style={[styles.blockquote, getHighlightStyle(id)]}>
          {children}
        </View>
      );
    },

    code_inline: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => (
      <Text key={node.key} style={styles.codeInline}>
        {children}
      </Text>
    ),

    fence: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => (
      <ScrollCodeBlock key={node.key} style={styles.codeBlock}>
        {children}
      </ScrollCodeBlock>
    ),

    code_block: (
      node: MarkdownNode,
      children: React.ReactNode,
      _parent: unknown,
      styles: MarkdownRenderStyles,
    ) => (
      <ScrollCodeBlock key={node.key} style={styles.codeBlock}>
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
