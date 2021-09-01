import chai from "chai";
import sinon from "sinon";
declare global {
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
