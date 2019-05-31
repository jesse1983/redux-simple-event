/* eslint-disable no-underscore-dangle */
const redux = require('redux');
const { set, get, unset } = require('lodash');
const { EventEmitter } = require('events');

/* istanbul ignore next */
const webTools = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

class Emitter extends EventEmitter {
  constructor(obj = {}, opts = { locked: false }) {
    super();
    this._locked = opts.locked;
    this._state = obj;
    this._lastType = undefined;
    const reduce = this._reducer.bind(this);
    const store = redux.createStore(reduce, webTools);
    store.subscribe(() => {
      const state = store.getState();
      this.emit('change', state);
      this.emit(`change-${this._lastType.replace(/\./g, '-')}`, get(state, this._lastType));
    });
    this.store = store;
  }

  _reducer(state, action) {
    // If is locked for new attributes
    if (state && this._locked && get(state, action.type) === undefined) return state;
    // eslint-disable-next-line no-param-reassign
    if (state === undefined) state = this._state;
    if (action.value === undefined || action.value === null) {
      unset(state, action.type);
    } else {
      set(state, action.type, action.value);
    }
    this._lastType = action.type;
    return state;
  }


  getState() {
    return this.store.getState();
  }

  setState(key, value) {
    // setState({ foo });
    if(value === undefined && typeof key === 'object') {
      const obj = key;
      Object.keys(obj).forEach((k) => {
        this.setState(k, obj[k]);
      })
    // setState('foo', 'bar');
    } else {
      this.store.dispatch({ type: key, value });
    }
  }
}

module.exports = Emitter;
