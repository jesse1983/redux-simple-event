/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class ReduxSimpleEvent extends EventEmitter {
    private browser;
    private locked;
    private state;
    private store;
    private lastType?;
    constructor(obj?: Object, { locked, browser }?: {
        locked?: boolean;
        browser?: boolean;
    });
    private reducer;
    reset(value?: {}): void;
    getState(): Object;
    setState(key: string, value: any): void;
    removeState(key: string): void;
}
