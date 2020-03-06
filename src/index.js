"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var redux_1 = require("redux");
var lodash_1 = require("lodash");
var events_1 = require("events");
var ReduxSimpleEvent = /** @class */ (function (_super) {
    __extends(ReduxSimpleEvent, _super);
    function ReduxSimpleEvent(obj, _a) {
        if (obj === void 0) { obj = {}; }
        var _b = _a === void 0 ? {} : _a, _c = _b.locked, locked = _c === void 0 ? false : _c, _d = _b.browser, browser = _d === void 0 ? typeof (window) !== 'undefined' : _d;
        var _this = _super.call(this) || this;
        _this.browser = true;
        _this.locked = false;
        _this.state = {};
        _this.lastType = '';
        _this.store = redux_1.createStore(function () { });
        _this.browser = browser;
        _this.locked = locked;
        _this.state = obj;
        if (_this.browser) {
            var enhancer = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
            _this.lastType = '';
            var reduce = _this.reducer.bind(_this);
            var store_1 = redux_1.createStore(reduce, enhancer);
            store_1.subscribe(function () { return _this.emitChanges(store_1); });
            _this.store = store_1;
        }
        return _this;
    }
    ReduxSimpleEvent.prototype.emitChanges = function (store) {
        var _this = this;
        var state = store.getState();
        this.emit('change', state);
        var terms = ['change'];
        this.lastType.split('.').forEach(function (e, i) {
            terms = __spreadArrays(terms, [e]);
            _this.emit(terms.join('-'), lodash_1.get(state, terms.join('.').replace('change.', '')));
        });
        if (this.lastType.indexOf('@@redux/INIT') > -1)
            this.emit('reset', state);
    };
    ReduxSimpleEvent.prototype.reducer = function (state, action) {
        // reset
        if (action.type === '__RESET__') {
            this.state = action.value;
            return action.value;
        }
        // If is locked for new attributes
        if (state && this.locked && lodash_1.get(state, action.type) === undefined)
            return state;
        // eslint-disable-next-line no-param-reassign
        if (state === undefined)
            state = this.state;
        if (action.value === undefined || action.value === null) {
            lodash_1.unset(state, action.type);
        }
        else {
            var isObj = function (obj) { return obj != null && obj.constructor.name === "Object"; };
            var value = isObj(action.value) ? lodash_1.cloneDeep(action.value) : action.value;
            lodash_1.set(state, action.type, value);
        }
        this.lastType = action.type;
        return state;
    };
    ReduxSimpleEvent.prototype.reset = function (value) {
        if (value === void 0) { value = {}; }
        if (this.browser)
            this.store.dispatch({ type: '__RESET__', value: value });
        else
            this.state = lodash_1.cloneDeep(value);
    };
    ReduxSimpleEvent.prototype.getState = function () {
        if (this.browser)
            return this.store.getState();
        return this.state;
    };
    ReduxSimpleEvent.prototype.setState = function (key, value) {
        var _this = this;
        if (value === undefined && typeof key === 'object') {
            var obj_1 = key;
            Object.keys(obj_1).forEach(function (k) {
                _this.setState(k, obj_1[k]);
            });
        }
        else {
            if (this.browser)
                this.store.dispatch({ type: key, value: value });
            else if (!this.browser && !this.locked)
                lodash_1.set(this.state, key, value);
        }
    };
    ReduxSimpleEvent.prototype.removeState = function (key) {
        return this.setState(key, null);
    };
    return ReduxSimpleEvent;
}(events_1.EventEmitter));
exports.ReduxSimpleEvent = ReduxSimpleEvent;
