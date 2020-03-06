const { ReduxSimpleEvent } = require('./index');

const state = {
  foo: 'bar',
  member: {
    firstName: 'John',
    lastName: 'Wick',
  },
};
let emitter = new ReduxSimpleEvent(state, { browser: false });

describe('Emitter check opts', () => {
  beforeEach(() => { emitter = new ReduxSimpleEvent(state, { browser: false }); });

  it('expect member.lastName to be equal Andreas', () => {
    emitter.setState('member.lastName', 'Andreas');
    expect(emitter.getState().member.lastName).toBe('Andreas');
    emitter.reset();
    expect(emitter.getState()).toStrictEqual({});
  });

  it('expect heroes.spiderman.weapon to be web', () => {
    emitter.setState({ heroes: {
      spiderman: {
        weapon: 'web'
      },
      batman: false,
    } });
    expect(emitter.getState().heroes.spiderman.weapon).toBe('web');
  });
});



