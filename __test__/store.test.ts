import { counterReducer, increment, decrement } from './reducers';
import { createStore, Store } from '../src';

describe('store', () => {
  var store: Store<{ counter: number }>;
  beforeEach(() => {
    store = createStore([counterReducer]);
    store
      .select((state) => state.counter)
      .subscribe((counter) => console.log(counter));
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
});
