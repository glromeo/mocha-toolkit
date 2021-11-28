import * as mocha from "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import "sinon-chai";
import "chai-datetime";
export { describe, before, beforeEach, after, afterEach, it, xit, } from "mocha";
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
export { assert, expect } from "chai";
export { match, spy, stub, mock, fake } from "sinon";
export { chai, sinon };
export declare function mockquire<T extends object>(request: string, stub: T, requireOptions?: {
    paths: string[];
}): T;
export declare function unrequire(module: string, requireOptions?: {
    paths: string[];
}): void;
export declare function reimport<T>(module: string, requireOptions?: {
    paths: string[];
}): Promise<T>;
