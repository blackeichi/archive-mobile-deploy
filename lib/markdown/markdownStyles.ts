export const markdownStyles = {
  body: {
    color: "#111827",
    fontSize: 13,
    lineHeight: 22,
  },

  heading1: {
    fontSize: 22,
    lineHeight: 32,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 20,
    padding: 5,
  },

  heading2: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 10,
    padding: 5,
  },

  heading3: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    color: "#111827",
    marginBottom: 10,
    padding: 3,
  },

  heading4: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600" as const,
    color: "#111827",
    marginBottom: 8,
    padding: 3,
  },

  paragraph: {
    fontSize: 13,
    lineHeight: 22,
    color: "#374151",
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
    color: "#374151",
    padding: 3,
  },

  listItemContent: {
    flex: 1,
    padding: 3,
  },

  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#E5E7EB",
    padding: 3,
    paddingLeft: 12,
    marginBottom: 8,
  },

  link: {
    color: "#2563EB",
    textDecorationLine: "underline" as const,
    padding: 3,
  },

  image: {
    width: "100%" as const,
    height: 200,
    borderRadius: 12,
    marginVertical: 12,
    backgroundColor: "#F3F4F6",
  },

  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginVertical: 16,
  },
};
