function querySelectorPls<T extends Element = Element>(node: ParentNode, selector: string) {
    const el = node.querySelector<T>(selector);
    if (el === null) {
        throw new Error('aoe');
    }
    return el;
}

customElements.define('aoc-link',
    class AocLinkComponent extends HTMLElement {
        private readonly a: HTMLAnchorElement;
        constructor() {
            super();

            const template = querySelectorPls<HTMLTemplateElement>(document, '#aoc-link');
            const templateContent = template.content;
            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.appendChild(templateContent.cloneNode(true));

            this.a = querySelectorPls<HTMLAnchorElement>(shadowRoot, 'a');
            const href = this.getAttribute('href');
            if (href !== null) {
                this.a.href = href;
            }
        }
    },
);
