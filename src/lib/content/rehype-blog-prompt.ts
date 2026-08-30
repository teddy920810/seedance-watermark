export type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function promptRows(node: HastNode): Array<{ label: string; value: string }> | undefined {
  if (node.type !== 'element' || node.tagName !== 'pre') return undefined;
  const code = node.children?.find((child) => child.type === 'element' && child.tagName === 'code');
  const collectText = (child: HastNode): string => child.value ?? child.children?.map(collectText).join('') ?? '';
  const text = code ? collectText(code) : '';
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return undefined;
  const rows = lines.map((line) => line.match(/^([A-Z][A-Z /-]+):\s*(.+)$/));
  if (rows.some((row) => !row)) return undefined;
  return rows.map((row) => ({
    label: `${row?.[1]?.slice(0, 1)}${row?.[1]?.slice(1).toLowerCase()}`,
    value: row?.[2] ?? '',
  }));
}

export function rehypeBlogPrompt() {
  return function transform(tree: HastNode): void {
    const visit = (node: HastNode): void => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['blog-table-scroll'] },
            children: [child],
          };
        }
        const rows = promptRows(child);
        if (rows) {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['blog-prompt-text'] },
            children: rows.map((row) => ({
              type: 'element',
              tagName: 'p',
              properties: {},
              children: [
                { type: 'element', tagName: 'span', properties: {}, children: [{ type: 'text', value: row.label }] },
                { type: 'text', value: row.value },
              ],
            })),
          };
        }
        if (child.type === 'element' && child.tagName === 'pre') {
          child.properties = { ...child.properties, tabIndex: 0 };
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}
