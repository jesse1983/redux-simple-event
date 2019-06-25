const Emitter = require('./index');

let emitter = new Emitter();
const state = {
  foo: 'bar',
  member: {
    firstName: 'John',
    lastName: 'Wick',
  },
};

const address = {
  street: {
    name: 'Rue De La Gauchatiere',
    number: 10,
  },
};

describe('Emitter check state', () => {
  beforeEach(() => { emitter = new Emitter(state); });

  it('expect foo changes', () => {
    emitter.setState('foo', 'foo');
    expect(emitter.getState().foo).toBe('foo');

    const foo = 'bar';
    const now = new Date();
    emitter.setState({ foo, now });
    emitter.setState({ address });
    address.street.number = 30;
    expect(emitter.getState().foo).toBe('bar');
    expect(emitter.getState().now).toBe(now);
    expect(emitter.getState().address.street.number).toBe(10);
  });

  it('expect member.firstName to be Carl', () => {
    emitter.setState('member.firstName', 'Carl');
    expect(emitter.getState().member.firstName).toBe('Carl');
  });

  it('expect member.age to be 10', () => {
    emitter.setState('member.age', 10);
    expect(emitter.getState().member.age).toBe(10);
  });

  it('expect has active and status', () => {
    const active = true;
    const status = 'PENDING';
    emitter.setState({ active, status });
    expect(emitter.getState().active).toBe(active);
    expect(emitter.getState().status).toBe(status);
  });

  it('expect remove status', () => {
    emitter.removeState('status');
    expect(emitter.getState().status).toBeUndefined();
  });
});

describe('Emitter check emitters', () => {
  let subsAll;
  let subsFoo;
  let subsMemberFirstName;
  let subsMemberLastName;
  let subsCity;
  beforeEach(() => {
    emitter = new Emitter(state);
    emitter.addListener('change', (val) => { subsAll = val; });
    emitter.addListener('change-foo', (val) => { subsFoo = val; });
    emitter.addListener('change-member-firstName', (val) => { subsMemberFirstName = val; });
    emitter.addListener('change-member-lastName', (val) => { subsMemberLastName = val; });
    emitter.addListener('change-member-location-city', (val) => { subsCity = val; });
    emitter.setState('foo', 'bar2');
    emitter.setState('member.firstName', 'Peter');
    emitter.setState('member.location.city', 'London');
    emitter.setState('member.lastName', null);
  });

  it('expect all changes', () => {
    expect(subsAll.foo).toBe('bar2');
  });

  it('expect foo changes', () => {
    expect(subsFoo).toBe('bar2');
  });

  it('expect member.firstName changes', () => {
    expect(subsMemberFirstName).toBe('Peter');
  });

  it('expect member.location.city changes', () => {
    expect(subsCity).toBe('London');
  });

  it('expect member.lastName is undefined', () => {
    expect(subsMemberLastName).toBeUndefined();
  });
});

describe('Emitter check opts', () => {
  beforeEach(() => { emitter = new Emitter(state, { locked: true }); });

  it('expect any is undefined', () => {
    emitter.setState('any', 'value');
    expect(emitter.getState().any).toBeUndefined();
  });
});


