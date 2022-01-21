import { counterSlice, increment, decrement, asyncInc } from './reducers';
import { createStore, Store } from '../src';

describe('store', () => {
  var store: Store<{ counter: number }>;
  beforeEach(() => {
    store = createStore({
      [counterSlice.name]: counterSlice.reducer,
    });

    store
      .select((state) => state.counter)
      .subscribe((counter) => console.log(counter));

    store
      .effectOn(increment(null).type)
      .subscribe((dispatch, state, action) => {
        console.log(
          'effectOn action is working.....',
          dispatch,
          state(),
          action
        );
      });
  });
  afterEach(() => {
    store.clean();
  });
  it('initial state', () => {
    expect(store.getState()).toEqual({ counter: 0 });
  });
  it('increment', () => {
    store.dispatch(increment(23));
    expect(store.getState()).toEqual({ counter: 23 });
  });
  it('decrement', () => {
    store.dispatch(decrement());
    expect(store.getState()).toEqual({ counter: -1 });
  });
  it('async increment', async () => {
    store.dispatch(asyncInc('asyncInc in acion'));
    expect(store.getState()).toEqual({ counter: 0 });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(store.getState()).toEqual({ counter: 1 });
  });
});
