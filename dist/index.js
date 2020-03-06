"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const redux_1 = require("redux");
const lodash_1 = require("lodash");
const events_1 = require("events");
class ReduxSimpleEvent extends events_1.EventEmitter {
    constructor(obj = {}, { locked = false, browser = true } = {}) {
        super();
        this.browser = true;
        this.locked = false;
        this.state = {};
        this.store = redux_1.createStore(() => { });
        this.browser = browser;
        this.locked = locked;
        this.state = obj;
        if (this.browser) {
            const enhancer = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
            this.lastType = undefined;
            const reduce = this.reducer.bind(this);
            const store = redux_1.createStore(reduce, enhancer);
            store.subscribe(() => this.emitChanges(store));
            this.store = store;
        }
    }
    emitChanges(store) {
        const state = store.getState();
        this.emit('change', state);
        if (this.lastType) {
            let terms = ['change'];
            this.lastType.split('.').forEach((e, i) => {
                terms = [...terms, e];
                this.emit(terms.join('-'), lodash_1.get(state, terms.join('.').replace('change.', '')));
            });
            if (this.lastType.indexOf('@@redux/INIT') > -1)
                this.emit('reset', state);
        }
    }
    reducer(state, action) {
        // reset
        if (action.type === '__RESET__') {
            this.state = action.value;
            return action.value;
        }
        // If is locked for new attribu`tes
        if (state && this.locked && lodash_1.get(state, action.type) === undefined)
            return state;
        // eslint-disable-next-line no-param-reassign
        if (state === undefined)
            state = this.state;
        if (action.value === undefined || action.value === null) {
            lodash_1.unset(state, action.type);
        }
        else {
            const isObj = (obj) => obj != null && obj.constructor.name === "Object";
            const value = isObj(action.value) ? lodash_1.cloneDeep(action.value) : action.value;
            lodash_1.set(state, action.type, value);
        }
        this.lastType = action.type;
        return state;
    }
    reset(value = {}) {
        if (this.browser)
            this.store.dispatch({ type: '__RESET__', value });
        else
            this.state = lodash_1.cloneDeep(value);
    }
    getState() {
        if (this.browser)
            return this.store.getState();
        return this.state;
    }
    setState(key, value) {
        if (value === undefined && typeof key === 'object') {
            const obj = key;
            Object.keys(obj).forEach((k) => {
                this.setState(k, obj[k]);
            });
        }
        else {
            if (this.browser)
                this.store.dispatch({ type: key, value });
            else if (!this.browser && !this.locked)
                lodash_1.set(this.state, key, value);
        }
    }
    removeState(key) {
        return this.setState(key, null);
    }
}
exports.ReduxSimpleEvent = ReduxSimpleEvent;
//# sourceMappingURL=index.js.map