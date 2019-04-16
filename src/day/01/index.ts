import { zip } from '@/shared/helpers';
import '@/components/aoc-link';

type IMapper = (v: number, i: number, a: number[]) => number;

function querySelectorPls<T extends Element = Element>(node: ParentNode, selector: string) {
    const el = node.querySelector<T>(selector);
    if (el === null) {
        throw new Error('aoe');
    }
    return el;
}

customElements.define('task-01',
    class Task01Component extends HTMLElement {
        private readonly puzzleInput: HTMLInputElement;
        private readonly result: HTMLSpanElement;
        private readonly spans: HTMLParagraphElement;

        constructor() {
            super();
            const template = querySelectorPls<HTMLTemplateElement>(document, '#task-01');
            const templateContent = template.content;
            const shadowRoot = this.attachShadow({mode: 'open'});
            shadowRoot.appendChild(templateContent.cloneNode(true));

            this.puzzleInput = querySelectorPls<HTMLInputElement>(shadowRoot, '#puzzleInput');
            this.result = querySelectorPls<HTMLSpanElement>(shadowRoot, '#result');
            this.spans = querySelectorPls<HTMLParagraphElement>(shadowRoot, '#spans');

            querySelectorPls(shadowRoot, '#task01').addEventListener('click', () => {
                this.task((v, i, a) => a[(i + 1) % a.length]);
            });
            querySelectorPls(shadowRoot, '#task02').addEventListener('click', () => {
                this.task((v, i, a) => a[(i + a.length / 2) % a.length]);
            });
        }

        private task(mapper: IMapper) {
            const val = this.puzzleInput.value
                .split('')
                .map(Number);
            const zippedVal = zip(val, val.map(mapper));
            const result = zippedVal.reduce((p, c) => {
                if (c[0] === c[1]) {
                    p.result += c[0];
                    if (p.spans.length % 2 === 1) {
                        p.spans.push([]);
                    }
                } else if (p.spans.length % 2 === 0) {
                    p.spans.push([]);
                }
                p.spans.slice(-1)[0].push(c[0]);
                return p;
            }, {result: 0, spans: new Array<number[]>([])});

            this.result.innerText = `${result.result}`;
            while (this.spans.firstChild) {
                this.spans.firstChild.remove();
            }
            this.spans.append(...result.spans.map((v, i) => {
                const span = document.createElement('span');
                span.innerText = v.join('');
                if (i % 2 === 1) {
                    span.classList.add('correct');
                }
                return span;
            }));
        }
    },
);
