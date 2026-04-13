export const markdownStyles = {
  body: {
    color: "#111827",
    fontSize: 14,
    lineHeight: 22,
  },

  heading1: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700" as const,
    color: "#111827",
    marginTop: 24,
    marginBottom: 16,
  },

  heading2: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700" as const,
    color: "#111827",
    marginTop: 20,
    marginBottom: 12,
  },

  heading3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
    color: "#111827",
    marginTop: 16,
    marginBottom: 10,
  },

  heading4: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    color: "#111827",
    marginTop: 14,
    marginBottom: 8,
  },

  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 12,
  },

  bullet_list: {
    marginBottom: 12,
  },

  ordered_list: {
    marginBottom: 12,
  },

  listItem: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    marginBottom: 8,
  },

  listItemBullet: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },

  listItemContent: {
    flex: 1,
  },

  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#E5E7EB",
    paddingLeft: 12,
    marginBottom: 12,
  },

  codeInline: {
    backgroundColor: "#F3F4F6",
    color: "#111827",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 13,
  },

  codeBlock: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  link: {
    color: "#2563EB",
    textDecorationLine: "underline" as const,
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
