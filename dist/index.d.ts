import { Store } from 'redux';
import { EventEmitter } from 'events';
export declare class ReduxSimpleEvent extends EventEmitter {
    private browser;
    private locked;
    private state;
    private lastType?;
    store: Store;
    constructor(obj?: Object, { locked, browser }?: {
        locked?: boolean | undefined;
        browser?: boolean | undefined;
    });
    private emitChanges;
    private reducer;
    reset(value?: {}): void;
    getState(): Object;
    setState(key: string, value: any): void;
    removeState(key: string): void;
}
