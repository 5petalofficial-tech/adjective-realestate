// modules/blogs/helpers/readTime.helper.js

const WORDS_PER_MINUTE = 200;

const extractWordCount = (block) => {
  if (!block || !block.data) return 0;

  switch (block.type) {
    case "heading":
    case "paragraph":
    case "quote":
      return countWords(block.data.text);

    case "list":
      return (block.data.items || []).reduce((sum, item) => sum + countWords(item), 0);

    case "table":
      return (block.data.rows || [])
        .flat()
        .reduce((sum, cell) => sum + countWords(cell), 0);

    case "code":
      return Math.ceil(countWords(block.data.code) * 0.5);

    case "image":
    case "video":
      return 15;

    default:
      return 0;
  }
};

const countWords = (text = "") => {
  if (!text || typeof text !== "string") return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const calculateReadTime = (contentBlocks = []) => {
  if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) return 1;

  const totalWords = contentBlocks.reduce((sum, block) => sum + extractWordCount(block), 0);

  return Math.max(1, Math.ceil(totalWords / WORDS_PER_MINUTE));
};

module.exports = { calculateReadTime, countWords };
