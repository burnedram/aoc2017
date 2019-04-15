interface IJQueryParentNode {
    append(...nodes: Array<string | Node>): void;
}

interface IJQueryNode {
    empty(): void;
}

interface IJQueryElement extends IJQueryParentNode, IJQueryNode {
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

interface IJQueryHTMLElement extends IJQueryElement {
    text(val?: string): string;
}

interface IJQueryHTMLInputElement extends IJQueryHTMLElement {
    value(val?: string): string;
}

type IJQueryHTMLDocument = IJQueryElement;

interface IJQuery extends IJQueryHTMLElement, IJQueryHTMLInputElement, IJQueryHTMLDocument {
}

type HTMLTypes = HTMLElement | HTMLInputElement | HTMLDocument;

class JQuery implements IJQuery {
    private readonly element: HTMLElement;
    private readonly inputElement: HTMLInputElement;
    private readonly document: HTMLDocument;

    constructor(el: string | HTMLTypes) {
        let element: HTMLTypes;
        if (typeof el === 'string') {
            const elNull = document.querySelector<HTMLElement>(el);
            if (elNull === null) {
                throw new Error(`Could not find element with selector "${el}"`);
            }
            element = elNull;
        } else {
            element = el;
        }
        this.element = element as HTMLElement;
        this.inputElement = element as HTMLInputElement;
        this.document = element as HTMLDocument;
    }

    public append(...nodes: Array<string | Node>): void {
        this.element.append(...nodes);
    }

    public empty(): void {
        while(this.element.firstChild) {
            this.element.firstChild.remove();
        }
    }

    public on(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void {
        this.element.addEventListener(type, listener, options);
    }

    public ready(
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void {
        this.element.addEventListener('DOMContentLoaded', listener, options);
    }

    public text(val?: string): string {
        if (val !== undefined) {
            this.element.innerText = val;
        }
        return this.element.innerText;
    }

    public value(val?: string): string {
        if (val !== undefined) {
            this.inputElement.value = val;
        }
        return this.inputElement.value;
    }
}

export function $(el: string | HTMLTypes): JQuery {
    return new JQuery(el);
}

export function zip<TA, TB>(a: TA[], b: TB[]) {
    return a.map((v, i) => [v, b[i]]);
}
