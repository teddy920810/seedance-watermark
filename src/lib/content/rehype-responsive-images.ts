import { getResponsiveImage, responsiveSrcset, type ResponsiveImageEntry } from './responsive-images';

export type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

export function rehypeResponsiveImages(options: {
  resolveImage?: (src: string) => ResponsiveImageEntry | undefined;
} = {}) {
  const resolveImage = options.resolveImage ?? getResponsiveImage;
  return function transform(tree: HastNode): void {
    const visit = (node: HastNode): void => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'img' && node.tagName !== 'picture') {
          const src = typeof child.properties?.src === 'string' ? child.properties.src : '';
          const entry = resolveImage(src);
          if (entry) {
            const sizes = typeof child.properties?.sizes === 'string'
              ? child.properties.sizes
              : '(max-width: 960px) 100vw, 960px';
            child.properties = { ...child.properties, width: entry.width, height: entry.height };
            return {
              type: 'element',
              tagName: 'picture',
              properties: { className: ['responsive-picture'] },
              children: [
                {
                  type: 'element',
                  tagName: 'source',
                  properties: { type: 'image/webp', srcSet: responsiveSrcset(entry), sizes },
                  children: [],
                },
                child,
              ],
            };
          }
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}
