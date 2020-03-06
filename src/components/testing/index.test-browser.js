const { render, cleanup, fireEvent, wait } = require('@marko/testing-library');
const { ReduxSimpleEvent } = require('../../index');
const Template = require('./index.marko');


describe('<provider />', () => {
  afterEach(cleanup);

  test('expect component to be rendered', async () => {
    const { getByText } = await render(Template, { foo: 'qux' }, { container: document.body });

    expect(getByText(/qux/)).toBeTruthy();

    fireEvent.click(getByText('Change'));
    await wait(() => expect(getByText(/bar/)).toBeTruthy());
  });

  test('expect component paralelism', async () => {
    const component1 = await render(Template, { foo: 'baz' });
    const component2 = await render(Template, { foo: 'baz' });

    expect(component1.getByText(/baz/)).toBeTruthy();
    expect(component2.getByText(/baz/)).toBeTruthy();

    fireEvent.click(component1.getByText('Change'));
    await wait(() => expect(component1.getByText(/bar/)).toBeTruthy());
    await wait(() => expect(component2.getByText(/baz/)).toBeTruthy());
  });

  test('expect inject store', async () => {
    // Create store
    class Store extends ReduxSimpleEvent {
      addMovie(movie) {
        return this.setState({ movie });
      }

      removeMovie() {
        this.removeState('movie');
      }
    }
    const store = new Store({ foo: 'qux', movie: 'Pulp Fiction' });

    const component1 = await render(Template, { store });
    const component2 = await render(Template, { store });

    fireEvent.click(component1.getByText('Remove'));
    fireEvent.click(component2.getByText('Movie'));
    await wait(() => expect(component1.getByText(/no movie found/)).toBeTruthy());
    await wait(() => expect(component2.getByText(/Godfather/)).toBeTruthy());
  });
});
