import { Store, createStore, Reducer, AnyAction } from 'redux';
import { set, get, unset, cloneDeep } from 'lodash';
import { EventEmitter } from 'events';

export class ReduxSimpleEvent extends EventEmitter {
  private browser: boolean = true;
  private locked: boolean = false;
  private state: Object = {};
  private lastType: string = '';
  public store: Store = createStore(() => {});

  constructor(obj:Object = {}, { locked = false, browser = typeof(window) !== 'undefined' } = {}) {
    super();
    this.browser = browser;
    this.locked = locked;
    this.state = obj;
    if (this.browser) {
      const enhancer = typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();
      this.lastType = '';
      const reduce: Reducer = this.reducer.bind(this);
      const store:Store = createStore(reduce, enhancer);
      store.subscribe(() => this.emitChanges(store));
      this.store = store;
    }
  }

  private emitChanges(store: Store) {
    const state = store.getState();
    this.emit('change', state);
    let terms = ['change'];
    this.lastType.split('.').forEach((e, i) => {
      terms = [...terms, e];
      this.emit(terms.join('-'), get(state, terms.join('.').replace('change.', '')));
    });
    if (this.lastType.indexOf('@@redux/INIT') > -1) this.emit('reset', state);
  }

  private reducer(state: Object, action: AnyAction):Object {
    // reset
    if (action.type === '__RESET__') {
      this.state = action.value;
      return action.value;
    }
    // If is locked for new attributes
    if (state && this.locked && get(state, action.type) === undefined) return state;
    // eslint-disable-next-line no-param-reassign
    if (state === undefined) state = this.state;
    if (action.value === undefined || action.value === null) {
      unset(state, action.type);
    } else {
      const isObj = (obj: { constructor: { name: string; }; } | null) => obj != null && obj.constructor.name === "Object";
      const value = isObj(action.value) ? cloneDeep(action.value) : action.value;
      set(state, action.type, value);
    }
    this.lastType = action.type;
    return state;
  }

  public reset(value = {}): void {
    if (this.browser) this.store.dispatch({ type: '__RESET__', value });
    else this.state = cloneDeep(value);
  }

  public getState():Object {
    if (this.browser) return this.store.getState();
    return this.state;
  }

  public setState(key:string, value:any): void {
    if(value === undefined && typeof key === 'object') {
      const obj = key;
      Object.keys(obj).forEach((k) => {
        this.setState(k, obj[k]);
      })
    } else {
      if (this.browser) this.store.dispatch({ type: key, value });
      else if (!this.browser && !this.locked) set(this.state, key, value)
    }
  }

  public removeState(key: string): void {
    return this.setState(key, null);
  }
}
