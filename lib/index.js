"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unrequire = exports.mockquire = exports.sinon = exports.chai = exports.fake = exports.mock = exports.stub = exports.spy = exports.match = exports.expect = exports.assert = void 0;
const chai_1 = __importDefault(require("chai"));
exports.chai = chai_1.default;
const path_1 = __importDefault(require("path"));
const sinon_1 = __importDefault(require("sinon"));
exports.sinon = sinon_1.default;
const sinon_chai_1 = __importDefault(require("sinon-chai"));
chai_1.default.use(sinon_chai_1.default);
global.assert = chai_1.default.assert;
global.expect = chai_1.default.expect;
var chai_2 = require("chai");
Object.defineProperty(exports, "assert", { enumerable: true, get: function () { return chai_2.assert; } });
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return chai_2.expect; } });
var sinon_2 = require("sinon");
Object.defineProperty(exports, "match", { enumerable: true, get: function () { return sinon_2.match; } });
Object.defineProperty(exports, "spy", { enumerable: true, get: function () { return sinon_2.spy; } });
Object.defineProperty(exports, "stub", { enumerable: true, get: function () { return sinon_2.stub; } });
Object.defineProperty(exports, "mock", { enumerable: true, get: function () { return sinon_2.mock; } });
Object.defineProperty(exports, "fake", { enumerable: true, get: function () { return sinon_2.fake; } });
const mockRequests = {};
const _module = require("module");
const _resolveFilename = _module._resolveFilename;
_module._resolveFilename = function () {
    var _a;
    return (_a = mockRequests[arguments[0]]) !== null && _a !== void 0 ? _a : _resolveFilename.apply(_module, arguments);
};
function mockquire(request, stub, requireOptions = { paths: [callerDirname()] }) {
    try {
        const resolved = require.resolve(request, requireOptions);
        delete require.cache[resolved];
        require(resolved);
        const cached = require.cache[resolved];
        cached.exports = new Proxy(cached.exports, {
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
        mockRequests[request] = `mockquire:${request}`;
        const resolved = require.resolve(request, requireOptions);
        require.cache[resolved] = {
            id: resolved,
            filename: resolved,
            loaded: true,
            exports: stub
        };
    }
}
exports.mockquire = mockquire;
function unrequire(module, requireOptions = { paths: [callerDirname()] }) {
    delete require.cache[require.resolve(module, requireOptions)];
}
exports.unrequire = unrequire;
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
    let filename = frame === null || frame === void 0 ? void 0 : frame.getFileName();
    return filename ? path_1.default.dirname(filename) : process.cwd();
}
//# sourceMappingURL=index.js.map