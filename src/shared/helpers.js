module.exports = {
    $: element => {
        if (typeof(element) === "string")
            element = document.querySelector(element);
        return {
            on: (event, handler) => element.addEventListener(event, handler),
            ready: handler => element.addEventListener('DOMContentLoaded', handler),
            text: function text(val) {
                if (arguments.length !== 0) {
                    element.innerText = val;
                }
                return element.innerText;
            },
            value: function value(val) {
                if (arguments.length !== 0) {
                    element.value = val;
                }
                return element.value;
            },
            append: el => element.append(el),
            empty: () => {
                while (element.firstChild)
                    element.firstChild.remove();
            }
        };
    },
    zip: (a, b) => a.map((v, i) => [v, b[i]])
};