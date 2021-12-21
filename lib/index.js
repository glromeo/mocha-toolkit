"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reimport = exports.unrequire = exports.mockquire = exports.sinon = exports.chai = exports.fake = exports.mock = exports.stub = exports.spy = exports.match = exports.expect = exports.assert = exports.xit = exports.it = exports.afterEach = exports.after = exports.beforeEach = exports.before = exports.describe = void 0;
const chai = __importStar(require("chai"));
exports.chai = chai;
const path = __importStar(require("path"));
const sinon = __importStar(require("sinon"));
exports.sinon = sinon;
require("sinon-chai");
require("chai-string");
require("chai-datetime");
var mocha_1 = require("mocha");
Object.defineProperty(exports, "describe", { enumerable: true, get: function () { return mocha_1.describe; } });
Object.defineProperty(exports, "before", { enumerable: true, get: function () { return mocha_1.before; } });
Object.defineProperty(exports, "beforeEach", { enumerable: true, get: function () { return mocha_1.beforeEach; } });
Object.defineProperty(exports, "after", { enumerable: true, get: function () { return mocha_1.after; } });
Object.defineProperty(exports, "afterEach", { enumerable: true, get: function () { return mocha_1.afterEach; } });
Object.defineProperty(exports, "it", { enumerable: true, get: function () { return mocha_1.it; } });
Object.defineProperty(exports, "xit", { enumerable: true, get: function () { return mocha_1.xit; } });
chai.use(require("sinon-chai"));
chai.use(require("chai-string"));
chai.use(require("chai-datetime"));
global.assert = chai.assert;
global.expect = chai.expect;
var chai_1 = require("chai");
Object.defineProperty(exports, "assert", { enumerable: true, get: function () { return chai_1.assert; } });
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return chai_1.expect; } });
var sinon_1 = require("sinon");
Object.defineProperty(exports, "match", { enumerable: true, get: function () { return sinon_1.match; } });
Object.defineProperty(exports, "spy", { enumerable: true, get: function () { return sinon_1.spy; } });
Object.defineProperty(exports, "stub", { enumerable: true, get: function () { return sinon_1.stub; } });
Object.defineProperty(exports, "mock", { enumerable: true, get: function () { return sinon_1.mock; } });
Object.defineProperty(exports, "fake", { enumerable: true, get: function () { return sinon_1.fake; } });
const mocks = {};
const _module = require("module");
const _resolveFilename = _module._resolveFilename;
_module._resolveFilename = function () {
    return mocks[arguments[0]] ?? _resolveFilename.apply(_module, arguments);
};
function mockquire(request, stub, requireOptions = { paths: [callerDirname()] }) {
    try {
        const resolved = require.resolve(request, requireOptions);
        delete require.cache[resolved];
        require(resolved);
        const cached = require.cache[resolved];
        return cached.exports = new Proxy(cached.exports, {
            get(target, p) {
                if (stub.hasOwnProperty(p)) {
                    return stub[p];
                }
                else {
                    return target[p];
                }
            }
        });
    }
    catch (e) {
        mocks[request] = `mockquire:${request}`;
        const resolved = require.resolve(request, requireOptions);
        require.cache[resolved] = {
            id: resolved,
            filename: resolved,
            loaded: true,
            exports: stub
        };
        return stub;
    }
}
exports.mockquire = mockquire;
function unrequire(module, requireOptions = { paths: [callerDirname()] }) {
    delete require.cache[require.resolve(module, requireOptions)];
}
exports.unrequire = unrequire;
async function reimport(module, requireOptions = { paths: [callerDirname()] }) {
    unrequire(module, requireOptions);
    return Promise.resolve().then(() => __importStar(require(module)));
}
exports.reimport = reimport;
function stacktrace() {
    const prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function captureOnce(_, stack) {
        Error.prepareStackTrace = prepareStackTrace;
        return stack;
    };
    return (new Error()).stack;
}
function callerDirname(depth = 1) {
    let stack = stacktrace();
    let frame = stack[2 + (isNaN(depth) ? 1 : Math.min(depth, stack.length - 2))];
    let filename = frame?.getFileName();
    return filename ? path.dirname(filename) : process.cwd();
}
if (!globalThis.fetch) {
    Object.defineProperty(globalThis, "fetch", {
        enumerable: true,
        configurable: true,
        value: async (url, init) => {
            const { default: fetch } = await eval(`import("node-fetch")`);
            Object.defineProperty(globalThis, "fetch", { enumerable: true, value: fetch });
            return fetch(url, init);
        }
    });
}
//# sourceMappingURL=index.js.map