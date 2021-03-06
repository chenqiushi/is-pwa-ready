import assert from 'assert';
// import store from 'store';

// **********************  判断   ************************
// 用于一些关键判断
// ********************************************************
// **********************  环境判断   ************************

/**
 * @module uitls
 * @description 工具集
 */

/**
 * [inWindowScope 判断是否在window域内]
 * @return {boolean}
 */
export const inWindowScope = typeof window !== 'undefined'
    && Object.prototype.toString.call(window) !== '[object Object]';

// **********************  类型判断   ************************

/**
 * 判断是否是对象
 * @param  {anything}  obj 传入对象
 * @return {boolean}     [description]
 */
export function isObject(obj) {
    // incase of arrow function and array
    return Object(obj) === obj && String(obj) === '[object Object]' && typeof obj !== 'function' && !Array.isArray(obj);
}

/**
 * 判断是否为数字
 * @param  {anything}  obj [description]
 * @return {boolean}     [description]
 */
export function isNumeric(obj) {
    return !Array.isArray(obj) && (obj - Number.parseFloat(obj) + 1) >= 0;
}

/**
 * 判断是否为空
 * @param  {anything}  obj [description]
 * @return {boolean}     [description]
 * @example
 * "", {}, [], 0, null, undefined, false 为空
 */
export function isEmpty(obj) {
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }
    else if (isObject(obj)) {
        return Object.keys(obj).length === 0;
    }
    return !obj;

}

/**
 * 判断是否为事件
 * @param  {anything}  obj [description]
 * @return {boolean}     [description]
 */
export function isEvent(obj) {
    return obj instanceof Event || obj.originalEvent instanceof Event;
}

/**
 * 判断是否为blob
 * @param  {anything}  obj [description]
 * @return {boolean}     [description]
 */
export function isBlob(obj) {
    return obj instanceof Blob;
}

/**
 * 判断是否为file上传的文件
 * @param  {anything}  obj [description]
 * @return {boolean}     [description]
 */
export function isFile(obj) {
    return isBlob(obj) && isString(obj.name);
}

/**
 * 判断是否为日期对象
 * @param  {anything}  obj [description]
 * @return {boolean}     [description]
 */
export function isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
}

/**
 * 判断是否是string
 * @param  {anything}  str [description]
 * @return {boolean}     [description]
 */
export function isString(str) {
    return typeof str === 'string' || str instanceof String;
}

/**
 * 判断是否是promise
 * @param  {anything}  obj [description]
 * @return {boolean}     [description]
 */
export function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * 配合async/await使用，延迟一段时间
 * @param  {number} duration 休眠时长
 * @return {Promise}         用于异步操作
 */
export function sleep(duration) {
    assert(Number.isInteger(duration), 'onlym accept interger');
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

// *************************query与对象转换*******************************
// 将search字符串解析为json对象
// 只是简易写法，如果需求比较多，请引入qs
// npm install qs --save
// 并使用之
export function search2obj(search = location.search) {
    const ret = {};
    if (!search || search.length < 2) {
        return ret;
    }
    search = search.slice(1);
    search = search.split('&');
    search.map(each => {
        each = each.split('=');
        ret[each[0]] = each[1];
    });
    return ret;
}
// 将json对象拼接为search字符串
// 只是简易写法，如果需求比较多，请引入qs
// npm install qs --save
// 并使用之
export function obj2search(obj) {
    const ret = [];
    for (const each in obj) {
        if (obj.hasOwnProperty(each)) {
            ret.push(each + '=' + obj[each]);
        }
    }
    return '?' + ret.join('&');
}

/**
 * generate one-time event listener and wrap in promise
 * @param  {Function} fn the handler of event
 * @param  {Object}   target Object to listen on
 * @param  {string}   event  event type
 * @return {Promise}     so that we can use promise
 */
export function promisifyOneTimeEventListener(fn, target, event) {
    return new Promise((resolve, reject) => {
        function handler(evt) {
            Promise.resolve(fn(evt))
            .then(() => {
                target.removeEventListener(event, handler);
                resolve();
            })
            .catch(reject);
        }
        target.addEventListener(event, handler);
    });
}

// 生成uuid
export function uuid() {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() + '-' + Date.now());
}

// reload
export async function reload(stepName) {
    const step = localStorage.getItem('step');

    if (step === stepName) {
        localStorage.setItem('step', '');
        // await sleep(5000);
    }
    else {
        localStorage.setItem('step', stepName);
        await sleep(3000);
        window.location.reload();
        return await sleep(5000);
    }
}

// 生成四个随机数
export function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// export function waitUntilSWActivated(scope) {
//     return new Promise((resolve, reject) => {
//         let fn = () => {
//             return setTimeout(async () => {
//                 let sw = await navigator.serviceWorker.getRegistration(scope);
//                 if (sw && sw.active && sw.active.state === 'actived') {
//                     resolve();
//                 }
//                 else {
//                     return fn();
//                 }
//             }, 200);
//         };

//         fn();
//     });
// }

// export function registerConsole() {
//     self.console.log = function (msg) {
//         if (typeof msg !== 'string') {
//             msg = JSON.stringify(msg);
//         }

//         store.get('log', 'stack')
//         .then(data => {
//             if (data) {
//                 data = JSON.parse(data);
//                 data.push(msg);
//             }
//             else {
//                 data = [msg];
//             }

//             data = JSON.stringify(data);
//             store.put('log', data, 'stack');
//         });
//     };

//     self.console.error = function (msg) {
//         if (typeof msg !== 'string') {
//             msg = JSON.stringify(msg);
//         }

//         store.get('log', 'stack')
//         .then(data => {
//             if (data) {
//                 data = JSON.parse(data);
//                 data.push(msg);
//             }
//             else {
//                 data = [msg];
//             }

//             data = JSON.stringify(data);

//             store.put('log', data, 'stack');
//         });
//     };
// }
