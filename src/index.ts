import chai from "chai";
import path from "path";
import sinon from "sinon";
import sinon_chai from "sinon-chai";

chai.use(sinon_chai);

declare global {
    var assert: typeof chai.assert;
    var expect: typeof chai.expect
}

global.assert = chai.assert;
global.expect = chai.expect;

export {assert, expect} from "chai";

export {
    match,
    spy,
    stub,
    mock,
    fake
} from "sinon";

export {
    chai,
    sinon
};

const mockRequests:Record<string, string> = {};

const _module = require("module");
const _resolveFilename = _module._resolveFilename;
_module._resolveFilename = function ():string {
    return mockRequests[arguments[0]] ?? _resolveFilename.apply(_module, arguments);
};

/**
 * NOTE: It deletes any previously cached resolution so mockquire invokable multiple times
 *
 * @param request
 * @param stub
 * @param requireOptions
 */
export function mockquire(request: string, stub: any, requireOptions = {paths: [callerDirname()]}) {
    try {
        const resolved = require.resolve(request, requireOptions);
        delete require.cache[resolved];
        require(resolved);
        const cached = require.cache[resolved]!;
        cached.exports = new Proxy(cached.exports, {
            get(target: any, p: string) {
                if (stub.hasOwnProperty(p)) {
                    return stub[p];
                } else {
                    return target[p];
                }
            }
        });
    } catch (e) {
        mockRequests[request] = `mockquire:${request}`;
        const resolved = require.resolve(request, requireOptions);
        require.cache[resolved] = {
            id: resolved,
            filename: resolved,
            loaded: true,
            exports: stub
        } as NodeModule;
    }
}

export function unrequire(module: string, requireOptions = {paths: [callerDirname()]}) {
    delete require.cache[require.resolve(module, requireOptions)];
}

function stacktrace():NodeJS.CallSite[] {
    const prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function captureOnce(_, stack) {
        Error.prepareStackTrace = prepareStackTrace;
        return stack;
    };
    return (new Error()).stack as any;
}

function callerDirname(depth: number = 1) {
    let stack = stacktrace();
    let frame = stack[2 + (isNaN(depth) ? 1 : Math.min(depth, stack.length - 2))];
    let filename = frame?.getFileName();
    return filename ? path.dirname(filename) : process.cwd();
}