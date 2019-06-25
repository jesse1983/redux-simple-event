# redux-simple-event

- `npm i redux-simple-event`

```javascript
// controller.js
const ReduxSimpleEvent = require('@kenlo/redux-simple-event');

class ControllerEvent extends ReduxSimpleEvent {
  // methods
}

module.exports = new ControllerEvent({ foo: 'bar' });
```

## Usage

Example:

```javascript
// Setting a value on state
ctrl.setState('member.name', 'John');

// Getting a state value
ctrl.getState();

// General listener
ctrl.addListener('change', func);

// Or specific listener
ctrl.addListener('change-member-name', func);
```

Marko example:

```javascript
const ctrl = require('./controller');

class {
  onMount() {
    this.subscribeTo(ctrl).on('change', (state) => {
      this.setState(state);
    });
  }
}
```

Server side:

```javascript
module.exports = new ControllerEvent({ foo: 'bar' }, { browser: false });

```
