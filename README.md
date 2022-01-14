# reduxpp

Developed redux pattern different way so that developer life is easy, easy async state change, select, subscribe, unsubscribe

```ts
import { createReducer, AnyAction, PayloadAction } from 'reduxpp';

export const counterReducer = createReducer({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment(state, action: PayloadAction<number>) {
      return state + action.payload;
    },
    decrement(state) {
      return state - 1;
    },
  },
  efffecs: {
    async increment(state, action: AnyAction, dispatch) {
      console.log(state(), action, dispatch);
      dispatch(decrement());
    },
  },
});

export const { increment, decrement } = counterReducer.actions;

const store = createStore([counterReducer]);
store.select((state) => state.counter).subscribe(console.log);
store.dispatch(increment(23));
store.dispatch(decrement());
```
