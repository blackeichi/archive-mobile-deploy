import type { AppTheme } from "@/constants/theme";

export function getMarkdownStyles(theme: AppTheme) {
  return {
    body: {
      color: theme.colors.text,
      fontSize: 13,
      lineHeight: 22,
    },

    heading1: {
      fontSize: 22,
      lineHeight: 32,
      fontWeight: "700" as const,
      color: theme.colors.text,
      marginBottom: 20,
      padding: 5,
    },

    heading2: {
      fontSize: 19,
      lineHeight: 28,
      fontWeight: "700" as const,
      color: theme.colors.text,
      marginBottom: 10,
      padding: 5,
    },

    heading3: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "600" as const,
      color: theme.colors.text,
      marginBottom: 10,
      padding: 3,
    },

    heading4: {
      fontSize: 14,
      lineHeight: 22,
      fontWeight: "600" as const,
      color: theme.colors.text,
      marginBottom: 8,
      padding: 3,
    },

    paragraph: {
      fontSize: 13,
      lineHeight: 22,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      padding: 3,
    },

    bullet_list: {
      marginBottom: 8,
      padding: 3,
    },

    ordered_list: {
      marginBottom: 8,
      padding: 3,
    },

    listItem: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      marginBottom: 8,
      padding: 3,
    },

    listItemBullet: {
      fontSize: 13,
      lineHeight: 22,
      color: theme.colors.textSecondary,
      padding: 3,
    },

    listItemContent: {
      flex: 1,
      padding: 3,
    },

    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.border,
      padding: 3,
      paddingLeft: 12,
      marginBottom: 8,
      backgroundColor: theme.colors.surfaceSecondary,
    },

    code_inline: {
      fontFamily: "monospace",
      backgroundColor: theme.colors.surfaceSecondary,
    },

    code_block: {
      fontFamily: "monospace",
      backgroundColor: theme.colors.surfaceSecondary,
      padding: 8,
      borderRadius: 8,
      marginVertical: 12,
    },

    fence: {
      fontFamily: "monospace",
      backgroundColor: theme.colors.surfaceSecondary,
      padding: 8,
      borderRadius: 8,
      marginVertical: 12,
    },

    link: {
      color: theme.mode === "dark" ? "#93C5FD" : "#2563EB",
      textDecorationLine: "underline" as const,
      padding: 3,
    },

    image: {
      width: "100%" as const,
      height: 200,
      borderRadius: 12,
      marginVertical: 12,
      backgroundColor: theme.colors.surfaceSecondary,
    },

    hr: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginVertical: 16,
    },
  };
}
