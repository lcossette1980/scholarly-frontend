import { cleanMarkdownContent, parseMarkdownToDocxElements } from '../markdownCleaner';

describe('Markdown Cleaner', () => {
  describe('cleanMarkdownContent', () => {
    it('should remove bold markdown', () => {
      expect(cleanMarkdownContent('**bold text**')).toBe('bold text');
      expect(cleanMarkdownContent('__bold text__')).toBe('bold text');
    });

    it('should remove italic markdown', () => {
      expect(cleanMarkdownContent('*italic text*')).toBe('italic text');
      expect(cleanMarkdownContent('_italic text_')).toBe('italic text');
    });

    it('should remove headers', () => {
      expect(cleanMarkdownContent('# Header 1')).toBe('Header 1');
      expect(cleanMarkdownContent('## Header 2')).toBe('Header 2');
      expect(cleanMarkdownContent('### Header 3')).toBe('Header 3');
    });

    it('should convert ordered lists to bullet points', () => {
      expect(cleanMarkdownContent('1. First item')).toBe('• First item');
      expect(cleanMarkdownContent('2. Second item')).toBe('• Second item');
    });

    it('should handle unordered lists', () => {
      expect(cleanMarkdownContent('- List item')).toBe('• List item');
      expect(cleanMarkdownContent('* List item')).toBe('• List item');
      expect(cleanMarkdownContent('+ List item')).toBe('• List item');
    });

    it('should remove code blocks', () => {
      expect(cleanMarkdownContent('```javascript\nconst x = 1;\n```')).toBe('const x = 1;');
      expect(cleanMarkdownContent('`inline code`')).toBe('inline code');
    });

    it('should remove links but keep text', () => {
      expect(cleanMarkdownContent('[link text](https://example.com)')).toBe('link text');
    });

    it('should handle complex markdown', () => {
      const input = `# Research Overview

**Key Findings:**
1. The study demonstrates *significant* improvements
2. Results show a **75%** increase in efficiency

## Methodology
The research used \`quantitative analysis\` with the following approach:
- Random sampling
- Control groups
- Statistical validation

### Conclusion
[Previous research](https://example.com) supports these findings.`;

      const expected = `Research Overview

Key Findings:
• The study demonstrates significant improvements
• Results show a 75% increase in efficiency

Methodology
The research used quantitative analysis with the following approach:
• Random sampling
• Control groups
• Statistical validation

Conclusion
Previous research supports these findings.`;

      expect(cleanMarkdownContent(input)).toBe(expected);
    });
  });

  describe('parseMarkdownToDocxElements', () => {
    it('should parse paragraphs', () => {
      const elements = parseMarkdownToDocxElements('This is a paragraph.');
      expect(elements).toHaveLength(1);
      expect(elements[0]).toEqual({
        type: 'paragraph',
        content: 'This is a paragraph.'
      });
    });

    it('should parse headings', () => {
      const elements = parseMarkdownToDocxElements('# Heading 1\n## Heading 2');
      expect(elements).toHaveLength(2);
      expect(elements[0]).toEqual({
        type: 'heading',
        level: 1,
        content: 'Heading 1'
      });
      expect(elements[1]).toEqual({
        type: 'heading',
        level: 2,
        content: 'Heading 2'
      });
    });

    it('should parse lists', () => {
      const elements = parseMarkdownToDocxElements('- Item 1\n- Item 2\n- Item 3');
      expect(elements).toHaveLength(1);
      expect(elements[0]).toEqual({
        type: 'list',
        items: ['Item 1', 'Item 2', 'Item 3']
      });
    });

    it('should handle mixed content', () => {
      const input = `# Title
This is a paragraph.

- List item 1
- List item 2

Another paragraph.`;

      const elements = parseMarkdownToDocxElements(input);
      expect(elements).toHaveLength(4);
      expect(elements[0].type).toBe('heading');
      expect(elements[1].type).toBe('paragraph');
      expect(elements[2].type).toBe('list');
      expect(elements[3].type).toBe('paragraph');
    });
  });
});