export const cleanMarkdownContent = (text) => {
  if (!text) return '';
  
  let cleaned = text;
  
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
  
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '• ');
  cleaned = cleaned.replace(/^[-*+]\s+/gm, '• ');
  
  cleaned = cleaned.replace(/```[^`]*```/g, (match) => {
    return match.replace(/```[a-z]*\n?/, '').replace(/```$/, '');
  });
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  cleaned = cleaned.replace(/^>\s+(.+)$/gm, '$1');
  
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '[Image: $1]');
  
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  cleaned = cleaned.trim();
  
  return cleaned;
};

export const parseMarkdownToDocxElements = (text) => {
  if (!text) return [];
  
  const lines = text.split('\n');
  const elements = [];
  let currentParagraph = '';
  let inList = false;
  let listItems = [];
  
  const flushParagraph = () => {
    if (currentParagraph.trim()) {
      elements.push({
        type: 'paragraph',
        content: currentParagraph.trim()
      });
      currentParagraph = '';
    }
  };
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push({
        type: 'list',
        items: listItems
      });
      listItems = [];
      inList = false;
    }
  };
  
  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      elements.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2].trim()
      });
      return;
    }
    
    const listMatch = line.match(/^(?:\d+\.|-|\*|\+)\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      inList = true;
      listItems.push(listMatch[1].trim());
      return;
    }
    
    if (line.trim() === '') {
      flushParagraph();
      flushList();
      return;
    }
    
    if (inList) {
      flushList();
    }
    
    currentParagraph += (currentParagraph ? ' ' : '') + line.trim();
  });
  
  flushParagraph();
  flushList();
  
  return elements;
};

export const extractFormattedText = (text) => {
  if (!text) return { text: '', formatting: [] };
  
  const formatting = [];
  let cleanText = text;
  let offset = 0;
  
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    const start = match.index - offset;
    const end = start + match[1].length;
    formatting.push({ type: 'bold', start, end });
    offset += 4;
  }
  cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
  
  const italicRegex = /\*([^*]+)\*/g;
  offset = 0;
  while ((match = italicRegex.exec(cleanText)) !== null) {
    const start = match.index - offset;
    const end = start + match[1].length;
    formatting.push({ type: 'italic', start, end });
    offset += 2;
  }
  cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1');
  
  return { text: cleanText, formatting };
};