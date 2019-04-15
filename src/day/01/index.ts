import { $, zip } from '@/shared/helpers';

type IMapper = (v: number, i: number, a: number[]) => number;

function task(mapper: IMapper) {
    const val = $('#puzzleInput').value()
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

    $('#result').text(`${result.result}`);
    $('#spans').empty();
    $('#spans').append(...result.spans.map((v, i) => {
        const span = document.createElement('span');
        span.innerText = v.join('');
        if (i % 2 === 1) {
            span.classList.add('correct');
        }
        return span;
    }));
}

$(document).ready(() => {
    $('#task01').on('click', () => {
        task((v, i, a) => a[(i + 1) % a.length]);
    });

    $('#task02').on('click', () => {
        task((v, i, a) => a[(i + a.length / 2) % a.length]);
    });
});
