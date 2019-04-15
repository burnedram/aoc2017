interface IJQueryParentNode {
    append(...nodes: Array<string | Node>): void;
}

class JQueryParentNodeImpl implements IJQueryParentNode {
    constructor(private el: ParentNode) {}

    public append(...nodes: Array<string | Node>): void {
        this.el.append(...nodes);
    }
}

interface IJQueryNode {
    empty(): void;
}

class JQueryNodeImpl implements IJQueryNode {
    constructor(private el: Node) {}

    public empty(): void {
        while (this.el.firstChild) {
            this.el.firstChild.remove();
        }
    }
}

interface IJQueryElement {
    on(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;

    ready(
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
}

class JQueryElementImpl implements IJQueryElement {
    constructor(private el: Element | Document) {}

    public on(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void {
        this.el.addEventListener(type, listener, options);
    }

    public ready(
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void {
        this.el.addEventListener('DOMContentLoaded', listener, options);
    }
}

interface IJQueryHTMLElement {
    text(val?: string): string;
}

class JQueryHTMLElementImpl implements IJQueryHTMLElement {
    constructor(private el: HTMLElement) {}

    public text(val?: string): string {
        if (val !== undefined) {
            this.el.innerText = val;
        }
        return this.el.innerText;
    }
}

interface IJQueryHTMLInputElement {
    value(val?: string): string;
}

class JQueryHTMLInputElementImpl implements IJQueryHTMLInputElement {
    constructor(private el: HTMLInputElement) {}

    public value(val?: string): string {
        if (val !== undefined) {
            this.el.value = val;
        }
        return this.el.value;
    }
}

class JQueryHTMLElement implements IJQueryParentNode, IJQueryNode, IJQueryElement, IJQueryHTMLElement {
    private readonly parentNode: JQueryParentNodeImpl;
    private readonly node: JQueryNodeImpl;
    private readonly element: JQueryElementImpl;
    private readonly htmlElement: JQueryHTMLElementImpl;
    private readonly htmlInputElement: JQueryHTMLInputElementImpl | null;

    constructor(el: HTMLElement) {
        this.parentNode = new JQueryParentNodeImpl(el);
        this.node = new JQueryNodeImpl(el);
        this.element = new JQueryElementImpl(el);
        this.htmlElement = new JQueryHTMLElementImpl(el);
        this.htmlInputElement = el instanceof HTMLInputElement ? new JQueryHTMLInputElementImpl(el) : null;
    }

    public append(...nodes: Array<string | Node>): void {
        this.parentNode.append(...nodes);
    }

    public empty(): void {
        this.node.empty();
    }

    public on(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void {
        this.element.on(type, listener, options);
    }

    public ready(
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void {
        this.element.ready(listener, options);
    }

    public text(val?: string): string {
        return this.htmlElement.text(val);
    }

    public value(val?: string | undefined): string {
        if (this.htmlInputElement === null) {
            throw new Error('Element is not an input');
        }
        return this.htmlInputElement.value(val);
    }
}

class JQueryHTMLDocument implements IJQueryParentNode, IJQueryNode, IJQueryElement {
    private readonly parentNode: JQueryParentNodeImpl;
    private readonly node: JQueryNodeImpl;
    private readonly element: JQueryElementImpl;

    constructor(el: HTMLDocument) {
        this.parentNode = new JQueryParentNodeImpl(el);
        this.node = new JQueryNodeImpl(el);
        this.element = new JQueryElementImpl(el);
    }

    public append(...nodes: Array<string | Node>): void {
        this.parentNode.append(...nodes);
    }

    public empty(): void {
        this.node.empty();
    }

    public on(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void {
        this.element.on(type, listener, options);
    }

    public ready(
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void {
        this.element.ready(listener, options);
    }
}

type JQueryIn = string | HTMLElement | HTMLDocument;
type JQueryOut = JQueryHTMLElement | JQueryHTMLDocument;

export function $(el: HTMLDocument): JQueryHTMLDocument;
export function $(el: string | HTMLElement): JQueryHTMLElement;
export function $(el: JQueryIn): JQueryOut {
    if (el instanceof HTMLDocument) {
        return new JQueryHTMLDocument(el);
    }
    let element: HTMLElement;
    if (typeof el === 'string') {
        const elNull = document.querySelector<HTMLElement>(el);
        if (elNull === null) {
            throw new Error(`Could not find element with selector "${el}"`);
        }
        element = elNull;
    } else {
        element = el;
    }
    return new JQueryHTMLElement(element);
}

export function zip<TA, TB>(a: TA[], b: TB[]) {
    return a.map((v, i) => [v, b[i]]);
}
