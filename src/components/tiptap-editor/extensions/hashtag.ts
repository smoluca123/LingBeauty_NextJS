import { Node, mergeAttributes } from '@tiptap/core';

export interface HashtagOptions {
  HTMLAttributes: Record<string, string | number | boolean | undefined>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    hashtag: {
      setHashtag: (attributes: { tag: string }) => ReturnType;
    };
  }
}

export const HashtagExtension = Node.create<HashtagOptions>({
  name: 'hashtag',

  group: 'inline',

  inline: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      tag: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-tag'),
        renderHTML: (attributes) => {
          if (!attributes.tag) {
            return {};
          }
          return {
            'data-tag': attributes.tag,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-hashtag]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-hashtag': '', class: 'hashtag' },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      `#${node.attrs.tag}`,
    ];
  },

  addCommands() {
    return {
      setHashtag:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
