/* eslint-disable */
import store from 'store';

if (!Array.from) {
    Array.from = (function () {
        const toStr = Object.prototype.toString;
        const isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        const toInteger = function (value) {
            const number = Number(value);
            if (isNaN(number)) {
                return 0;
            }
            if (number === 0 || !isFinite(number)) {
                return number;
            }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        const maxSafeInteger = Math.pow(2, 53) - 1;
        const toLength = function (value) {
            const len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/* , mapFn, thisArg */) {
            // 1. Let C be the this value.
            const C = this;

            // 2. Let items be ToObject(arrayLike).
            const items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike === null) {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }

            // 4. If mapfn is undefined, then let mapping be false.
            const mapFn = arguments.length > 1 ? arguments[1] : undefined;
            let T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            const len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            const A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            let k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            let kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                }
                else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };
    }());
}

let wrapper = document.createElement('div');
wrapper.style.wordBreak = 'break-all';
wrapper.style.background = '#dcdcdc';
document.body.appendChild(wrapper);

// let oldConsoleLog = window.console.log;

// setInterval(() => {

// }, 200);

window.console.log = function (msg) {
    msg = JSON.stringify(msg);

    if (typeof window.document !== 'undefined') {
        let div = document.createElement('div');
        div.style.wordBreak = 'break-all';
        div.innerHTML = msg;
        wrapper.appendChild(div);
    }
    else {
        store.get('log', 'stack')
        .then(data => {
            if (data) {
                data.push(msg);
            }
            else {
                data = [msg];
            }

            store.put('log', data, 'stack');
        });
    }
};

window.console.error = function (msg) {
    msg = JSON.stringify(msg);

    if (typeof window.document !== 'undefined') {
        let div = document.createElement('div');
        div.style.wordBreak = 'break-all';
        div.style.color = '#f00';
        div.innerHTML = msg;
        wrapper.appendChild(div);
    }
    else {
        store.get('log', 'stack')
        .then(data => {
            if (data) {
                data.push(msg);
            }
            else {
                data = [msg];
            }

            store.put('log', data, 'stack');
        });
    }
};

function tictok() {
    return setTimeout(() => {
        // oldConsoleLog('-- tictok --');
        store.get('log', 'stack')
        .then(stack => {
            if (stack) {
                stack = JSON.parse(stack);
                stack.forEach(msg => {
                    console.log(msg);
                });
                store.put('log', '[]', 'stack');
            }

            // return tictok();
        })
        .catch(() => {})
        .then(() => {
            return tictok();
        })
    }, 200);
}

window.onerror = function (msg) {
    console.error('There is some uncatched error:');
    console.log(msg);
    console.log('--- --- ---');
};

tictok();
// document.querySelector('.lang-switch').addEventListener('click', function (evt) {
//     evt.preventDefault();
//     const lang = Array.from(evt.target.classList).indexOf('zh') > -1 ? 'zh' : 'en';
//     const date = new Date();
//     date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
//     document.cookie = 'lang=' + lang + '; expires=' + date.toUTCString + '; path=/';
//     location.search = '';
// });
