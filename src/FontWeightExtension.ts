import TextStyle from '@tiptap/extension-text-style';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontWeight: {
            /**
             * Set the font size
             */
            setFontWeight: (size: string) => ReturnType;
            /**
             * Unset the font size
             */
            unsetFontWeight: () => ReturnType;
        };
    }
}

export const FontWeight = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontWeight: {
                default: null,
                parseHTML: (element) => element.style.fontWeight,
                renderHTML: (attributes) => {
                    if (!attributes['fontWeight']) {
                        return {};
                    }
                    return {
                        style: `font-weight: ${attributes['fontWeight']}`
                    };
                }
            }
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setFontWeight:
                (fontWeight) =>
                ({ commands }) => {
                    return commands.setMark(this.name, { fontWeight: fontWeight });
                },
            unsetFontWeight:
                () =>
                ({ chain }) => {
                    return chain()
                        .setMark(this.name, { fontWeight: null })
                        .removeEmptyTextStyle()
                        .run();
                },
        };
    }
});
