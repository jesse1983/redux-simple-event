# redux-simple-event

- `npm i redux-simple-event`

```javascript
// store.js
const { ReduxSimpleEvent } = require('redux-simple-event');

class Store extends ReduxSimpleEvent {
  // methods
}

module.exports = new Store()
```

## Usage

Example:

```javascript
// Setting a value on state
store.setState('member.name', 'John');

// Getting a state value
store.getState();

// General listener
store.addListener('change', func);

// Or specific listener
store.addListener('change-member-name', func);
```

Server side:

```javascript
module.exports = new ReduxSimpleEvent({ foo: 'bar' }, { browser: false });

```

## Marko Usage

You can use `<provider />` component to encapsulate store.

```javascript
// my-store-instance.js

module.exports = new ReduxSimpleEvent({ foo: 'bar' });
```

```javascript
// index.marko

$ const myStoreInstance = require('../my-store-instance');

provider store=myStoreInstance
  @content|{ store }|
    inner-component ...store
```

```javascript
// inner-component/index.marko

div -- ${ input.store.getState().foo}
// or
div -- ${ input.foo }
```
