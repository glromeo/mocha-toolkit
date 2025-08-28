import * as mocha from "mocha";
import * as chai from "chai";
import * as path from "path";
import * as sinon from "sinon";

import "sinon-chai";
import "chai-string";
import "chai-datetime";

export {
    describe,
    before,
    beforeEach,
    after,
    afterEach,
    it,
    xit,
} from "mocha";

chai.use(require("sinon-chai").default);
chai.use(require("chai-string").default);
chai.use(require("chai-datetime"));

declare global {
    var describe: typeof mocha.describe;
    var before: typeof mocha.before;
    var beforeEach: typeof mocha.beforeEach;
    var after: typeof mocha.after;
    var afterEach: typeof mocha.afterEach;
    var it: typeof mocha.it;
    var xit: typeof mocha.xit;
    var assert: typeof chai.assert;
    var expect: typeof chai.expect;
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

const mocks: Record<string, string> = {};

const _module = require("module");
const _resolveFilename = _module._resolveFilename;
_module._resolveFilename = function (): string {
    return mocks[arguments[0]] ?? _resolveFilename.apply(_module, arguments);
};

/**
 * NOTE: It deletes any previously cached resolution so mockquire invokable multiple times
 *
 * @param request
 * @param stub
 * @param requireOptions
 */
export function mockquire<T extends object>(request: string, stub: T, requireOptions = {paths: [callerDirname()]}): T {
    try {
        const resolved = require.resolve(request, requireOptions);
        delete require.cache[resolved];
        require(resolved);
        const cached = require.cache[resolved]!;
        return cached.exports = new Proxy(cached.exports, {
            get(target: any, p: string) {
                if (stub.hasOwnProperty(p)) {
                    return stub[p as keyof T];
                } else {
                    return target[p];
                }
            }
        });
    } catch (e) {
        mocks[request] = `mockquire:${request}`;
        const resolved = require.resolve(request, requireOptions);
        require.cache[resolved] = {
            id: resolved,
            filename: resolved,
            loaded: true,
            exports: stub
        } as NodeModule;
        return stub;
    }
}

export function unrequire(module: string, requireOptions = {paths: [callerDirname()]}): void {
    delete require.cache[require.resolve(module, requireOptions)];
}

export async function reimport<T>(module: string, requireOptions = {paths: [callerDirname()]}):Promise<T> {
    unrequire(module, requireOptions);
    return import(module);
}

function stacktrace(): NodeJS.CallSite[] {
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
