import sanitizeHtml from "sanitize-html";

export function sanitizeArticleHtml(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [
      "a",
      "blockquote",
      "br",
      "code",
      "em",
      "h2",
      "h3",
      "h4",
      "hr",
      "li",
      "ol",
      "p",
      "pre",
      "strong",
      "ul",
    ],
    allowedAttributes: {
      a: ["href", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
  });
}
