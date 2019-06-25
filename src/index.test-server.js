const Emitter = require('./index');

let emitter = new Emitter();
const state = {
  foo: 'bar',
  member: {
    firstName: 'John',
    lastName: 'Wick',
  },
};

describe('Emitter check opts', () => {
  beforeEach(() => { emitter = new Emitter(state, { browser: false }); });

  it('expect member.lastName to be equal Andreas', () => {
    emitter.setState('member.lastName', 'Andreas');
    expect(emitter.getState().member.lastName).toBe('Andreas');
  });

  it('expect member.lastName to be equal Andreas', () => {
    emitter.setState({ heroes: {
      spiderman: { 
        weapon: 'web' 
      },
      batman: false,
    } });
    expect(emitter.getState().heroes.spiderman.weapon).toBe('web');
  });  
});


