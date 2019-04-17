function querySelectorPls<T extends Element = Element>(node: ParentNode, selector: string) {
    const el = node.querySelector<T>(selector);
    if (el === null) {
        throw new Error('aoe');
    }
    return el;
}

export class AocLinkComponent extends HTMLElement {
    private readonly a: HTMLAnchorElement;
    constructor() {
        super();

        const template = querySelectorPls<HTMLTemplateElement>(document, '#aoc-link');
        const templateContent = template.content;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(templateContent.cloneNode(true));

        this.a = querySelectorPls<HTMLAnchorElement>(shadowRoot, 'a');
    }

    public connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        const href = this.getAttribute('href');
        if (href !== null) {
            this.a.href = href;
        }
    }
}

export function define() {
    customElements.define('aoc-link', AocLinkComponent);
}
